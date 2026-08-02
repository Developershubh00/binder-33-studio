import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-24 md:py-32 relative overflow-hidden">
      {/* Top divider with glow */}
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="mb-20"
        >
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground/65 leading-tight max-w-2xl glow-text">
            We build things<br />that work.
          </p>
        </motion.div>

        <div className="h-px bg-foreground/8 mb-12" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-foreground/30 rounded-full" style={{ boxShadow: '0 0 6px rgba(255,255,255,0.15)' }} />
            <p className="text-sm font-medium text-foreground/45 tracking-wide">Binder 33 Labs</p>
          </div>
          <nav className="flex flex-wrap gap-10">
            <a href="#about" className="text-foreground/35 hover:text-foreground/60 transition-colors duration-500 font-mono text-xs tracking-wider">About</a>
            <a href="#products" className="text-foreground/35 hover:text-foreground/60 transition-colors duration-500 font-mono text-xs tracking-wider">Products</a>
            <a href="https://binderos.com" target="_blank" rel="noopener noreferrer" className="text-foreground/35 hover:text-foreground/60 transition-colors duration-500 font-mono text-xs tracking-wider">Binder OS</a>
            <a href="https://creative-wizards.com" target="_blank" rel="noopener noreferrer" className="text-foreground/35 hover:text-foreground/60 transition-colors duration-500 font-mono text-xs tracking-wider">Creative Wizard</a>
            <a href="#contact" className="text-foreground/35 hover:text-foreground/60 transition-colors duration-500 font-mono text-xs tracking-wider">Contact</a>
          </nav>
        </div>

        <div className="mt-12">
          <p className="font-mono text-[10px] text-foreground/20 tracking-[0.3em]">
            © {new Date().getFullYear()} BINDER 33 LABS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
