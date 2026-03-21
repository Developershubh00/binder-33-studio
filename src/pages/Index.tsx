import { useState, useCallback } from "react";
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
import PageIntro from "@/components/PageIntro";

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <div className="min-h-screen">
      <PageIntro onComplete={handleIntroComplete} />
      <CustomCursor />
      <ScrollProgress />
      {introComplete && <Navbar />}
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
