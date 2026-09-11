import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { HERO_VIDEO } from "../data/works";

export const Hero = () => {
  return (
    <section id="top" data-testid="hero-section" className="relative h-screen w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={HERO_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        data-testid="hero-video"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/50" />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 md:px-12 pb-16 md:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6"
          data-testid="hero-role"
        >
          Cinematographer / Director of Photography
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-light text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight max-w-5xl"
          data-testid="hero-title"
        >
          Light, motion<br />& emotion.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
          data-testid="hero-subtitle"
        >
          Crafting visual stories frame by frame. A cinematographer shaping
          atmosphere through composition, color and shadow.
        </motion.p>

        <motion.a
          href="#work"
          data-testid="hero-cta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.95 }}
          className="group mt-12 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-foreground w-fit"
        >
          <span className="border-b border-transparent group-hover:border-foreground transition-colors duration-300">
            View Selected Work
          </span>
          <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
        </motion.a>
      </div>
    </section>
  );
};
