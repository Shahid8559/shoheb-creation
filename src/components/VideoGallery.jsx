import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Volume2 } from "lucide-react";
import { WORKS } from "../data/works";

const VideoCard = ({ work, onOpen, className = "" }) => {
  const ref = useRef(null);
  const rafRef = useRef(null);
  const [needsClick, setNeedsClick] = useState(false);

  const cancelFade = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const fadeVolume = (from, to, duration, onDone) => {
    cancelFade();
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const v = from + (to - from) * t;
      const el = ref.current;
      if (el) el.volume = Math.max(0, Math.min(1, v));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        if (onDone) onDone();
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const handleEnter = async () => {
    const v = ref.current;
    if (!v) return;
    cancelFade();
    v.volume = 0;
    v.muted = false;
    try {
      await v.play();
      setNeedsClick(false);
      fadeVolume(0, 0.3, 800);
    } catch {
      // Autoplay-with-sound blocked — keep playing silently, prompt user
      v.muted = true;
      try {
        await v.play();
      } catch {}
      setNeedsClick(true);
    }
  };

  const posterTime = (el) => Math.min(1.2, Math.max(0.1, (el?.duration || 0) * 0.15));

  const handleLeave = () => {
    const v = ref.current;
    if (!v) return;
    const startVol = v.muted ? 0 : v.volume;
    setNeedsClick(false);
    fadeVolume(startVol, 0, 800, () => {
      const el = ref.current;
      if (!el) return;
      el.muted = true;
      el.pause();
      try { el.currentTime = posterTime(el); } catch {}
    });
  };

  const handleEnableSound = async (e) => {
    e.stopPropagation();
    const v = ref.current;
    if (!v) return;
    cancelFade();
    v.volume = 0;
    v.muted = false;
    try {
      await v.play();
      setNeedsClick(false);
      fadeVolume(0, 0.3, 800);
    } catch {
      setNeedsClick(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden cursor-pointer bg-secondary ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={() => onOpen(work)}
      data-testid={`work-card-${work.id}`}
    >
      <video
        ref={ref}
        src={work.src}
        muted
        loop
        playsInline
        preload="auto"
        onLoadedMetadata={(e) => {
          const el = e.currentTarget;
          try {
            const target = Math.min(1.2, Math.max(0.1, (el.duration || 0) * 0.15));
            el.currentTime = target;
          } catch {}
        }}
        className="h-full w-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />

      {needsClick && (
        <button
          type="button"
          onClick={handleEnableSound}
          data-testid={`sound-toggle-${work.id}`}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/25 text-white/85 hover:text-white text-[10px] font-mono uppercase tracking-[0.15em] px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Volume2 className="w-3 h-3" />
          Click for sound
        </button>
      )}

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/60 backdrop-blur-sm">
          <Play className="w-5 h-5 fill-white text-white ml-0.5" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex items-end justify-between">
        <div>
          <h3 className="font-serif text-2xl md:text-3xl font-light leading-none">
            {work.title}
          </h3>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {work.category}
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {work.year}
        </span>
      </div>
    </motion.div>
  );
};

export const VideoGallery = ({ onOpen }) => {
  return (
    <section id="work" data-testid="work-section" className="px-6 md:px-12 py-24 md:py-36">
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
            01 / Selected Work
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-light tracking-tight">
            Featured Reels
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-2">
        <VideoCard
          work={WORKS[0]}
          onOpen={onOpen}
          className="md:col-span-8 aspect-video md:aspect-[16/9]"
        />
        <VideoCard
          work={WORKS[1]}
          onOpen={onOpen}
          className="md:col-span-4 aspect-video md:aspect-auto"
        />
        <VideoCard
          work={WORKS[2]}
          onOpen={onOpen}
          className="md:col-span-4 aspect-video"
        />
        <VideoCard
          work={WORKS[3]}
          onOpen={onOpen}
          className="md:col-span-4 aspect-video"
        />
        <VideoCard
          work={WORKS[4]}
          onOpen={onOpen}
          className="md:col-span-4 aspect-video"
        />
      </div>
    </section>
  );
};
