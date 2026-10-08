/** Dados do negócio — edite aqui para atualizar o site inteiro. */
export const business = {
  name: "Torre de Pizza",
  tagline: "Pizzaria artesanal • Campo Grande – RJ",
  rating: 4.2,
  reviews: 265,
  city: "Campo Grande, Rio de Janeiro – RJ",
  address: "R. Domingos Alves Ribeiro, 28 — Campo Grande, Rio de Janeiro – RJ",
  hours: "Todos os dias, das 18h às 00h",
  phone: "+55 21 96990-2994",
  phoneHref: "tel:+5521969902994",
  whatsapp: "5521969902994",
  instagram: "@torredepizzacg",
  instagramUrl: "https://www.instagram.com/torredepizzacg/",
  mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=R.+Domingos+Alves+Ribeiro,+28,+Campo+Grande,+Rio+de+Janeiro,+RJ",
  services: ["Delivery", "Retirada", "Atendimento no local"],
  deliveryPricing: {
    /**
     * REGRA DE TESTE: R$ 1,15 a cada 1,5 km de rota.
     * O cálculo usa blocos: até 1,5 km = R$ 1,15; até 3 km = R$ 2,30; etc.
     */
    amount: 1.15 as number | null,
    everyKm: 1.5,
    calculation: "blocks" as "blocks" | "proportional",
    minimumFee: 0,
    maximumDistanceKm: null as number | null,
  },
} as const;

export const brl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
