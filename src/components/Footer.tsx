import logoWhite from "@/assets/logo-white.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 text-center md:text-left">
          {/* Logo and Company Moto */}
          <div className="flex flex-col items-center md:items-start lg:col-span-1 sm:col-span-2 lg:sm:col-span-1">
            <img src={logoWhite} alt="Nauticare" className="w-auto h-6 md:h-8 mb-4" />
            <p className="font-body text-gray-400 text-sm leading-relaxed max-w-xs">
              Serviços náuticos personalizados e de elite. Da Doca das Fontainhas para as águas da Tróia.
            </p>
          </div>

          {/* Contacts Section */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-display text-xs md:text-base tracking-widest uppercase text-white mb-4">Contactos</h4>
            <div className="space-y-2 font-body text-sm text-gray-400">
              <p>Diogo Libânio — <a href="tel:+351934599001" className="text-primary hover:underline">+351 934 599 001</a></p>
              <p>Martim Torres — <a href="tel:+351933813134" className="text-primary hover:underline">+351 933 813 134</a></p>
              <p><a href="mailto:nauticare.info@gmail.com" className="text-primary hover:underline">nauticare.info@gmail.com</a></p>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-display text-xs md:text-base tracking-widest uppercase text-white mb-4">Siga-nos</h4>
            <div className="space-y-2 font-body text-sm text-gray-400">
              <a href="https://instagram.com/nauticare.official" target="_blank" rel="noopener noreferrer" className="inline-block hover:text-primary transition-colors">
                @nauticare.official
              </a>
            </div>
          </div>

          {/* New column for links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-display text-xs md:text-base tracking-widest uppercase text-white mb-4">Mais</h4>
            <div className="space-y-2 font-body text-sm text-gray-400">
              <a href="/transferes" className="block hover:text-primary transition-colors">Serviço de Transferes</a>
              <a href="/sobre-nos" className="block hover:text-primary transition-colors">Quem Somos</a>
            </div>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <p className="font-body text-gray-500 text-xs text-center uppercase tracking-widest flex items-center justify-center flex-wrap gap-x-2 gap-y-1">
            <span>© {new Date().getFullYear()} Nauticare. Todos os direitos reservados.</span>
            <span className="text-gray-700 hidden sm:inline">|</span>
            <span className="normal-case tracking-normal text-gray-500">
              Powered By{" "}
              <a
                href="https://azmar.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 hover:underline transition-colors font-semibold"
              >
                Azmar
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
