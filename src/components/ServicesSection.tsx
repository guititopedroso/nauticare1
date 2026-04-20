import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLiveContent } from "@/hooks/useLiveContent";
import { categories } from "@/data/services";

const ServicesSection = () => {
  const { services } = useLiveContent();
  const [activeCategory, setActiveCategory] = useState<string>("estetica");
  const navigate = useNavigate();

  const filteredServices = services.filter((s) => s.category === activeCategory);

  return (
    <section id="servicos" className="py-20 md:py-32">
      <div className="container"><motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-display text-foreground mb-3 md:mb-4"
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        >
          Serviços Especializados
        </motion.h2>
        <motion.p
          className="font-body text-muted-foreground text-base md:text-lg mb-10 md:mb-12 max-w-lg tracking-wide"
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
        >
          Serviços náuticos de elite, executados com precisão e materiais premium.
        </motion.p>

        {/* Category tabs */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8 md:mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`font-display text-[10px] md:text-xs uppercase tracking-[0.2em] px-6 md:px-8 py-3.5 md:py-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 shadow-sm ${
                activeCategory === cat.id
                  ? "bg-primary text-white border-primary font-bold shadow-lg shadow-primary/20 scale-105"
                  : "bg-white text-gray-500 border-gray-100 hover:border-primary/20 hover:text-primary"
              }`}
            >
              {cat.icon}
              <span className="whitespace-nowrap">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              className="bg-white dark:bg-gray-800 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 group transition-all duration-500 hover-lift premium-shadow border border-gray-50 dark:border-gray-700 relative overflow-hidden flex flex-col"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 transition-all group-hover:bg-primary/10 group-hover:scale-110" />
              
              <h3 className="text-xl md:text-2xl font-display text-foreground mb-4 group-hover:text-primary transition-colors">
                {service.name}
              </h3>
              <p className="font-body text-gray-400 text-sm leading-relaxed mb-8 h-12 overflow-hidden line-clamp-2">
                {service.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50 dark:border-gray-700">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">A partir de</span>
                  <span className="font-display text-primary text-xl font-bold tabular-nums">
                    {service.price}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/servico/${service.id}`)}
                  className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all duration-300"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
