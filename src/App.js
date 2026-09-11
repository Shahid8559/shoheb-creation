import { useState } from "react";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { VideoGallery } from "@/components/VideoGallery";
import { Lightbox } from "@/components/Lightbox";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

function App() {
  const [active, setActive] = useState(null);

  return (
    <div className="App film-grain bg-background min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <VideoGallery onOpen={setActive} />
        <About />
        <Contact />
      </main>
      <Footer />
      <Lightbox work={active} onClose={() => setActive(null)} />
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}

export default App;
