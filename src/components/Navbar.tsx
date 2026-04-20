import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import logoDark from "@/assets/logo-dark.png";
import { useAuth } from "@/lib/auth";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "inicio", label: "Início", route: "/" },
  { id: "servicos", label: "Serviços", route: "/#servicos" },
  { id: "packs", label: "Packs", route: "/#packs" },
  { id: "transferes", label: "Transferes", route: "/transferes" },
  { id: "sobre", label: "Sobre Nós", route: "/sobre-nos" },
  { id: "reservar", label: "Reservar", route: "/#reservar", highlight: true },
];

const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const dynamicTabs = [
    ...tabs,
    { 
      id: "conta", 
      label: user ? "A Minha Conta" : "Login", 
      route: user ? "/area-cliente" : "/login",
      variant: "secondary"
    }
  ];

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
    <nav className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-7xl glass rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-between h-16 md:h-24 px-6 md:px-12 premium-shadow relative">
        <img
          src={logoDark}
          alt="Nauticare"
          className="w-auto h-6 md:h-10 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => handleClick(tabs[0])}
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {dynamicTabs.map((tab) => {
            const isActive = 
              (tab.id === "inicio" && location.pathname === "/") ||
              (tab.id === "sobre" && location.pathname === "/sobre-nos") ||
              (tab.id === "transferes" && location.pathname === "/transferes") ||
              (tab.id === "conta" && (location.pathname === "/login" || location.pathname === "/area-cliente" || location.pathname.startsWith("/perfil"))) ||
              (location.pathname === "/" && activeTab === tab.id && tab.id !== 'inicio' && tab.id !== 'sobre' && tab.id !== 'transferes' && tab.id !== 'conta');
            
            const isHighlight = 'highlight' in tab && tab.highlight;
            const isSecondary = 'variant' in tab && tab.variant === 'secondary';

            if (tab.id === "conta" && user) {
                return (
                    <div key={tab.id} className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                        <button
                            className={`px-6 py-2.5 font-display text-sm uppercase tracking-widest transition-all rounded-full ml-2 shadow-sm border ${
                                isActive 
                                    ? "bg-white text-primary border-primary" 
                                    : "glass border-primary/20 text-primary hover:bg-primary hover:text-white"
                            }`}
                        >
                            {tab.label}
                        </button>
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 15 }}
                                    className="absolute right-0 mt-3 w-64 glass rounded-3xl shadow-2xl border border-white/20 py-3 z-[60]"
                                >
                                    <div className="px-4 pb-2 mb-2 border-b border-primary/5">
                                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Elite Member</p>
                                    </div>
                                    <button onClick={() => navigate('/area-cliente')} className="w-full text-left px-5 py-3 text-sm font-semibold hover:bg-primary/5 transition-colors">Nauticare Elite</button>
                                    <button onClick={() => navigate('/perfil/dados')} className="w-full text-left px-5 py-3 text-sm font-semibold hover:bg-primary/5 transition-colors">Dados Pessoais</button>
                                    <button onClick={() => navigate('/perfil/reservas')} className="w-full text-left px-5 py-3 text-sm font-semibold hover:bg-primary/5 transition-colors">As Minhas Reservas</button>
                                    <button 
                                        onClick={async () => { await logout(); navigate('/'); }} 
                                        className="w-full text-left px-5 py-4 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-primary/5 mt-2 rounded-b-3xl"
                                    >Sair</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            }

            return (
              <button
                key={tab.id}
                onClick={() => handleClick(tab as typeof tabs[0])}
                className={`relative px-6 py-2.5 font-display text-sm uppercase tracking-widest transition-all rounded-full font-bold shadow-sm border ${
                  isHighlight
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                    : isSecondary
                      ? isActive
                        ? "bg-white text-primary border-primary"
                        : "glass border-primary/20 text-primary hover:bg-primary hover:text-white"
                      : isActive
                        ? "text-primary bg-primary/5 border-primary/10"
                        : "text-foreground/60 border-transparent hover:text-primary hover:bg-primary/5"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 bg-primary/5 rounded-full gap-1 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
        >
          <span className={`block w-5 h-0.5 bg-foreground transition-transform duration-300 ${mobileOpen ? "rotate-45 translate-y-[1.5px]" : ""}`} />
          <span className={`block w-5 h-0.5 bg-foreground transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-foreground transition-transform duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[1.5px]" : ""}`} />
        </button>

      </div>

      {/* Mobile Menu - Moved outside the inner container for better positioning */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-24 left-4 right-4 glass rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden"
            >
              <div className="flex flex-col py-4">
                {dynamicTabs.map((tab) => {
                  const isActive = 
                    (tab.id === "inicio" && location.pathname === "/") ||
                    (tab.id === "sobre" && location.pathname === "/sobre-nos") ||
                    (tab.id === "transferes" && location.pathname === "/transferes") ||
                    (tab.id === "conta" && (location.pathname === "/login" || location.pathname === "/area-cliente" || location.pathname.startsWith("/perfil"))) ||
                    (location.pathname === "/" && activeTab === tab.id && tab.id !== 'inicio' && tab.id !== 'sobre' && tab.id !== 'transferes' && tab.id !== 'conta');
                  
                  const isHighlight = 'highlight' in tab && tab.highlight;
                  const isSecondary = 'variant' in tab && tab.variant === 'secondary';

                  if (tab.id === "conta" && user) {
                    return (
                      <div key={tab.id} className="flex flex-col bg-primary/5 my-2 mx-4 rounded-[1.5rem] overflow-hidden border border-primary/10">
                        <div className="px-6 py-3 bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">A Minha Conta</div>
                        <button onClick={() => { setMobileOpen(false); navigate('/area-cliente'); }} className="px-6 py-4 text-left text-sm font-semibold hover:bg-white/50 transition-colors">Nauticare Elite</button>
                        <button onClick={() => { setMobileOpen(false); navigate('/perfil/dados'); }} className="px-6 py-4 text-left text-sm font-semibold hover:bg-white/50 transition-colors">Dados Pessoais</button>
                        <button onClick={() => { setMobileOpen(false); navigate('/perfil/reservas'); }} className="px-6 py-4 text-left text-sm font-semibold hover:bg-white/50 transition-colors">As Minhas Reservas</button>
                        <button 
                          onClick={async () => { setMobileOpen(false); await logout(); navigate('/'); }} 
                          className="px-6 py-4 text-left text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-primary/5"
                        >Sair</button>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleClick(tab as typeof tabs[0])}
                      className={`block w-full text-left px-8 py-4 font-display text-sm uppercase tracking-[0.15em] transition-colors ${
                        isActive ? "text-primary font-black" : "text-foreground/70 font-bold"
                      } ${
                        isHighlight ? "bg-primary text-white my-1 mx-4 w-auto rounded-2xl shadow-lg shadow-primary/20" : ""
                      } ${
                        isSecondary ? "border-2 border-primary/20 text-primary my-1 mx-4 w-auto rounded-2xl" : ""
                      }`}
                    >
                      {tab.label}
                    </button>
                  )}
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
