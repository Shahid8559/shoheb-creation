import { CONTACT } from "../data/works";

export const Footer = () => {
  return (
    <footer data-testid="footer" className="px-6 md:px-12 py-10 border-t border-border">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="font-serif text-lg">Shoheb Creation</div>
        <div className="flex items-center gap-6">
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            Instagram
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            Email
          </a>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          © {new Date().getFullYear()} — All rights reserved
        </div>
      </div>
    </footer>
  );
};
