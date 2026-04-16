import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TransferBookingForm } from "@/components/TransferBookingForm";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TransferQuote = () => {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab="transferes" onTabChange={() => {}} />

      <section className="pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_20%_30%,rgba(0,119,255,0.05),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_80%_70%,rgba(0,119,255,0.03),transparent_50%)]" />

        <div className="container max-w-6xl">
          <motion.button 
            onClick={() => navigate("/transferes")}
            className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 font-body text-sm font-semibold group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar para Transferes
          </motion.button>

          <div className="text-center mb-12 md:mb-16">
            <motion.h1 
              className="text-3xl md:text-6xl font-display font-bold mb-6 text-foreground leading-[1.1]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Pedir Orçamento de <span className="text-primary italic">Transfer</span>
            </motion.h1>
            <motion.p 
              className="font-body text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Indique-nos onde está a sua embarcação e para onde quer que a levemos. 
              Enviaremos uma proposta detalhada em menos de 24h.
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <TransferBookingForm setSubmitted={setSubmitted} />
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto bg-white p-12 rounded-[3rem] premium-shadow text-center border border-gray-100"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-display font-bold mb-4">Pedido Recebido</h2>
                <p className="font-body text-gray-500 text-sm leading-relaxed mb-8">
                  Obrigado, Diogo ou Martim entrarão em contacto consigo através do telemóvel ou email fornecido para finalizar os detalhes.
                </p>
                <button 
                  onClick={() => navigate("/")}
                  className="w-full py-4 bg-foreground text-white rounded-2xl font-display font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg"
                >
                  Voltar à Página Inicial
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TransferQuote;
