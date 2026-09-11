import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Mail, Phone, Instagram, ArrowUpRight } from "lucide-react";
import { CONTACT } from "../data/works";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success("Message sent. I'll be in touch soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-transparent border-0 border-b border-border py-4 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors duration-300";

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="px-6 md:px-12 py-24 md:py-36 border-t border-border"
    >
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
        03 / Contact
      </p>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-none"
      >
        Let&apos;s create<br />together.
      </motion.h2>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <form onSubmit={handleSubmit} data-testid="contact-form" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={update("name")}
              className={inputCls}
              data-testid="contact-name"
            />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={update("email")}
              className={inputCls}
              data-testid="contact-email"
            />
          </div>
          <input
            type="text"
            placeholder="Subject (optional)"
            value={form.subject}
            onChange={update("subject")}
            className={inputCls}
            data-testid="contact-subject"
          />
          <textarea
            placeholder="Tell me about your project"
            value={form.message}
            onChange={update("message")}
            rows={4}
            className={`${inputCls} resize-none`}
            data-testid="contact-message"
          />
          <button
            type="submit"
            disabled={loading}
            data-testid="contact-submit"
            className="group inline-flex items-center gap-3 border border-foreground px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-foreground hover:bg-foreground hover:text-background transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        </form>

        <div className="space-y-10">
          <a
            href={`mailto:${CONTACT.email}`}
            data-testid="contact-link-email"
            className="group flex items-center gap-4 border-b border-border pb-6 hover:border-foreground transition-colors duration-300"
          >
            <Mail className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Email</div>
              <div className="font-serif text-xl md:text-2xl">{CONTACT.email}</div>
            </div>
          </a>
          <a
            href={`tel:${CONTACT.phone}`}
            data-testid="contact-link-phone"
            className="group flex items-center gap-4 border-b border-border pb-6 hover:border-foreground transition-colors duration-300"
          >
            <Phone className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Phone</div>
              <div className="font-serif text-xl md:text-2xl">{CONTACT.phone}</div>
            </div>
          </a>
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="contact-link-instagram"
            className="group flex items-center gap-4 border-b border-border pb-6 hover:border-foreground transition-colors duration-300"
          >
            <Instagram className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Instagram</div>
              <div className="font-serif text-xl md:text-2xl">{CONTACT.instagramHandle}</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
