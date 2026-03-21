import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navItems = [
  { label: "What We Do", href: "#what-we-do" },
  { label: "Products", href: "#products" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <a
          href="#"
          className={`font-semibold text-lg tracking-tight transition-colors duration-500 ${
            scrolled ? "text-foreground" : "text-hero-fg"
          }`}
        >
          Binder 33 Labs
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors duration-500 hover:text-primary ${
                scrolled ? "text-muted-foreground" : "text-hero-fg/60 hover:text-hero-fg"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 transition-colors duration-500 ${scrolled ? "text-foreground" : "text-hero-fg"}`}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1">
            <span className={`block h-px transition-all duration-200 ${scrolled ? "bg-foreground" : "bg-hero-fg"} ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
            <span className={`block h-px transition-all duration-200 ${scrolled ? "bg-foreground" : "bg-hero-fg"} ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px transition-all duration-200 ${scrolled ? "bg-foreground" : "bg-hero-fg"} ${mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: [0.16, 1, 0.3, 1] }}
          className={`md:hidden backdrop-blur-xl border-b border-border ${
            scrolled ? "bg-background/95" : "bg-hero-bg/95"
          }`}
        >
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm transition-colors ${
                  scrolled ? "text-muted-foreground hover:text-foreground" : "text-hero-fg/60 hover:text-hero-fg"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
