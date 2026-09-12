from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
import resend
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Annotated
from bson import ObjectId
from pydantic import BeforeValidator
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

resend.api_key = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
OWNER_EMAIL = os.environ.get('OWNER_EMAIL')

app = FastAPI()
api_router = APIRouter(prefix="/api")


PyObjectId = Annotated[str, BeforeValidator(str)]


class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    subject: Optional[str] = Field(default="", max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str = ""
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


async def send_contact_notification(msg: "ContactMessage"):
    if not resend.api_key or not OWNER_EMAIL:
        logger.warning("Resend not configured; skipping email notification")
        return
    subject = f"New inquiry from {msg.name}" + (f" — {msg.subject}" if msg.subject else "")
    html = f"""
    <div style="font-family:Arial,sans-serif;background:#0a0a0a;color:#f5f5f5;padding:32px;">
      <h2 style="font-weight:400;letter-spacing:1px;margin:0 0 24px;">New Portfolio Inquiry</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#888;width:120px;">Name</td><td style="padding:8px 0;">{msg.name}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;">{msg.email}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Subject</td><td style="padding:8px 0;">{msg.subject or '—'}</td></tr>
      </table>
      <div style="margin-top:24px;padding-top:24px;border-top:1px solid #222;color:#ccc;line-height:1.6;">{msg.message}</div>
    </div>
    """
    params = {
        "from": f"Shoheb Creation <{SENDER_EMAIL}>",
        "to": [OWNER_EMAIL],
        "reply_to": msg.email,
        "subject": subject,
        "html": html,
    }
    try:
        await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Contact notification email sent for {msg.email}")
    except Exception as e:
        logger.error(f"Failed to send contact notification email: {e}")


async def send_auto_reply(msg: "ContactMessage"):
    if not resend.api_key:
        return
    html = f"""
    <div style="font-family:Georgia,'Times New Roman',serif;background:#0a0a0a;color:#f5f5f5;padding:48px 32px;max-width:560px;margin:0 auto;">
      <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#888;font-family:Arial,sans-serif;">Shoheb Creation</div>
      <h1 style="font-weight:300;font-size:36px;line-height:1.15;margin:24px 0 24px;letter-spacing:-0.5px;">
        Thank you, {msg.name}.
      </h1>
      <p style="font-family:Arial,sans-serif;color:#c9c9c9;line-height:1.7;font-size:15px;margin:0 0 20px;">
        Your message has landed. I read every inquiry personally and will be in touch within 24&ndash;48 hours to talk through your project.
      </p>
      <p style="font-family:Arial,sans-serif;color:#c9c9c9;line-height:1.7;font-size:15px;margin:0 0 32px;">
        In the meantime, feel free to explore more of my work on Instagram
        <a href="https://www.instagram.com/mr_shoheb.maniyar" style="color:#fff;text-decoration:underline;">@mr_shoheb.maniyar</a>.
      </p>
      <div style="border-top:1px solid #222;padding-top:24px;font-family:Arial,sans-serif;color:#777;font-size:12px;line-height:1.6;">
        <div style="color:#aaa;margin-bottom:6px;">Shoheb Maniyar</div>
        <div>Cinematographer &middot; Director of Photography</div>
        <div style="margin-top:10px;">shohebmaniyar7@gmail.com &middot; +91 8975466466</div>
      </div>
    </div>
    """
    params = {
        "from": f"Shoheb Creation <{SENDER_EMAIL}>",
        "to": [msg.email],
        "reply_to": OWNER_EMAIL or SENDER_EMAIL,
        "subject": "Thanks for reaching out — Shoheb Creation",
        "html": html,
    }
    try:
        await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Auto-reply sent to {msg.email}")
    except Exception as e:
        logger.error(f"Failed to send auto-reply: {e}")


@api_router.get("/")
async def root():
    return {"message": "Shoheb Creation API"}


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(payload: ContactMessageCreate):
    obj = ContactMessage(**payload.model_dump())
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    await send_contact_notification(obj)
    await send_auto_reply(obj)
    return obj


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contact_messages():
    docs = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
