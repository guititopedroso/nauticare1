import logoWhite from "@/assets/logo-white.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center md:text-left">
          {/* Logo and Company Moto */}
          <div className="flex flex-col items-center md:items-start">
            <img src={logoWhite} alt="Nauticare" className="w-auto h-auto max-w-[180px] mb-4" />
            <p className="font-body text-gray-400 text-sm leading-relaxed max-w-xs">
              Serviços náuticos personalizados e de elite. Da Marina de Setúbal para as águas da Tróia.
            </p>
          </div>

          {/* Contacts Section */}
          <div>
            <h4 className="font-display text-base tracking-widest uppercase text-white mb-4">Contactos</h4>
            <div className="space-y-2 font-body text-sm text-gray-400">
              <p>Diogo Libânio — <a href="tel:+351934599001" className="text-primary hover:underline">+351 934 599 001</a></p>
              <p>Martim Torres — <a href="tel:+351933813134" className="text-primary hover:underline">+351 933 813 134</a></p>
              <p><a href="mailto:nauticare.info@gmail.com" className="text-primary hover:underline">nauticare.info@gmail.com</a></p>
            </div>
          </div>

          {/* Social Media Section */}
          <div>
            <h4 className="font-display text-base tracking-widest uppercase text-white mb-4">Siga-nos</h4>
            <div className="space-y-2 font-body text-sm text-gray-400">
              <a href="https://instagram.com/nauticare.official" target="_blank" rel="noopener noreferrer" className="inline-block hover:text-primary transition-colors">
                @nauticare.official
              </a>
            </div>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <p className="font-body text-gray-500 text-xs text-center uppercase tracking-widest">
            © {new Date().getFullYear()} Nauticare. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
