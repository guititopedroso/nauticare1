import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Star, Zap, Crown, ArrowRight, Gift, Ship } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ElitePromo = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [2, -2]);

  return (
    <section ref={ref} className="py-16 md:py-32 relative overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-slate-950 -skew-x-12 translate-x-32 hidden lg:block" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[120px] -z-0" />
      
      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20">
                <Crown className="w-3 md:w-4 h-3 md:h-4 text-primary" />
                <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-primary">Programa de Fidelidade</span>
              </div>
              
              <h2 className="text-3xl md:text-6xl font-display font-bold text-slate-900 mb-6 md:mb-8 leading-tight">
                Eleve a sua Experiência com o <span className="text-primary italic">Nauticare Elite</span>
              </h2>
              
              <p className="font-body text-slate-600 text-base md:text-lg mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Junte-se ao círculo exclusivo de proprietários e beneficie de um sistema de pontos que valoriza cada cuidado com a sua embarcação.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10 md:mb-12 text-left max-w-lg mx-auto lg:mx-0">
                {[
                  { icon: <Zap className="w-4 md:w-5 h-4 md:h-5 text-primary" />, text: "Pontos em cada serviço" },
                  { icon: <Star className="w-4 md:w-5 h-4 md:h-5 text-primary" />, text: "Prioridade em épocas altas" },
                  { icon: <Gift className="w-4 md:w-5 h-4 md:h-5 text-primary" />, text: "Ofertas exclusivas de parceiros" },
                  { icon: <Crown className="w-4 md:w-5 h-4 md:h-5 text-primary" />, text: "Acesso a eventos náuticos" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg md:rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                      {item.icon}
                    </div>
                    <span className="font-body font-semibold text-slate-700 text-xs md:text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => navigate("/login")}
                className="group px-8 md:px-10 py-4 md:py-5 bg-slate-950 text-white rounded-full font-display font-bold text-xs md:text-sm uppercase tracking-widest shadow-2xl hover:bg-primary transition-all flex items-center gap-4 mx-auto lg:mx-0"
              >
                Tornar-me Elite <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </div>
          
          <div className="flex-1 w-full relative">
            <motion.div
                style={{ y: typeof window !== 'undefined' && window.innerWidth > 768 ? y : 0, rotate: typeof window !== 'undefined' && window.innerWidth > 768 ? rotate : 0 }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
            >
                <div className="glass-dark bg-slate-900 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-3xl text-white">
                    <div className="flex justify-between items-start mb-8 md:mb-12">
                        <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Crown className="w-6 md:w-8 h-6 md:h-8 white" />
                        </div>
                        <div className="text-right">
                            <span className="block text-[8px] md:text-[10px] opacity-40 uppercase tracking-[0.2em] font-bold mb-1">Membro Desde</span>
                            <span className="font-display font-bold text-lg md:text-xl">2024</span>
                        </div>
                    </div>
                    
                    <div className="mb-8 md:mb-12">
                        <span className="block text-xs md:text-sm opacity-60 mb-2 font-body">Balanço de Pontos</span>
                        <h3 className="text-4xl md:text-6xl font-display font-bold tracking-tight">2.450 <span className="text-sm md:text-base font-normal opacity-40 ml-1 md:ml-2 italic">pts</span></h3>
                    </div>
                    
                    <div className="space-y-4 md:space-y-6">
                        <div className="h-1.5 md:h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-primary" 
                                initial={{ width: 0 }}
                                whileInView={{ width: "75%" }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                viewport={{ once: true }}
                            />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-60">
                            <span>Próximo Nível: Gold</span>
                            <span>75%</span>
                        </div>
                    </div>
                    
                    <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/5 flex items-center gap-4">
                        <div className="w-10 md:w-12 h-10 md:h-12 rounded-full overflow-hidden border-2 border-primary/20">
                            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                                <Star className="w-4 md:w-5 h-4 md:h-5 text-primary" />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm font-bold">Resgatar Benefícios</p>
                            <p className="text-[8px] md:text-[10px] text-primary font-bold uppercase tracking-widest">Disponível agora</p>
                        </div>
                    </div>
                </div>
                
                {/* Visual accents for the virtual card */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-400/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElitePromo;
