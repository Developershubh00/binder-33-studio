import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTextScramble } from "@/hooks/useTextScramble";

const sharp = [0.16, 1, 0.3, 1];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true });
  const heading = useTextScramble("Get in Touch", { trigger: isInView, speed: 35 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:info@binder33labs.com?subject=Contact from ${form.name}&body=${form.message}%0A%0AFrom: ${form.name} (${form.email})`;
  };

  return (
    <section id="contact" className="py-36 md:py-48">
      <div className="container mx-auto px-6">
        <div ref={headingRef}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: sharp }}
            className="mb-24"
          >
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground/35 mb-5 block">
              // Connect
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-[3.8rem] font-bold tracking-tight text-foreground">
              {heading || "Get in Touch"}
            </h2>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-20 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="space-y-10"
          >
            <div>
              <a
                href="mailto:info@binder33labs.com"
                className="group text-2xl md:text-4xl font-bold text-foreground hover:text-foreground/70 transition-colors duration-500 relative inline-block tracking-tight"
                style={{ textShadow: '0 0 20px rgba(255,255,255,0.05)' }}
              >
                info@binder33labs.com
                <span className="absolute -bottom-2 left-0 w-full h-px bg-foreground/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
                  style={{ boxShadow: '0 0 8px rgba(255,255,255,0.1)' }}
                />
              </a>
            </div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60 uppercase">
              Based in Panipat, Haryana, India
            </p>
            <div className="flex gap-6 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/20 hover:text-foreground/60 transition-colors duration-500"
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
                className="text-foreground/20 hover:text-foreground/60 transition-colors duration-500"
                aria-label="X / Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {[
              { type: "text", placeholder: "Name", key: "name" as const },
              { type: "email", placeholder: "Email", key: "email" as const },
            ].map((field) => (
              <div key={field.key} className="relative group">
                <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/50 mb-2 block">
                  {field.placeholder}
                </label>
                <input
                  type={field.type}
                  placeholder={`Your ${field.placeholder.toLowerCase()}`}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  required
                  className="w-full bg-transparent border-b border-foreground/20 px-0 py-3 text-[15px] text-foreground placeholder:text-foreground/40 focus:outline-none transition-all duration-500 peer"
                />
                <span className="absolute bottom-0 left-0 w-full h-px bg-foreground/40 scale-x-0 peer-focus:scale-x-100 transition-transform duration-700 origin-left"
                  style={{ boxShadow: '0 0 6px rgba(255,255,255,0.08)' }}
                />
              </div>
            ))}
            <div className="relative group">
              <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/50 mb-2 block">
                Message
              </label>
              <textarea
                placeholder="Tell us about your project"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                className="w-full bg-transparent border-b border-foreground/20 px-0 py-3 text-[15px] text-foreground placeholder:text-foreground/40 focus:outline-none resize-none transition-all duration-500 peer"
              />
              <span className="absolute bottom-0 left-0 w-full h-px bg-foreground/40 scale-x-0 peer-focus:scale-x-100 transition-transform duration-700 origin-left"
                style={{ boxShadow: '0 0 6px rgba(255,255,255,0.08)' }}
              />
            </div>
            <button
              type="submit"
              className="group inline-flex items-center gap-3 text-sm font-medium text-background bg-foreground/90 px-8 py-3.5 rounded-sm hover:bg-foreground transition-all duration-300 mt-4"
              style={{ boxShadow: '0 0 15px rgba(255,255,255,0.08)' }}
            >
              Send Message
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
