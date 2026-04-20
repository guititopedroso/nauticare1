import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import transfersHero from "@/assets/transfers-hero.png";
import { ArrowRight, Anchor, Shield, Truck, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Transfers = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <Truck className="w-8 h-8 text-primary" />,
      title: "Transporte para Oficinas",
      description: "Tratamos de toda a logística para levar a sua embarcação a manutenções ou reparações técnicas.",
    },
    {
      icon: <Anchor className="w-8 h-8 text-primary" />,
      title: "Mudança de Marina",
      description: "Movemos o seu barco entre marinas com skippers experientes e total cuidado com a navegação.",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Segurança Garantida",
      description: "Protocolos rigorosos de segurança e reporte em tempo real durante todo o trajeto do transfer.",
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: "Entrega e Recolha",
      description: "Serviço personalizado de entrega e recolha de embarcações no local e hora que mais lhe convier.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab="transferes" onTabChange={() => {}} />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-48 md:pb-32 overflow-hidden">
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 mb-6 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-primary bg-primary/10 rounded-full">
                  Novo Serviço Premium
                </span>
                <h1 className="text-3xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
                  Serviços de <span className="text-primary">Transferes</span>
                </h1>
                <p className="font-body text-muted-foreground text-sm md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Levamos a sua embarcação onde for preciso, com a máxima segurança e profissionalismo. 
                  Desde idas à oficina até mudanças de marina, tratamos de tudo por si.
                </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                  <button 
                    onClick={() => navigate("/pedir-orcamento-transferes")}
                    className="px-8 py-4 bg-primary text-white rounded-full font-display font-bold text-xs md:text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    Pedir Orçamento <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                        const el = document.getElementById('details');
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-4 glass border-primary/20 text-primary rounded-full font-display font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-primary/5 transition-all"
                  >
                    Saber Mais
                  </button>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex-1 w-full relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative z-10 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl premium-shadow border border-white/20">
                <img 
                  src={transfersHero} 
                  alt="Serviço de Transfers Nauticare" 
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-0" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl -z-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="details" className="py-20 md:py-32 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16 md:mb-24">
            <motion.h2 
              className="text-3xl md:text-5xl font-display font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Logística Sem Preocupações
            </motion.h2>
            <motion.p 
              className="font-body text-muted-foreground text-base max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Desenhámos este serviço para que o proprietário se possa focar apenas no prazer de navegar. 
              Nós tratamos das partes chatas e técnicas.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="glass p-8 rounded-[2rem] border-white/20 shadow-sm hover:shadow-xl transition-all duration-500 hover-lift flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-bold mb-4">{feature.title}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 order-2 md:order-1">
              <div className="grid grid-cols-1 gap-8">
                {[
                  { step: "01", title: "Marcação", desc: "Contacte-nos e indique a data e o local de recolha/entrega." },
                  { step: "02", title: "Verificação", desc: "Realizamos uma verificação prévia do estado do barco e sistemas." },
                  { step: "03", title: "Execução", desc: "A nossa equipa realiza o transfer com monitorização constante." },
                  { step: "04", title: "Entrega", desc: "Entrega no destino com relatório de serviço concluído." }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="flex gap-6 items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="text-4xl font-display font-bold text-primary/20">{item.step}</span>
                    <div>
                      <h4 className="text-xl font-display font-semibold mb-2">{item.title}</h4>
                      <p className="font-body text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 order-1 md:order-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-8">Como Funciona</h2>
                <p className="font-body text-muted-foreground text-lg mb-10 leading-relaxed">
                  Um processo transparente e rigoroso para garantir a sua paz de espírito. 
                  Sabemos o valor da sua embarcação e tratamo-la com o respeito que merece.
                </p>
                <button 
                   onClick={() => navigate("/pedir-orcamento-transferes")}
                   className="px-8 py-4 bg-foreground text-white rounded-full font-display font-bold text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-lg"
                >
                  Pedir Orçamento Especializado
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Transfers;
