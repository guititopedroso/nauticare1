import { useState } from "react";
import { motion } from "framer-motion";
import { services, packs, boatSizeCategories, type BoatSize } from "@/data/services";
import { Calendar } from "@/components/ui/calendar";
import { BookingForm } from "./BookingForm"; // Assuming you will create this component

const BookingSection = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleNewBooking = () => {
    setSubmitted(false);
    // Potentially reset other state if needed
  };

  if (submitted) {
    return (
      <section id="reservar" className="py-20 md:py-32">
        <div className="container max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl md:text-5xl font-display text-foreground mb-4">
              Reserva Enviada!
            </h2>
            <p className="font-body text-muted-foreground text-base md:text-lg mb-8">
              O seu pedido foi registado com sucesso. Entraremos em contacto muito em breve para confirmar todos os detalhes.
            </p>
            <button
              onClick={handleNewBooking}
              className="bg-primary text-primary-foreground font-body uppercase tracking-widest text-sm px-10 py-4 rounded-md hover:bg-primary/90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Fazer Nova Reserva
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="reservar" className="py-20 md:py-32 bg-gray-50/80">
      <div className="container max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
            <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl font-display text-foreground mb-3 md:mb-4"
                initial={{ y: -30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
                Peça o seu Orçamento
            </motion.h2>
            <motion.p
                className="font-body text-muted-foreground text-base md:text-lg max-w-2xl mx-auto tracking-wide"
                initial={{ y: -30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            >
                Selecione os serviços ou pack desejado, preencha os seus dados e nós entramos em contacto para finalizar o agendamento.
            </motion.p>
        </div>

        <BookingForm setSubmitted={setSubmitted} />

      </div>
    </section>
  );
};

export default BookingSection;
