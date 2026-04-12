import { useState } from "react";
import { motion } from "framer-motion";
import { services, packs, boatSizeCategories, type BoatSize } from "@/data/services";
import { Calendar } from "@/components/ui/calendar";

const locations = ["Marina de Setúbal", "Marina de Tróia"];

interface BookingFormProps {
  setSubmitted: (submitted: boolean) => void;
}

export const BookingForm = ({ setSubmitted }: BookingFormProps) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPack, setSelectedPack] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [boatName, setBoatName] = useState("");
  const [boatSize, setBoatSize] = useState<BoatSize | "">("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    if (selectedPack) setSelectedPack("");
  };

  const selectPack = (id: string) => {
    setSelectedPack(id === selectedPack ? "" : id);
    if (id !== selectedPack) setSelectedServices([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((selectedServices.length === 0 && !selectedPack) || !name || !phone || !selectedDate) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    };
    setSubmitted(true);
  };

  const isSubmitDisabled = (selectedServices.length === 0 && !selectedPack) || !name || !phone || !selectedDate;

  const formItemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: (i:number) => ({ 
      y: 0, 
      opacity: 1, 
      transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } 
    })
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8 bg-white p-6 md:p-10 rounded-lg shadow-xl shadow-black/5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* ---- COLUMN 1: SERVICES ---- */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        {/* Individual Services */}
        <motion.div custom={0} variants={formItemVariant}>
          <label className="font-body text-sm font-semibold tracking-wide text-gray-700 mb-3 block">
            1. Escolha os Serviços
          </label>
          <div className="space-y-2">
            {services.map((service) => (
              <label
                key={service.id}
                className={`flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer transition-all duration-200 ${
                  selectedServices.includes(service.id)
                    ? "border-primary bg-primary/10 ring-2 ring-primary/50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service.id)}
                  onChange={() => toggleService(service.id)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  selectedServices.includes(service.id)
                    ? "bg-primary border-primary"
                    : "border-gray-300 bg-white"
                }`}>
                  {selectedServices.includes(service.id) && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="font-body text-sm text-gray-800">{service.name}</span>
              </label>
            ))}
          </div>
        </motion.div>

        {/* Packs */}
        <motion.div custom={1} variants={formItemVariant}>
          <label className="font-body text-xs uppercase tracking-widest text-gray-500 mb-3 block">
            Ou escolha um Pack
          </label>
          <div className="space-y-2">
            {packs.map((pack) => (
              <label
                key={pack.id}
                className={`flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer transition-all duration-200 ${
                  selectedPack === pack.id
                    ? "border-primary bg-primary/10 ring-2 ring-primary/50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="pack"
                  checked={selectedPack === pack.id}
                  onChange={() => selectPack(pack.id)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  selectedPack === pack.id
                    ? "border-primary bg-white"
                    : "border-gray-300"
                }`}>
                  {selectedPack === pack.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <span className="font-body text-sm text-gray-800">{pack.name}</span>
              </label>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ---- COLUMN 2: DETAILS ---- */}
      <div className="lg:col-span-1 flex flex-col gap-5">
        <motion.div custom={2} variants={formItemVariant}>
          <label className="font-body text-sm font-semibold tracking-wide text-gray-700 mb-3 block">
            2. Detalhes da Embarcação
          </label>
          <div className="space-y-4">
            {/* Location */}
            <div className="flex gap-2">
              {locations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setSelectedLocation(loc)}
                  className={`flex-1 border rounded-md px-4 py-2.5 font-body text-sm transition-all duration-200 ${
                    selectedLocation === loc
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            {/* Boat size */}
            <div className="grid grid-cols-2 gap-2">
              {boatSizeCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setBoatSize(cat.id)}
                  className={`border rounded-md px-4 py-2.5 font-body text-sm transition-all duration-200 text-left ${
                    boatSize === cat.id
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Boat name */}
            <input
              type="text"
              value={boatName}
              onChange={(e) => setBoatName(e.target.value)}
              placeholder="Nome da Embarcação (opcional)"
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 font-body text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>
        </motion.div>

        <motion.div custom={3} variants={formItemVariant}>
          <label className="font-body text-sm font-semibold tracking-wide text-gray-700 mb-3 block">
            3. Os seus Contactos
          </label>
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="O seu Nome *"
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 font-body text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Contacto Telefónico *"
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 font-body text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>
        </motion.div>
      </div>

      {/* ---- COLUMN 3: CALENDAR & SUBMIT ---- */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <motion.div custom={4} variants={formItemVariant}>
          <label className="font-body text-sm font-semibold tracking-wide text-gray-700 mb-3 block">
            4. Data Pretendida *
          </label>
          <div className="border border-gray-200 rounded-md p-1 bg-white flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1)) }
              className="font-body p-2"
            />
          </div>
        </motion.div>

        <motion.div custom={5} variants={formItemVariant} className="mt-auto flex flex-col gap-4">
          {/* Summary */}
          {(selectedServices.length > 0 || selectedPack) && (
            <div className="border border-dashed border-gray-300 rounded-md p-4 bg-gray-50/80">
              <p className="font-body text-xs uppercase tracking-wider text-gray-500 mb-3">Resumo do Pedido</p>
              <div className="space-y-1.5">
                {selectedPack ? (
                  <p className="font-body text-sm text-gray-700 font-medium">
                    {packs.find(p => p.id === selectedPack)?.name}
                  </p>
                ) : (
                  selectedServices.map(id => (
                    <div key={id} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-primary/80">-</span>
                      <span>{services.find(s => s.id === id)?.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full bg-primary text-primary-foreground font-body uppercase tracking-widest text-sm px-8 py-4 rounded-md transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none disabled:translate-y-0"
          >
            Pedir Orçamento
          </button>
        </motion.div>
      </div>
    </motion.form>
  );
};