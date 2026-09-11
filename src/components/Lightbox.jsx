import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const Lightbox = ({ work, onClose }) => {
  return (
    <AnimatePresence>
      {work && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10"
          onClick={onClose}
          data-testid="lightbox-overlay"
        >
          <button
            onClick={onClose}
            data-testid="lightbox-close"
            className="absolute top-6 right-6 z-10 flex h-11 w-11 items-center justify-center border border-white/30 text-foreground hover:bg-white hover:text-black transition-colors duration-300"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="lightbox-content"
          >
            <div className="mb-4 flex items-end justify-between">
              <h3 className="font-serif text-3xl md:text-4xl font-light">{work.title}</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {work.category} — {work.year}
              </span>
            </div>
            <video
              src={work.src}
              controls
              autoPlay
              playsInline
              className="w-full aspect-video bg-black"
              data-testid="lightbox-video"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
