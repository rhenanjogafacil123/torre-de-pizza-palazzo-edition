/* Pizza do Juca - Painel de Gestão e Operação */

// Estado inicial padrão
const DEFAULT_ORDERS = [
  {
    id: 1048,
    customer: "João Silva",
    channel: "WhatsApp",
    items: ["1x Pizza Calabresa Especial (Grande)", "1x Coca-Cola 2L"],
    payment: "Pix",
    price: "R$ 58,00",
    minutes: 2,
    status: "recebido",
    phone: "(21) 99142-7730",
    address: "Rua das Flores, 123",
    neighborhood: "Paciência",
    notes: "Sem cebola. Massa bem assada.",
    createdAt: "19:32"
  },
  {
    id: 1049,
    customer: "Mariana Costa",
    channel: "Cardápio Digital",
    items: ["1x Pizza Frango c/ Catupiry (Grande)", "1x Borda Recheada Catupiry"],
    payment: "Cartão",
    price: "R$ 62,00",
    minutes: 6,
    status: "recebido",
    phone: "(21) 98821-4452",
    address: "Estrada do Mendanha, 840",
    neighborhood: "Campo Grande",
    notes: "Interfone 204.",
    createdAt: "19:28"
  },
  {
    id: 1050,
    customer: "Carlos Ribeiro",
    channel: "Balcão",
    items: ["1x Pizza Quatro Queijos (Média)", "1x Guaraná Antarctica 2L"],
    payment: "Dinheiro",
    price: "R$ 48,50",
    minutes: 8,
    status: "recebido",
    phone: "(21) 98044-5012",
    neighborhood: "Paciência",
    notes: "Retirada no balcão em 20 min.",
    createdAt: "19:22"
  },
  {
    id: 1045,
    customer: "Ana Paula",
    channel: "Cardápio Digital",
    items: ["1x Pizza Portuguesa Tradicional (Grande)", "1x Coca-Cola 2L"],
    payment: "Cartão",
    price: "R$ 59,90",
    minutes: 12,
    status: "preparando",
    phone: "(21) 97420-1188",
    address: "Rua Silva Cardoso, 91",
    neighborhood: "Santa Cruz",
    notes: "Caprichar no orégano e azeitonas pretas.",
    createdAt: "19:12"
  },
  {
    id: 1047,
    customer: "Lucas Mendes",
    channel: "WhatsApp",
    items: ["1x Pizza Dois Queijos (Grande)", "1x Guaraná 2L"],
    payment: "Pix",
    price: "R$ 49,00",
    minutes: 15,
    status: "preparando",
    phone: "(21) 98211-8301",
    address: "Rua Pioneiros, 557",
    neighborhood: "Paciência",
    createdAt: "19:09"
  },
  {
    id: 1051,
    customer: "Fernanda Lima",
    channel: "Balcão",
    items: ["1x Pizza Chocolate c/ Morango (Broto)"],
    payment: "Dinheiro",
    price: "R$ 32,50",
    minutes: 18,
    status: "preparando",
    phone: "(21) 99763-9120",
    neighborhood: "Paciência",
    notes: "Troco para R$ 50.",
    createdAt: "19:05"
  },
  {
    id: 1046,
    customer: "Pedro Santos",
    channel: "WhatsApp",
    items: ["1x Pizza Calabresa (Grande)", "1x Guaravita 290ml"],
    payment: "Pix",
    price: "R$ 48,00",
    minutes: 5,
    status: "pronto",
    phone: "(21) 99280-1477",
    address: "Rua Felipe Cardoso, 303",
    neighborhood: "Santa Cruz",
    createdAt: "18:58"
  },
  {
    id: 1044,
    customer: "Juliana Alves",
    channel: "Cardápio Digital",
    items: ["1x Pizza Marguerita Especial (Grande)"],
    payment: "Cartão",
    price: "R$ 49,00",
    minutes: 8,
    status: "pronto",
    phone: "(21) 97331-6009",
    address: "Av. Cesário de Melo, 1902",
    neighborhood: "Campo Grande",
    createdAt: "18:51"
  },
  {
    id: 1042,
    customer: "Amanda Rocha",
    channel: "Delivery",
    items: ["1x Pizza Especial do Juca (Gigante 45cm)", "1x Coca-Cola 2L"],
    payment: "Cartão",
    price: "R$ 76,00",
    minutes: 8,
    status: "entrega",
    courier: "Matheus Alves",
    phone: "(21) 99812-3381",
    address: "Rua das Acácias, 321",
    neighborhood: "Campo Grande",
    notes: "Casa com portão branco.",
    createdAt: "18:40"
  },
  {
    id: 1043,
    customer: "Gabriel Martins",
    channel: "Delivery",
    items: ["1x Pizza Frango Crocante (Grande)", "1x Guaraná 2L"],
    payment: "Pix",
    price: "R$ 56,00",
    minutes: 12,
    status: "entrega",
    courier: "Rafael Lima",
    phone: "(21) 97642-2230",
    address: "Rua Álvaro Alberto, 789",
    neighborhood: "Paciência",
    createdAt: "18:34"
  }
];

const DEFAULT_COURIERS = [
  { name: "Rafael Lima", status: "Disponível", deliveries: "12 entregas hoje", tone: "green" },
  { name: "Diego Souza", status: "Disponível", deliveries: "8 entregas hoje", tone: "green" },
  { name: "Matheus Alves", status: "Em entrega", deliveries: "9 entregas hoje", tone: "amber" },
  { name: "Bruno Costa", status: "Disponível", deliveries: "6 entregas hoje", tone: "green" }
];

