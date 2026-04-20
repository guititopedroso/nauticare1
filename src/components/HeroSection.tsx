import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImage from "@/assets/hero-yacht.jpg";
import logoWhite from "@/assets/logo-white.png";
import logoBarco from "@/assets/logo-barco.png";

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  return (
    <section ref={ref} id="inicio" className="relative h-[85vh] md:h-screen flex items-end overflow-hidden">
      {/* Background Image and Gradient */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <img
          src={heroImage}
          alt="Iate de luxo atracado na marina"
          className="w-full h-full object-cover object-center md:object-[center_35%]"
          // Improve image loading performance
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </motion.div>



      {/* Content (Optimized for mobile) */}
      <motion.div style={{ y: y2, opacity }} className="relative container w-full pt-20 md:pt-32 pb-16 md:pb-40">
        <motion.div
           initial={{ y: 50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
         >
           <img
             src={logoWhite}
             alt="Nauticare"
             className="w-auto h-auto max-w-[80%] md:max-w-4xl lg:max-w-5xl mb-6 md:mb-10 drop-shadow-2xl"
           />
         </motion.div>
 
         <motion.h1
           className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-display text-white leading-tight md:leading-none mb-6 md:mb-8 drop-shadow-md"
           initial={{ y: 30, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
         >
           Detalhe e Manutenção <span className="text-blue-400">Náutica</span>
         </motion.h1>
 
         <motion.p
           className="font-body text-white/80 text-sm sm:text-lg md:text-xl max-w-md md:max-w-2xl mb-10 md:mb-12 tracking-wide leading-relaxed drop-shadow-sm"
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
         >
           Serviços náuticos personalizados e de elite. Transformamos a sua embarcação com o rigor da excelência, da Doca das Fontainhas para as águas da Tróia.
         </motion.p>
 
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1, duration: 1 }}
           className="flex flex-col sm:flex-row gap-4"
         >
           <a href="#reservar" className="bg-primary text-white px-8 py-4 rounded-full font-bold text-center hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/20">
             Reservar Agora
           </a>
           <a href="#servicos" className="glass text-white px-8 py-4 rounded-full font-bold text-center hover:bg-white/10 transition-all">
             Ver Serviços
           </a>
         </motion.div>
       </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
