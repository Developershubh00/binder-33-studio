import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-hero-bg text-hero-fg py-20 md:py-28">
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-hero-fg/80 mb-16"
        >
          We build things that work.
        </motion.p>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pt-10 border-t border-hero-fg/10">
          <p className="text-sm font-medium text-hero-fg/60">Binder 33 Labs</p>
          <nav className="flex flex-wrap gap-8">
            <a href="#about" className="text-sm text-hero-fg/40 hover:text-hero-fg transition-colors duration-300">About</a>
            <a href="#products" className="text-sm text-hero-fg/40 hover:text-hero-fg transition-colors duration-300">Products</a>
            <a href="https://binderos.com" target="_blank" rel="noopener noreferrer" className="text-sm text-hero-fg/40 hover:text-hero-fg transition-colors duration-300">Binder OS</a>
            <a href="#contact" className="text-sm text-hero-fg/40 hover:text-hero-fg transition-colors duration-300">Contact</a>
          </nav>
        </div>

        <div className="mt-10">
          <p className="font-mono text-xs text-hero-fg/20 tracking-wide">© {new Date().getFullYear()} Binder 33 Labs</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
