/**
 * Dados de produtos para o e-commerce
 * 
 * Este arquivo contém dados de exemplo para produtos,
 * incluindo informações como nome, preço, descrição e imagens.

 */

const productData = [
  {
    id: 1,
    name: "Tênis de Corrida Performance",
    price: 299.99,
    originalPrice: 349.99,
    discount: 14,
    rating: 4.8,
    reviews: 124,
    category: "Corrida",
    brand: "SportMax",
    colors: ["blue", "black", "red"],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    tags: ["running", "sports", "performance"],
    description: "Tênis de corrida de alta performance com tecnologia de amortecimento avançada e suporte para longas distâncias. Material respirável e leve para máximo conforto.",
    features: [
      "Tecnologia de amortecimento MaxCushion",
      "Malha respirável de alta durabilidade",
      "Solado com borracha de carbono para maior tração",
      "Peso: 280g (tamanho 42)",
      "Drop: 8mm"
    ],
    images: [
      "/assets/images/products/shoes-1-1.jpg",
      "/assets/images/products/shoes-1-2.jpg",
      "/assets/images/products/shoes-1-3.jpg",
      "/assets/images/products/shoes-1-4.jpg"
    ],
    modelPath: "/assets/models/running_shoe.glb",
    customizableOptions: {
      colors: ["blue", "black", "red", "white", "green"],
      materials: ["mesh", "synthetic", "knit"],
      soleTypes: ["regular", "trail", "competition"]
    }
  },
  {
    id: 2,
    name: "Tênis Casual Urban Style",
    price: 199.99,
    originalPrice: 229.99,
    discount: 13,
    rating: 4.5,
    reviews: 98,
    category: "casual",
    brand: "UrbanWalk",
    colors: ["navy", "gray", "black"],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    tags: ["casual", "urban", "daily"],
    description: "Tênis casual com design moderno para uso diário. Combina estilo urbano com conforto para caminhadas e uso prolongado na cidade.",
    features: [
      "Couro sintético de alta qualidade",
      "Forro acolchoado para maior conforto",
      "Solado flexível e durável",
      "Palmilha removível",
      "Peso: 320g (tamanho 42)"
    ],
    images: [
      "/assets/images/products/shoes-2-1.jpg",
      "/assets/images/products/shoes-2-2.jpg",
      "/assets/images/products/shoes-2-3.jpg"
    ],
    modelPath: "/assets/models/casual_shoe.glb",
    customizableOptions: {
      colors: ["navy", "gray", "black", "brown", "white"],
      materials: ["leather", "suede", "canvas"],
      soleTypes: ["flat", "platform", "textured"]
    }
  },
  {
    id: 3,
    name: "Tênis de Basquete Pro Jump",
    price: 349.99,
    originalPrice: 399.99,
    discount: 12,
    rating: 4.9,
    reviews: 156,
    category: "basketball",
    brand: "JumpMaster",
    featured : true,
    colors: ["red", "black", "white"],
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    tags: ["basketball", "sports", "professional"],
    description: "Tênis de basquete profissional com tecnologia de absorção de impacto e estabilidade para movimentos rápidos. Design de cano alto para proteção do tornozelo.",
    features: [
      "Sistema de amortecimento AirFlex",
      "Suporte de tornozelo reforçado",
      "Tração multidirecional para movimentos rápidos",
      "Cabedal em material sintético respirável",
      "Peso: 380g (tamanho 42)"
    ],
    images: [
      "/assets/images/products/shoes-3-1.jpg",
      "/assets/images/products/shoes-3-2.jpg",
      "/assets/images/products/shoes-3-3.jpg"
    ],
    modelPath: "/assets/models/basketball_shoe.glb",
    customizableOptions: {
      colors: ["red", "black", "white", "blue", "yellow"],
      materials: ["synthetic", "leather", "mesh"],
      soleTypes: ["court", "outdoor", "indoor"]
    }
  },
  {
    id: 4,
    name: "Tênis de Trilha Adventure",
    price: 279.99,
    originalPrice: 319.99,
    discount: 12,
    rating: 4.7,
    reviews: 87,
    category: "trail",
    brand: "TrailMaster",
    colors: ["green", "brown", "gray"],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    tags: ["trail", "hiking", "outdoor"],
    description: "Tênis para trilhas e caminhadas com tecnologia impermeável e solado de alta aderência. Ideal para terrenos irregulares e condições adversas.",
    features: [
      "Membrana impermeável DryTech",
      "Solado Vibram para máxima aderência",
      "Proteção contra impactos nas pontas",
      "Sistema de cadarços de travamento rápido",
      "Peso: 420g (tamanho 42)"
    ],
    images: [
      "/assets/images/products/shoes-4-1.jpg",
      "/assets/images/products/shoes-4-2.jpg",
      "/assets/images/products/shoes-4-3.jpg"
    ],
    modelPath: "/assets/models/trail_shoe.glb",
    customizableOptions: {
      colors: ["green", "brown", "gray", "black", "blue"],
      materials: ["waterproof", "leather", "gore-tex"],
      soleTypes: ["trail", "rock", "mud"]
    }
  },
  {
    id: 5,
    name: "Tênis Skate Street Style",
    price: 189.99,
    originalPrice: 219.99,
    discount: 14,
    rating: 4.6,
    reviews: 112,
    category: "skate",
    brand: "StreetBoard",
    colors: ["navy", "black", "red"],
    sizes: [37, 38, 39, 40, 41, 42, 43, 44],
    tags: ["skate", "street", "urban"],
    description: "Tênis de skate com reforço nas áreas de maior desgaste e solado aderente. Design inspirado na cultura urbana com durabilidade para manobras.",
    features: [
      "Lona reforçada com camada dupla",
      "Solado vulcanizado para maior sensibilidade",
      "Reforço extra na área do ollie",
      "Palmilha de impacto para aterrissagens",
      "Peso: 340g (tamanho 42)"
    ],
    images: [
      "/assets/images/products/shoes-5-1.jpg",
      "/assets/images/products/shoes-5-2.jpg"
    ],
    modelPath: "/assets/models/skate_shoe.glb",
    customizableOptions: {
      colors: ["navy", "black", "red", "white", "gray"],
      materials: ["canvas", "suede", "leather"],
      soleTypes: ["vulcanized", "cupsole", "classic"]
    }
  },
  {
    id: 6,
    name: "Tênis Social Premium",
    price: 259.99,
    originalPrice: 299.99,
    discount: 13,
    rating: 4.8,
    reviews: 76,
    category: "formal",
    brand: "ClassicStep",
    colors: ["brown", "black", "navy"],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    tags: ["formal", "social", "premium"],
    featured : true, // faz aparecer a imagem em produtos populares
    description: "Tênis social em couro legítimo com design elegante para ocasiões que exigem um visual mais formal, mas sem abrir mão do conforto.",
    features: [
      "Couro legítimo de primeira qualidade",
      "Forro em couro macio",
      "Solado de borracha antiderrapante",
      "Palmilha anatômica removível",
      "Peso: 360g (tamanho 42)"
    ],
    images: [
      "/assets/images/products/shoes-6-1.jpg",
      "/assets/images/products/shoes-6-2.jpg",
      "/assets/images/products/shoes-6-3.jpg"
    ],
    modelPath: "/assets/models/formal_shoe.glb",
    customizableOptions: {
      colors: ["brown", "black", "navy", "burgundy", "tan"],
      materials: ["leather", "suede", "nubuck"],
      soleTypes: ["leather", "rubber", "comfort"]
    }
  },
  {
    id: 7,
    name: "Camiseta Esportiva DryFit",
    price: 89.99,
    originalPrice: 109.99,
    discount: 18,
    rating: 4.7,
    reviews: 93,
    category: "clothing",
    featured : true,
    brand: "SportMax",
    colors: ["blue", "black", "gray", "red"],
    sizes: ["P", "M", "G", "GG"],
    tags: ["clothing", "sports", "running"],
    description: "Camiseta esportiva com tecnologia de secagem rápida e controle de odor. Tecido leve e respirável para máximo conforto durante atividades físicas.",
    features: [
      "Tecnologia DryFit para secagem rápida",
      "Tecido com proteção UV FPS 50+",
      "Sistema de ventilação nas áreas de maior transpiração",
      "Costuras planas para evitar atrito",
      "Peso: 120g (tamanho M)"
    ],
    images: [
      "/assets/images/products/shirt-1-1.jpg",
      "/assets/images/products/shirt-1-2.jpg"
    ],
    customizableOptions: {
      colors: ["blue", "black", "gray", "red", "green", "white"],
      materials: ["polyester", "dri-fit", "cotton-blend"],
      styles: ["regular", "slim", "loose"]
    }
  },
  {
    id: 8,
    name: "Moletom Esportivo Performance",
    price: 159.99,
    originalPrice: 189.99,
    discount: 16,
    rating: 4.8,
    reviews: 67,
    category: "clothing",
    featured : true,
    brand: "SportMax",
    colors: ["black", "gray", "navy"],
    sizes: ["P", "M", "G", "GG"],
    tags: ["clothing", "sports", "casual"],
    description: "Moletom esportivo com tecnologia térmica para manter a temperatura corporal ideal. Perfeito para treinos em dias frios ou uso casual.",
    features: [
      "Tecnologia ThermoRegulate para controle térmico",
      "Tecido interno em fleece macio",
      "Bolsos frontais com zíper",
      "Capuz ajustável com cordão",
      "Peso: 380g (tamanho M)"
    ],
    images: [
      "/assets/images/products/shirt-2-1.jpg"
    ],
    customizableOptions: {
      colors: ["black", "gray", "navy", "burgundy", "olive"],
      materials: ["cotton-blend", "fleece", "performance"],
      styles: ["hoodie", "crew-neck", "half-zip"]
    }
  },
  {
    id: 9,
    name: "Garrafa Esportiva Térmica",
    price: 69.99,
    originalPrice: 89.99,
    discount: 22,
    rating: 4.9,
    reviews: 128,
    category: "accessories", 
    brand: "HydraTech",
    colors: ["black", "blue", "red", "silver"],
    tags: ["accessories", "hydration", "sports"],
    description: "Garrafa esportiva com tecnologia de isolamento térmico que mantém bebidas frias por até 24 horas ou quentes por até 12 horas. Design ergonômico e livre de BPA.",
    features: [
      "Capacidade: 750ml",
      "Isolamento a vácuo de parede dupla",
      "Tampa de rosca com vedação completa",
      "Boca larga para facilitar limpeza e colocação de gelo",
      "Peso: 320g (vazia)"
    ],
    images: [
      "/assets/images/products/garrafa-esportiva.webp"
    ],
    customizableOptions: {
      colors: ["black", "blue", "red", "silver", "green", "pink"],
      sizes: ["500ml", "750ml", "1L"],
      lids: ["standard", "sport", "straw"]
    }
  },
  {
    id: 10,
    name: "Mochila Esportiva Multifuncional",
    price: 129.99,
    originalPrice: 159.99,
    discount: 19,
    rating: 4.7,
    reviews: 84,
    category: "accessories",
    brand: "PackPro",
    colors: ["black", "gray", "blue"],
    tags: ["accessories", "bags", "sports"],
    description: "Mochila esportiva com compartimentos específicos para diferentes equipamentos e acessórios. Material resistente à água e design ergonômico para maior conforto.",
    features: [
      "Capacidade: 25L",
      "Compartimento para notebook até 15\"",
      "Bolso específico para calçados",
      "Sistema de ventilação nas costas",
      "Alças acolchoadas ajustáveis",
      "Peso: 680g"
    ],
    images: [
      "/assets/images/products/mochila-esportiva-2-1.webp"
    ],
    customizableOptions: {
      colors: ["black", "gray", "blue", "red", "camo"],
      sizes: ["small (18L)", "medium (25L)", "large (35L)"],
      features: ["standard", "hydration", "travel"]
    }
  }
];

export default productData;
