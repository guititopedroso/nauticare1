import { motion } from "framer-motion";
import { useLiveContent } from "@/hooks/useLiveContent";

const PacksSection = () => {
  const { packs, services } = useLiveContent();
  const getServiceName = (id: string) => services.find((s) => s.id === id)?.name || id;

  return (
    <section id="packs" className="py-20 md:py-32 bg-gray-900 text-gray-100">
      <div className="container"><motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-display mb-3 md:mb-4"
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        >
          Packs de Luxo
        </motion.h2>
        <motion.p
          className="font-body text-gray-400 text-base md:text-lg mb-12 md:mb-16 max-w-lg tracking-wide"
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
        >
          Combinações estratégicas de serviços para máximo valor e proteção contínua.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packs.map((pack, index) => (
            <motion.div
              key={pack.id}
              className={`relative flex flex-col rounded-[3rem] p-10 transition-all duration-500 shadow-2xl hover-lift ${
                pack.featured
                  ? "border-2 border-primary bg-primary/5 backdrop-blur-sm"
                  : "border border-gray-800 bg-gray-900/50"
              }`}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {pack.featured && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white font-display text-[10px] uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg shadow-blue-500/30 font-bold">
                  Elite Choice
                </span>
              )}
              {pack.savings && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white font-display text-[10px] uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg shadow-red-500/30 font-bold">
                  {pack.savings}
                </span>
              )}

              <div className="flex-grow">
                <h3 className="text-2xl md:text-3xl font-display text-white mb-4 text-center group-hover:text-primary transition-colors">{pack.name}</h3>
                <p className="font-body text-gray-500 text-sm leading-relaxed mb-10 text-center px-4">
                  {pack.description}
                </p>

                <div className="space-y-4 mb-12">
                  {pack.services.map((sid) => (
                    <div key={sid} className="flex items-center gap-4 group/item">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">
                        ✓
                      </div>
                      <span className="font-body text-gray-400 text-sm group-hover/item:text-gray-200 transition-colors">
                        {getServiceName(sid)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto text-center pt-8 border-t border-white/5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">Média Mensal</div>
                <span className="font-display text-white text-3xl md:text-4xl font-bold tracking-tight">
                  <span className="text-primary mr-1 text-2xl">€</span>
                  {pack.price ? pack.price.replace('€', '').trim() : '—'}
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
