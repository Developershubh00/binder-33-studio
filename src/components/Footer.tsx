import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-hero-bg text-hero-fg py-24 md:py-32 relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(184,115,51,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,115,51,1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="mb-20"
        >
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-hero-fg/70 leading-tight max-w-2xl">
            We build things<br />that work.
          </p>
        </motion.div>

        <div className="h-px bg-hero-fg/10 mb-12" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <p className="text-sm font-medium text-hero-fg/50 tracking-wide">Binder 33 Labs</p>
          </div>
          <nav className="flex flex-wrap gap-10">
            <a href="#about" className="text-sm text-hero-fg/30 hover:text-primary transition-colors duration-500 font-mono text-xs tracking-wider">About</a>
            <a href="#products" className="text-sm text-hero-fg/30 hover:text-primary transition-colors duration-500 font-mono text-xs tracking-wider">Products</a>
            <a href="https://binderos.com" target="_blank" rel="noopener noreferrer" className="text-sm text-hero-fg/30 hover:text-primary transition-colors duration-500 font-mono text-xs tracking-wider">Binder OS</a>
            <a href="#contact" className="text-sm text-hero-fg/30 hover:text-primary transition-colors duration-500 font-mono text-xs tracking-wider">Contact</a>
          </nav>
        </div>

        <div className="mt-12">
          <p className="font-mono text-[10px] text-hero-fg/15 tracking-[0.3em]">
            © {new Date().getFullYear()} BINDER 33 LABS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
