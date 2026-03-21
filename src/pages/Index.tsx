import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import Products from "@/components/Products";
import Approach from "@/components/Approach";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";

const Index = () => {
  return (
    <div className="min-h-screen">
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <WhatWeDo />
      <Products />
      <Approach />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
