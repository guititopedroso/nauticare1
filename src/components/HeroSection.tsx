import { motion } from "framer-motion";
import heroImage from "@/assets/hero-yacht.jpg";
import logoWhite from "@/assets/logo-white.png";
import logoBarco from "@/assets/logo-barco.png";

const HeroSection = () => {
  return (
    <section id="inicio" className="relative h-[85vh] md:h-screen flex items-end overflow-hidden">
      {/* Background Image and Gradient */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Iate de luxo atracado na marina"
          className="w-full h-full object-cover object-center md:object-[center_35%]"
          // Improve image loading performance
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Boat logo top-right (Optimized for mobile) */}
      <motion.div
        className="absolute top-28 right-0 md:top-36"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="bg-white/10 backdrop-blur-md rounded-l-lg md:rounded-l-xl pl-4 pr-5 md:pl-5 md:pr-6 py-3 md:py-4 shadow-xl">
          <img
            src={logoBarco}
            alt="Nauticare boat logo"
            className="h-12 md:h-24 lg:h-28"
          />
        </div>
      </motion.div>

      {/* Content (Optimized for mobile) */}
      <div className="relative container w-full pb-20 md:pb-32">
        <motion.img
          src={logoWhite}
          alt="Nauticare"
          className="w-auto h-auto max-w-[80%] md:max-w-4xl lg:max-w-5xl mb-4 md:mb-6"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.h1
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display text-white leading-tight md:leading-none mb-4 md:mb-6"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Detalhe e Manutenção Náutica
        </motion.h1>

        <motion.p
          className="font-body text-white/70 text-sm sm:text-base md:text-lg max-w-md md:max-w-xl mb-10 tracking-wide"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Serviços náuticos personalizados e de elite. Da Marina de Setúbal para as águas da Tróia.
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
