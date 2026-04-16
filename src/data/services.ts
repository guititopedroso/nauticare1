export type BoatSize = "ate7m" | "7a12m" | "12a18m" | "mais18m";

export const boatSizeCategories: { id: BoatSize; label: string; description: string }[] = [
  { id: "ate7m", label: "Até 7 metros", description: "Embarcações pequenas" },
  { id: "7a12m", label: "7 – 12 metros", description: "Embarcações médias" },
  { id: "12a18m", label: "12 – 18 metros", description: "Embarcações grandes" },
  { id: "mais18m", label: "> 18 metros", description: "Sob consulta" },
];

export interface Service {
  id: string;
  name: string;
  category: "estetica" | "manutencao" | "gestao";
  description: string;
  detailedDescription: string;
  price: string;
  priceNote?: string;
  prices: Record<BoatSize, string>;
  image?: string;
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  services: string[];
  price: string;
  savings?: string;
  featured?: boolean;
}

export const categories = [
  { id: "estetica", label: "Estética & Detalhe", icon: "✦" },
  { id: "manutencao", label: "Manutenção & Técnica", icon: "⚙" },
  { id: "gestao", label: "Gestão & Segurança", icon: "⛨" },
] as const;

export const services: Service[] = [
  {
    id: "limpeza-int-ext",
    name: "Limpeza Interior e Exterior",
    category: "estetica",
    description: "Limpeza profunda e detalhada de todo o interior e exterior da embarcação.",
    detailedDescription: "Serviço completo de limpeza que abrange todas as superfícies interiores e exteriores da embarcação. Inclui lavagem do casco, convés, cockpit, cabines, casa de banho e cozinha. Utilizamos produtos profissionais biodegradáveis e técnicas especializadas para remover sal, manchas e sujidade acumulada, devolvendo o aspeto original à sua embarcação.",
    price: "A partir de —€",
    prices: { ate7m: "—€", "7a12m": "—€", "12a18m": "—€", mais18m: "Sob consulta" },
  },
  {
    id: "polimento",
    name: "Polimento de Fibra, Plásticos e Metais",
    category: "estetica",
    description: "Restauração do brilho original com polimento profissional multi-fase.",
    detailedDescription: "Processo de polimento multi-fase que restaura o brilho e a proteção das superfícies de fibra de vidro, plásticos e metais. Removemos oxidação, riscos superficiais e marcas de desgaste. Aplicamos selante protetor UV para prolongar a durabilidade do acabamento e proteger contra os elementos marinhos.",
    price: "A partir de —€",
    prices: { ate7m: "—€", "7a12m": "—€", "12a18m": "—€", mais18m: "Sob consulta" },
  },
  {
    id: "teca",
    name: "Tratamento de Teca",
    category: "estetica",
    description: "Tratamento especializado para preservar e restaurar teca.",
    detailedDescription: "Tratamento profissional de pavimentos e superfícies em teca. O processo inclui limpeza profunda, lixagem quando necessário, e aplicação de óleo ou selante protetor específico para madeira de teca. Restauramos a cor natural e protegemos contra os efeitos do sol, sal e humidade, prolongando a vida útil da madeira.",
    price: "A partir de —€",
    prices: { ate7m: "—€", "7a12m": "—€", "12a18m": "—€", mais18m: "Sob consulta" },
  },
  {
    id: "tecidos-capas",
    name: "Limpeza de Tecidos, Capas e Tapetes",
    category: "estetica",
    description: "Limpeza profunda de todos os tecidos, capas e tapetes da embarcação.",
    detailedDescription: "Limpeza especializada de todos os elementos têxteis da embarcação, incluindo estofos, capas de proteção, tapetes, almofadas e cortinas. Utilizamos equipamentos de limpeza a vapor e produtos específicos para tecidos náuticos, removendo manchas, bolor e odores. Inclui tratamento impermeabilizante e proteção anti-UV.",
    price: "A partir de —€",
    prices: { ate7m: "—€", "7a12m": "—€", "12a18m": "—€", mais18m: "Sob consulta" },
  },
  {
    id: "limpeza-linha-agua",
    name: "Limpeza da Linha de Água",
    category: "manutencao",
    description: "Remoção de incrustações e organismos marinhos da linha de água.",
    detailedDescription: "Limpeza especializada da linha de água com remoção de incrustações, algas, cracas e outros organismos marinhos. Utilizamos técnicas e produtos adequados para cada tipo de casco, sem danificar o antifouling. Este serviço regular é essencial para manter o desempenho hidrodinâmico e a eficiência de combustível da embarcação.",
    price: "A partir de —€",
    prices: { ate7m: "—€", "7a12m": "—€", "12a18m": "—€", mais18m: "Sob consulta" },
  },
  {
    id: "verificacao-zincos",
    name: "Verificação de Zincos",
    category: "manutencao",
    description: "Verificação de ânodos de zinco para proteção catódica eficaz.",
    detailedDescription: "Inspeção completa de todos os ânodos de sacrifício (zincos) da embarcação para garantir a proteção catódica eficaz. Verificamos o estado de desgaste de cada ânodo, a qualidade das ligações elétricas e a necessidade de substituição. Este serviço é fundamental para prevenir a corrosão galvânica em hélices, veios, lemes e outras partes metálicas submersas.",
    price: "A partir de —€",
    prices: { ate7m: "—€", "7a12m": "—€", "12a18m": "—€", mais18m: "Sob consulta" },
  },
  {
    id: "verificacao-fluidos",
    name: "Verificação de Fluídos",
    category: "manutencao",
    description: "Inspeção completa de todos os fluídos essenciais da embarcação.",
    detailedDescription: "Verificação sistemática de todos os fluídos vitais da embarcação: óleo do motor, líquido de refrigeração, óleo da direção hidráulica, fluído do sistema de trim, óleo da transmissão e nível de combustível. Verificamos níveis, qualidade, possíveis fugas e contaminação, garantindo o funcionamento seguro e eficiente de todos os sistemas.",
    price: "A partir de —€",
    prices: { ate7m: "—€", "7a12m": "—€", "12a18m": "—€", mais18m: "Sob consulta" },
  },
  {
    id: "agua-doce",
    name: "Passagem de Água Doce em Circuitos",
    category: "manutencao",
    description: "Lavagem de circuitos e saneamentos com água doce para preservação do sistema.",
    detailedDescription: "Lavagem completa de todos os circuitos de água, saneamento e refrigeração com água doce pressurizada. Este procedimento remove depósitos de sal, previne a cristalização e corrosão nos circuitos, e prolonga significativamente a vida útil de bombas, válvulas, permutadores de calor e outros componentes do sistema hidráulico.",
    price: "A partir de —€",
    prices: { ate7m: "—€", "7a12m": "—€", "12a18m": "—€", mais18m: "Sob consulta" },
  },
  {
    id: "navegacao-preventiva",
    name: "Navegação Preventiva",
    category: "gestao",
    description: "Saídas regulares para manter o motor e sistemas em funcionamento ideal.",
    detailedDescription: "Saídas regulares e programadas com a embarcação para manter todos os sistemas mecânicos e elétricos em pleno funcionamento. Inclui aquecimento do motor à temperatura operacional, teste de todos os sistemas de navegação, comunicações e segurança. Previne problemas causados pela imobilização prolongada como corrosão, baterias descarregadas e vedantes ressequidos.",
    price: "A partir de —€",
    prices: { ate7m: "—€", "7a12m": "—€", "12a18m": "—€", mais18m: "Sob consulta" },
  },
  {
    id: "amarracoes-defensas",
    name: "Verificação de Amarrações e Defensas",
    category: "gestao",
    description: "Inspeção e ajuste de amarrações e defensas para segurança na marina.",
    detailedDescription: "Inspeção regular de cabos de amarração, nós, olhais e defensas para garantir a segurança da embarcação na marina. Verificamos o estado de desgaste dos cabos, a posição e pressão das defensas, e ajustamos a amarração de acordo com as condições meteorológicas e de maré. Inclui substituição de cabos e defensas danificados quando necessário.",
    price: "A partir de —€",
    prices: { ate7m: "—€", "7a12m": "—€", "12a18m": "—€", mais18m: "Sob consulta" },
  },
  {
    id: "checkup-documentacao",
    name: "Check Up de Documentação e Prazos",
    category: "gestao",
    description: "Verificação de documentação, prazos pirotécnicos, balsas e extintores.",
    detailedDescription: "Serviço completo de gestão documental e de segurança da embarcação. Verificamos a validade de toda a documentação obrigatória, prazos de inspeção de pirotécnicos, balsas salva-vidas, extintores e restante equipamento de segurança. Alertamos antecipadamente para renovações e garantimos que a embarcação cumpre todos os requisitos legais para navegação.",
    price: "A partir de —€",
    prices: { ate7m: "—€", "7a12m": "—€", "12a18m": "—€", mais18m: "Sob consulta" },
  },
  {
    id: "transferes",
    name: "Serviço de Transferes",
    category: "gestao",
    description: "Transporte profissional da sua embarcação para oficinas ou outras marinas.",
    detailedDescription: "Serviço profissional de transporte e movimentação de embarcações. Quer precise de levar o barco à oficina para manutenção, mudar de marina ou entregar a embarcação num local específico, a nossa equipa de skippers experientes garante um transporte seguro e eficiente. Tratamos de toda a logística, para que não tenha de se preocupar com nada.",
    price: "Sob consulta",
    prices: { ate7m: "Sob consulta", "7a12m": "Sob consulta", "12a18m": "Sob consulta", mais18m: "Sob consulta" },
  },
];

export const packs: Pack[] = [
  {
    id: "pack-essencial",
    name: "Pack Essencial",
    description: "Manutenção básica para manter a sua embarcação em condições.",
    services: ["limpeza-int-ext", "verificacao-fluidos", "amarracoes-defensas"],
    price: "Sob consulta",
  },
  {
    id: "pack-premium",
    name: "Pack Premium",
    description: "O pacote completo de estética e manutenção para quem exige excelência.",
    services: ["limpeza-int-ext", "polimento", "teca", "limpeza-linha-agua", "verificacao-zincos", "verificacao-fluidos"],
    price: "Sob consulta",
    featured: true,
  },
  {
    id: "pack-total",
    name: "Pack Total",
    description: "Todos os serviços num só pacote. A solução completa para a sua embarcação.",
    services: ["limpeza-int-ext", "polimento", "teca", "tecidos-capas", "limpeza-linha-agua", "verificacao-zincos", "verificacao-fluidos", "agua-doce", "navegacao-preventiva", "amarracoes-defensas", "checkup-documentacao"],
    price: "Sob consulta",
    savings: "Melhor valor",
  },
];
