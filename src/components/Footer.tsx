const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="text-sm text-foreground font-medium">Binder 33 Labs</p>
            <p className="text-xs text-muted-foreground">We build things that work.</p>
          </div>
          <nav className="flex flex-wrap gap-6">
            <a href="#about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#products" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Products</a>
            <a href="https://binderos.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Binder OS</a>
            <a href="#contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground/50">© {new Date().getFullYear()} Binder 33 Labs</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
