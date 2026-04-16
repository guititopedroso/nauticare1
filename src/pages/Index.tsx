import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PacksSection from "@/components/PacksSection";
import BookingSection from "@/components/BookingSection";
import ElitePromo from "@/components/ElitePromo";
import Footer from "@/components/Footer";

const Index = () => {
  const [activeTab, setActiveTab] = useState("inicio");
  const location = useLocation();

  const servicosRef = useRef<HTMLDivElement>(null);
  const packsRef = useRef<HTMLDivElement>(null);
  const reservarRef = useRef<HTMLDivElement>(null);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      servicos: servicosRef,
      packs: packsRef,
      reservar: reservarRef,
    };

    if (tab === "inicio") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (refs[tab]?.current) {
      refs[tab].current!.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Track scroll position to update active tab
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      const sections = [
        { id: "reservar", ref: reservarRef },
        { id: "packs", ref: packsRef },
        { id: "servicos", ref: servicosRef },
      ];

      for (const section of sections) {
        if (section.ref.current) {
          const top = section.ref.current.offsetTop - windowHeight * 0.4;
          if (scrollY >= top) {
            setActiveTab(section.id);
            return;
          }
        }
      }

      setActiveTab("inicio");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => handleTabChange(hash), 100);
    }
  }, [location, handleTabChange]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      <HeroSection />
      <div ref={servicosRef}>
        <ServicesSection />
      </div>
      <div ref={packsRef}>
        <PacksSection />
      </div>
      <ElitePromo />
      <div ref={reservarRef}>
        <BookingSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
