/** Dados do negócio — Pizza do Juca */
export const business = {
  name: "Pizza do Juca",
  tagline: "Pizzaria artesanal • Desde 2001 • Paciência – RJ",
  rating: 4.5,
  reviews: 243,
  city: "Paciência, Rio de Janeiro – RJ",
  address: "Av. Devanir José de Carvalho, 617 — Paciência, Rio de Janeiro – RJ",
  hours: "Todos os dias, das 19h às 00h",
  phone: "(21) 97314-2264",
  phoneHref: "tel:+5521973142264",
  whatsapp: "5521973142264",
  instagram: "@pizzadojuca",
  instagramUrl: "https://www.instagram.com/pizzadojuca/",
  mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Avenida+Devanir+Jos%C3%A9+de+Carvalho,+617,+Paci%C3%AAncia,+Rio+de+Janeiro,+RJ",
  services: ["Delivery", "Retirada", "Atendimento no local"],
  deliveryPricing: {
    amount: 1.15 as number | null,
    everyKm: 1.5,
    calculation: "blocks" as "blocks" | "proportional",
    minimumFee: 0,
    maximumDistanceKm: null as number | null,
  },
} as const;

export const brl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
