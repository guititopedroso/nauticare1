import { useEffect } from "react";
import { motion } from "framer-motion";
import logoProfile from "@/assets/logo-profile.png";
import teamDiogo from "@/assets/team-diogo.png";
import teamMartim from "@/assets/team-martim.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SobreNos = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab="sobre" onTabChange={() => {}} />

      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-44 md:pb-28">
        <div className="container flex flex-col items-center md:flex-row md:justify-center md:items-center gap-6 md:gap-12 text-center md:text-left">
          <motion.img
            src={logoProfile}
            alt="Nauticare"
            className="w-32 md:w-56"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          />
          <div>
          <motion.h1
            className="text-3xl md:text-6xl font-display font-bold text-foreground mb-4 md:mb-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          >
            Quem Somos
          </motion.h1>
          <motion.p
            className="font-body text-muted-foreground text-sm md:text-base max-w-2xl tracking-wide leading-relaxed"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          >
            Serviços náuticos personalizados e de elite. Baseados entre a Doca das Fontainhas e a Marina de Tróia.
          </motion.p>
          </div>
        </div>
      </section>

      {/* About text */}
      <section className="pb-20 md:pb-28">
        <div className="container max-w-3xl">
          <motion.div
            className="space-y-6"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <p className="font-body text-foreground/80 text-sm md:text-base leading-relaxed tracking-wide">
              A <strong>Nauticare</strong> nasceu da paixão pelo mar e pela exigência de perfeição.
              Somos uma equipa jovem e especializada em detalhe e manutenção náutica, baseada
              entre a Doca das Fontainhas e a Marina de Tróia.
            </p>
            <p className="font-body text-foreground/80 text-sm md:text-base leading-relaxed tracking-wide">
              O nosso objetivo é claro: tratar cada embarcação como se fosse nossa. Combinamos
              técnicas de detailing automóvel de alto nível com conhecimento profundo de manutenção
              náutica, garantindo que o seu barco está sempre pronto para navegar.
            </p>
            <p className="font-body text-foreground/80 text-sm md:text-base leading-relaxed tracking-wide">
              Com experiência em skipper e uma formação técnica sólida, oferecemos um serviço
              completo — desde a estética e polimento até à gestão de segurança e navegação
              preventiva.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28 bg-surface-dark text-surface-dark-foreground">
        <div className="container">
          <motion.h2
            className="text-3xl md:text-5xl font-display font-bold text-center mb-4"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            Equipa Técnica
          </motion.h2>
          <motion.p
            className="font-body text-surface-dark-foreground/50 text-sm text-center mb-16 uppercase tracking-widest"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          >
            Detailer e Skipper
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Diogo */}
            <motion.div
              className="text-center"
              initial={{ x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="w-48 h-48 md:w-56 md:h-56 mx-auto mb-6 rounded-full overflow-hidden border-2 border-primary/30">
                <img
                  src={teamDiogo}
                  alt="Diogo Libânio"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">Diogo Libânio</h3>
              <p className="font-body text-primary text-xs uppercase tracking-widest mb-3">Detailer & Skipper</p>
              <p className="font-body text-surface-dark-foreground/60 text-sm leading-relaxed mb-4 max-w-sm mx-auto">
                Especialista em detalhe náutico com experiência em técnicas de polimento e proteção cerâmica. Skipper certificado com profundo conhecimento das águas de Setúbal e Tróia.
              </p>
              <a href="tel:+351934599001" className="font-body text-primary text-sm hover:underline">
                +351 934 599 001
              </a>
            </motion.div>

            {/* Martim */}
            <motion.div
              className="text-center"
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="w-48 h-48 md:w-56 md:h-56 mx-auto mb-6 rounded-full overflow-hidden border-2 border-primary/30">
                <img
                  src={teamMartim}
                  alt="Martim Torres"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">Martim Torres</h3>
              <p className="font-body text-primary text-xs uppercase tracking-widest mb-3">Detailer & Skipper</p>
              <p className="font-body text-surface-dark-foreground/60 text-sm leading-relaxed mb-4 max-w-sm mx-auto">
                Focado em manutenção técnica e gestão de segurança náutica. Experiência em verificação de sistemas, navegação preventiva e cuidado integral de embarcações.
              </p>
              <a href="tel:+351933813134" className="font-body text-primary text-sm hover:underline">
                +351 933 813 134
              </a>
            </motion.div>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default SobreNos;
