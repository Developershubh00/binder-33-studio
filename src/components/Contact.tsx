import { useState } from "react";
import { motion } from "framer-motion";

const sharp = [0.16, 1, 0.3, 1];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:info@binder33labs.com?subject=Contact from ${form.name}&body=${form.message}%0A%0AFrom: ${form.name} (${form.email})`;
  };

  return (
    <section id="contact" className="py-36 md:py-44">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: sharp }}
          className="mb-20"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-primary/60 mb-4 block">
            Connect
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Get in Touch
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: sharp }}
            className="space-y-8"
          >
            <div>
              <a
                href="mailto:info@binder33labs.com"
                className="group text-2xl md:text-3xl font-bold text-foreground hover:text-primary transition-colors duration-300 relative inline-block"
              >
                info@binder33labs.com
                <span className="absolute bottom-0 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </a>
            </div>
            <p className="font-mono text-xs tracking-wider text-muted-foreground/60 uppercase">
              Based in Panipat, Haryana, India
            </p>
            <div className="flex gap-5 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                aria-label="X / Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: sharp }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {[
              { type: "text", placeholder: "Name", key: "name" as const },
              { type: "email", placeholder: "Email", key: "email" as const },
            ].map((field) => (
              <div key={field.key} className="relative">
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  required
                  className="w-full bg-transparent border-b border-border px-0 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-colors peer"
                />
                <span className="absolute bottom-0 left-0 w-full h-px bg-primary scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
            <div className="relative">
              <textarea
                placeholder="Message"
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                className="w-full bg-transparent border-b border-border px-0 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none transition-colors peer"
              />
              <span className="absolute bottom-0 left-0 w-full h-px bg-primary scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
            <button
              type="submit"
              className="group inline-flex items-center gap-3 text-sm font-medium text-primary border border-primary/30 px-7 py-3.5 rounded hover:bg-primary hover:text-primary-foreground transition-all duration-300 mt-4"
            >
              Send Message
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
