import { motion } from "framer-motion";
import { packs, services } from "@/data/services";

const PacksSection = () => {
  const getServiceName = (id: string) => services.find((s) => s.id === id)?.name || id;

  return (
    <section id="packs" className="py-20 md:py-32 bg-gray-900 text-gray-100">
      <div className="container"><motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-display mb-3 md:mb-4"
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        >
          Packs de Luxo
        </motion.h2>
        <motion.p
          className="font-body text-gray-400 text-base md:text-lg mb-12 md:mb-16 max-w-lg tracking-wide"
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
        >
          Combinações estratégicas de serviços para máximo valor e proteção contínua.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packs.map((pack, index) => (
            <motion.div
              key={pack.id}
              className={`relative flex flex-col rounded-lg p-8 transition-all duration-300 shadow-lg hover:shadow-primary/20 hover:-translate-y-1 ${
                pack.featured
                  ? "border-2 border-primary bg-gray-800/50"
                  : "border border-gray-700 bg-gray-800/30"
              }`}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.19, 1, 0.22, 1] }}
            >
              {pack.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-body text-xs uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                  Recomendado
                </span>
              )}
              {pack.savings && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white font-body text-xs uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                  {pack.savings}
                </span>
              )}

              <div className="flex-grow">
                <h3 className="text-xl md:text-2xl font-display text-white mb-2 text-center">{pack.name}</h3>
                <p className="font-body text-gray-400 text-sm leading-relaxed mb-6 text-center">
                  {pack.description}
                </p>

                <div className="space-y-2.5 mb-8">
                  {pack.services.map((sid) => (
                    <div key={sid} className="flex items-start gap-3">
                      <span className="text-primary text-sm mt-1">✓</span>
                      <span className="font-body text-gray-300 text-sm">
                        {getServiceName(sid)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto text-center">
                <span className="font-display text-primary text-2xl md:text-3xl font-bold tracking-tight">
                  {pack.price}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PacksSection;