const DEFAULT_SOLD_OUT = [
  "Borda Recheada de Cheddar",
  "Pizza Especial de Camarão",
  "Guaracamp 285ml"
];

const DEFAULT_COURIER_AVAILABLE = [
  {
    id: 1048,
    store: "Pizza do Juca",
    customer: "João Silva",
    phone: "(21) 99142-7730",
    address: "Rua das Flores, 123",
    neighborhood: "Paciência",
    distance: "1,8 km",
    fee: "R$ 7,50",
    payment: "Pix",
    minutes: 12,
    image: "/combo-calabresa-guarana.webp",
    items: ["1x Pizza Calabresa Especial (Grande)", "1x Coca-Cola 2L"],
    notes: "Sem cebola. Portão cinza ao lado do mercado."
  },
  {
    id: 1049,
    store: "Pizza do Juca",
    customer: "Mariana Costa",
    phone: "(21) 98821-4452",
    address: "Estrada do Mendanha, 840",
    neighborhood: "Campo Grande",
    distance: "3,4 km",
    fee: "R$ 9,00",
    payment: "Cartão",
    minutes: 15,
    image: "/hero-pizza.webp",
    items: ["1x Pizza Frango c/ Catupiry (Grande)", "1x Borda Catupiry"],
    notes: "Interfone 204."
  },
  {
    id: 1050,
    store: "Pizza do Juca",
    customer: "Carlos Ribeiro",
    phone: "(21) 98044-5012",
    address: "Rua Pioneiros, 789",
    neighborhood: "Paciência",
    distance: "2,2 km",
    fee: "R$ 7,00",
    payment: "Dinheiro",
    minutes: 10,
    image: "/fatia-calabresa-catupiry.webp",
    items: ["1x Pizza Quatro Queijos (Média)", "1x Guaraná 2L"],
    notes: "Troco para R$ 50."
  }
];

const DEFAULT_COURIER_ACTIVE = [
  {
    id: 1045,
    store: "Pizza do Juca",
    customer: "Ana Paula",
    phone: "(21) 97420-1188",
    address: "Rua Silva Cardoso, 91",
    neighborhood: "Santa Cruz",
    distance: "2,6 km",
    fee: "R$ 8,00",
    payment: "Pix",
    minutes: 8,
    image: "/hero-calabresa-catupiry.webp",
    items: ["1x Pizza Portuguesa Tradicional (Grande)", "1x Coca-Cola 2L"],
    notes: "Casa com portão branco e muro alto.",
    stage: "a_caminho"
  }
];

const DEFAULT_COURIER_HISTORY = [
  {
    id: 1038,
    store: "Pizza do Juca",
    customer: "Rafael Gomes",
    phone: "(21) 98001-2291",
    address: "Rua Limites, 44",
    neighborhood: "Realengo",
    distance: "3,1 km",
    fee: "R$ 9,50",
    payment: "Pix",
    minutes: 14,
    image: "/combo-calabresa-guarana.webp",
    items: ["1x Pizza Dois Queijos (Grande)"],
    deliveredAt: "21:14"
  },
  {
    id: 1036,
    store: "Pizza do Juca",
    customer: "Bianca Santos",
    phone: "(21) 99731-3302",
    address: "Av. Brasil, 4120",
    neighborhood: "Bangu",
    distance: "4,0 km",
    fee: "R$ 10,00",
    payment: "Cartão",
    minutes: 18,
    image: "/hero-pizza.webp",
    items: ["1x Pizza Calabresa (Grande)", "1x Guaravita"],
    deliveredAt: "20:42"
  },
  {
    id: 1032,
    store: "Pizza do Juca",
    customer: "Pedro Henrique",
    phone: "(21) 97570-9011",
    address: "Rua Oliveira Braga, 77",
    neighborhood: "Campo Grande",
    distance: "1,8 km",
    fee: "R$ 7,50",
    payment: "Dinheiro",
    minutes: 11,
    image: "/fatia-calabresa-catupiry.webp",
    items: ["1x Pizza Frango Crocante (Grande)"],
    deliveredAt: "19:58"
  },
  {
    id: 1029,
    store: "Pizza do Juca",
    customer: "Larissa Melo",
    phone: "(21) 98111-4020",
    address: "Rua Amaral Costa, 210",
    neighborhood: "Santa Cruz",
    distance: "2,7 km",
    fee: "R$ 8,50",
    payment: "Pix",
    minutes: 16,
    image: "/hero-calabresa-catupiry.webp",
    items: ["1x Pizza Especial do Juca (Gigante 45cm)", "1x Coca-Cola 2L"],
    deliveredAt: "19:31"
  }
];

// Funções utilitárias de Storage
function getStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// Helpers para Toast
function showToast(msg) {
  const existing = document.getElementById("panel-toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.id = "panel-toast";
  toast.className = "fixed bottom-6 right-6 z-[130] rounded-2xl bg-slate-950 px-4 py-3 text-xs font-extrabold text-white shadow-2xl transition-all duration-300";
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2300);
}

// Export global para páginas
window.JucaPanel = {
  DEFAULT_ORDERS,
  DEFAULT_COURIERS,
  DEFAULT_SOLD_OUT,
  DEFAULT_COURIER_AVAILABLE,
  DEFAULT_COURIER_ACTIVE,
  DEFAULT_COURIER_HISTORY,
  getStorage,
  setStorage,
  showToast
};
