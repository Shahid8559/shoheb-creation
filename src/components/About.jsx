import { motion } from "framer-motion";

const STATS = [
  { value: "6+", label: "Years Behind the Lens" },
  { value: "80+", label: "Projects Delivered" },
  { value: "12", label: "Awards & Selections" },
];

export const About = () => {
  return (
    <section
      id="about"
      data-testid="about-section"
      className="grid grid-cols-1 lg:grid-cols-2 border-t border-border"
    >
      <div className="relative h-[60vh] lg:h-auto lg:sticky lg:top-0 overflow-hidden border-b lg:border-b-0 lg:border-r border-border">
        <img
          src="https://images.pexels.com/photos/13812458/pexels-photo-13812458.jpeg"
          alt="Cinematographer at work"
          className="h-full w-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="px-6 md:px-12 py-24 md:py-36">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6"
        >
          02 / About
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight max-w-xl"
        >
          I chase the light that makes a moment unforgettable.
        </motion.h2>

        <div className="mt-10 space-y-6 max-w-lg text-base md:text-lg text-muted-foreground leading-relaxed">
          <p>
            I&apos;m the eye behind Shoheb Creation — a cinematographer devoted to
            translating raw emotion into cinematic frames. From intimate
            narratives to bold commercial work, every project begins with a
            single question: how should this feel?
          </p>
          <p>
            Working closely with directors and brands, I shape mood through
            lensing, movement and color, building images that linger long after
            the final frame.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-6 border-t border-border pt-10">
          {STATS.map((s) => (
            <div key={s.label} data-testid={`stat-${s.label}`}>
              <div className="font-serif text-4xl md:text-5xl font-light">{s.value}</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
