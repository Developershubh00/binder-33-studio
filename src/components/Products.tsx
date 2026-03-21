import { motion } from "framer-motion";

const Products = () => {
  return (
    <section id="products" className="py-32">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold tracking-tight mb-16"
        >
          Our Products
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-lg p-8 md:p-12 relative overflow-hidden"
        >
          {/* Accent line */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs uppercase tracking-widest text-primary">Flagship</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
            Binder OS
          </h3>
          <p className="text-primary text-sm mb-6">
            A factory's nervous system — the Textile Manufacturing Operating System.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-4">
            Binder OS is a complete operating system for India's textile SMEs,
            exporters, and job workers. It replaces fragmented spreadsheets and
            WhatsApp coordination with a single system of record — covering
            inventory, job orders, traceability, documentation, and an AI-powered
            COO Agent that monitors operations through Telegram.
          </p>
          <p className="text-muted-foreground/70 text-sm italic mb-8">
            Built from first-hand experience running a textile factory in Panipat —
            India's home textile capital.
          </p>
          <a
            href="https://binderos.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-foreground transition-colors duration-200"
          >
            Explore Binder OS
            <span aria-hidden="true">→</span>
          </a>

          <p className="mt-12 text-xs text-muted-foreground/50">
            More products in development.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
