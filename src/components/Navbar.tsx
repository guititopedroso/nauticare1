import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import logoDark from "@/assets/logo-dark.png";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "inicio", label: "Início", route: "/" },
  { id: "servicos", label: "Serviços", route: "/#servicos" },
  { id: "packs", label: "Packs", route: "/#packs" },
  { id: "sobre", label: "Sobre Nós", route: "/sobre-nos" },
  { id: "reservar", label: "Reservar", route: "/#reservar", highlight: true },
];

const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Effect to close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleClick = (tab: typeof tabs[0]) => {
    // Close mobile menu on click
    setMobileOpen(false);

    if (tab.route.startsWith("/#")) {
      if (location.pathname === "/") {
        onTabChange(tab.id);
      } else {
        navigate(tab.route);
      }
    } else {
        navigate(tab.route);
        // If navigating to home, also scroll to top
        if (tab.id === 'inicio') {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-20 md:h-28">
        <img
          src={logoDark}
          alt="Nauticare"
          className="w-auto h-auto max-h-8 md:max-h-10 cursor-pointer"
          onClick={() => handleClick(tabs[0])}
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = 
              (tab.id === "inicio" && location.pathname === "/") ||
              (tab.id === "sobre" && location.pathname === "/sobre-nos") ||
              (location.pathname === "/" && activeTab === tab.id && tab.id !== 'inicio' && tab.id !== 'sobre');
            const isHighlight = 'highlight' in tab && tab.highlight;
            return (
              <button
                key={tab.id}
                onClick={() => handleClick(tab)}
                className={`relative px-5 py-2 font-body text-sm uppercase tracking-widest transition-colors ${
                  isHighlight
                    ? "bg-primary text-primary-foreground rounded-sm ml-2 hover:bg-primary/90"
                    : isActive
                      ? "text-primary"
                      : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {tab.label}
                {isActive && !isHighlight && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 p-2 group"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
        >
          <span className={`block w-6 h-0.5 bg-foreground transition-transform duration-300 ease-in-out ${mobileOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-opacity duration-300 ease-in-out ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-transform duration-300 ease-in-out ${mobileOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="flex flex-col py-2">
              {tabs.map((tab) => {
                const isActive = 
                  (tab.id === "inicio" && location.pathname === "/") ||
                  (tab.id === "sobre" && location.pathname === "/sobre-nos") ||
                  (location.pathname === "/" && activeTab === tab.id && tab.id !== 'inicio' && tab.id !== 'sobre');
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleClick(tab)}
                    className={`block w-full text-left px-6 py-4 font-body text-base uppercase tracking-wider transition-colors ${
                      isActive ? "text-primary font-semibold" : "text-foreground/70"
                    } ${
                      tab.highlight ? "bg-primary/10 text-primary font-bold my-1 mx-4 w-auto rounded-md" : ""
                    }`}
                  >
                    {tab.label}
                  </button>
                )}
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
