export type CategoryId =
  | "destaques"
  | "pizzas"
  | "hamburgueres"
  | "subtorre"
  | "combos"
  | "pasteis"
  | "calzones"
  | "porcoes"
  | "bebidas"
  | "gelados"
  | "adicionais";

export type ProductVariant = { id: string; label: string; price: number };
export type ProductOptionGroup = {
  id: string;
  label: string;
  options: string[];
  min?: number;
  max?: number;
  hint?: string;
  /** Exibe o grupo apenas quando uma destas variantes estiver selecionada. */
  onlyVariantIds?: string[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Exclude<CategoryId, "destaques">;
  variants?: ProductVariant[];
  flavors?: string[];
  variantLabel?: string;
  customGroups?: ProductOptionGroup[];
  badge?: "Destaque" | "Promoção" | undefined;
  featured?: boolean;
};

const base = "https://pizza-prime-digital.lovable.app/assets/";
const images = {
  pizza: base + "pizza-calabresa-B_tJUryw.jpg",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
  combo: base + "combo-familia-BiNCYrSJ.jpg",
  pastel: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
  calzone: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85",
  drink: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=85",
  fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
};

const sizes = (broto: number, media: number, grande: number): ProductVariant[] => [
  { id: "broto", label: "Broto", price: broto },
  { id: "media", label: "Média", price: media },
  { id: "grande", label: "Grande (40 cm)", price: grande },
];

const pizza = (id: string, name: string, description: string, prices: [number, number, number]): Product => ({
  id,
  name,
  description,
  price: prices[0],
  image: images.pizza,
  category: "pizzas",
  variantLabel: "tamanho",
  variants: sizes(...prices),
});

export const categories: { id: CategoryId; label: string }[] = [
  { id: "destaques", label: "Destaques" },
  { id: "pizzas", label: "Pizzas" },
  { id: "hamburgueres", label: "Hambúrgueres" },
  { id: "subtorre", label: "Sub Torre" },
  { id: "combos", label: "Combos" },
  { id: "pasteis", label: "Pastéis Chineses" },
  { id: "calzones", label: "Calzones" },
  { id: "porcoes", label: "Porções" },
  { id: "bebidas", label: "Bebidas" },
  { id: "gelados", label: "Gelados" },
];

export const pizzaNotices = [
  "Pizza Grande (40 cm) acompanha refrigerante 2L Kuat ou Convenção.",
  "Acréscimo de Catupiry ou Cheddar: R$ 6,00.",
  "Linha Premium — Catupiry, Cheddar ou Cream Cheese: R$ 8,00.",
];

const baseProducts: Product[] = [
  // PIZZAS — preços: Broto / Média / Grande
  pizza("pizza-mussarela", "Mussarela", "Molho, mussarela, tomate e orégano.", [22, 32, 47]),
  pizza("pizza-calabresa", "Calabresa", "Molho, mussarela, cebola, calabresa e orégano.", [22, 32, 47]),
  pizza("pizza-presunto", "Presunto", "Molho, mussarela, presunto e orégano.", [22, 32, 47]),
  pizza("pizza-frango-catupiry-cheddar", "Frango c/ Catupiry ou Cheddar", "Molho, mussarela, frango, Catupiry ou Cheddar e orégano.", [24, 35, 52]),
  pizza("pizza-frango-caipira", "Frango Caipira", "Molho, mussarela, frango, milho, ervilha, ovo e orégano.", [24, 35, 52]),
  pizza("pizza-atum", "Atum", "Molho, mussarela, atum, cebola e orégano.", [24, 35, 52]),
  pizza("pizza-palmito", "Palmito", "Molho, mussarela, palmito e orégano.", [24, 35, 52]),
  pizza("pizza-lombo", "Lombo", "Molho, mussarela, lombo e orégano.", [24, 35, 52]),
  pizza("pizza-salame", "Salame", "Molho, mussarela, salame e orégano.", [25, 37, 55]),
  pizza("pizza-champignon-alho", "Champignon c/ Alho", "Molho, mussarela, champignon, alho e orégano.", [24, 35, 52]),
  pizza("pizza-2-queijos", "2 Queijos", "Molho, mussarela, provolone e orégano.", [24, 35, 52]),
  pizza("pizza-3-queijos", "3 Queijos", "Molho, mussarela, provolone, Catupiry e orégano.", [26, 40, 52]),
  pizza("pizza-4-queijos", "4 Queijos", "Molho, mussarela, provolone, Catupiry, Cheddar e orégano.", [27, 38, 55]),
  pizza("pizza-5-queijos", "5 Queijos", "Molho, mussarela, provolone, Catupiry, Cheddar, parmesão e orégano.", [28, 39, 58]),
  pizza("pizza-6-queijos", "6 Queijos", "Molho, mussarela, provolone, Catupiry, Cheddar, parmesão, gorgonzola e orégano.", [29, 40, 61]),
  pizza("pizza-portuguesa", "Portuguesa", "Molho, mussarela, presunto, tomate, pimentão, cebola, ervilha, milho, ovo e orégano.", [24, 35, 52]),
  pizza("pizza-alho", "Alho", "Molho, mussarela, alho torrado e orégano.", [24, 35, 52]),
  pizza("pizza-carne-seca", "Carne Seca", "Molho, mussarela, carne seca, cebola e orégano.", [29, 40, 57]),
  pizza("pizza-calabacon", "Calabacon", "Molho, mussarela, calabresa, bacon e orégano.", [24, 35, 52]),
  pizza("pizza-piemante", "Piemante", "Molho, mussarela, presunto, palmito, Catupiry e orégano.", [26, 35, 55]),
  pizza("pizza-franbacon", "Franbacon", "Molho, mussarela, frango, bacon e orégano.", [24, 35, 52]),
  pizza("pizza-bacon-ovos", "Bacon c/ Ovos", "Molho, mussarela, bacon, ovos cozidos e orégano.", [24, 35, 52]),
  pizza("pizza-prame", "Prame", "Molho, mussarela, frango, presunto, palmito, calabresa, bacon, cebola e orégano.", [26, 37, 55]),
  pizza("pizza-marguerita", "Marguerita", "Molho, mussarela, tomate, manjericão e orégano.", [24, 35, 52]),
  pizza("pizza-picolla", "Picolla", "Molho, mussarela, lombo, Cheddar, cebola e orégano.", [26, 37, 52]),
  pizza("pizza-napolitana", "Napolitana", "Molho, mussarela, presunto, Catupiry, tomate e orégano.", [24, 35, 52]),
  pizza("pizza-banana", "Banana", "Mussarela, banana e canela.", [24, 35, 52]),
  pizza("pizza-romeu-julieta", "Romeu e Julieta", "Mussarela, queijo minas e goiabada.", [24, 35, 52]),
  pizza("pizza-chocolate", "Chocolate", "Mussarela e chocolate ao leite.", [26, 37, 55]),

  // HAMBÚRGUERES
  { id: "big-torre", name: "Big Torre", description: "2 hambúrgueres de carne, alface, 2 queijos, molho especial, cebola, picles, bacon e pão com gergelim.", price: 16.5, image: images.burger, category: "hamburgueres", badge: "Destaque", featured: true },
  { id: "big-california", name: "Big California", description: "2 hambúrgueres de carne, alface, 2 queijos, molho especial, cebola, picles, bacon, calabresa e pão com gergelim.", price: 16.5, image: images.burger, category: "hamburgueres" },
  { id: "big-frango", name: "Big Frango", description: "2 hambúrgueres de frango, alface, 2 queijos, molho especial, cebola, picles, bacon e pão com gergelim.", price: 16.5, image: images.burger, category: "hamburgueres" },
  { id: "big-lombo", name: "Big Lombo", description: "2 hambúrgueres de carne, alface, 2 queijos, molho especial, cebola, picles, bacon, lombo e pão com gergelim.", price: 16.5, image: images.burger, category: "hamburgueres" },
  { id: "big-presunto", name: "Big Presunto", description: "2 hambúrgueres de carne, alface, 2 queijos, molho especial, cebola, picles, bacon, presunto e pão com gergelim.", price: 16.5, image: images.burger, category: "hamburgueres" },
  { id: "torre-picanha", name: "Torre Picanha", description: "4 hambúrgueres de carne, alface, 3 queijos, molho especial, cebola, picles, bacon e pão com gergelim.", price: 27, image: images.burger, category: "hamburgueres", badge: "Destaque", featured: true },
  { id: "triplo-torre-picanha", name: "Triplo Torre Picanha", description: "3 hambúrgueres de carne, alface, 2 queijos, molho especial, cebola, picles, bacon e pão com gergelim.", price: 24, image: images.burger, category: "hamburgueres" },
  { id: "duplo-torre-picanha", name: "Duplo Torre Picanha", description: "2 hambúrgueres de carne, alface, 2 queijos, molho especial, cebola, picles, tomate, bacon e pão com gergelim.", price: 22, image: images.burger, category: "hamburgueres" },
  { id: "quatro-queijos-torre", name: "Quatro Queijos Torre", description: "2 hambúrgueres de carne, Catupiry, Cheddar cremoso, provolone, Cheddar fatiado, molho especial e pão com gergelim.", price: 18, image: images.burger, category: "hamburgueres" },
  { id: "frango-crocante-torre", name: "Frango Crocante Torre", description: "Empanado de frango recheado com queijo e presunto, molho rosé, tomate, alface e pão com gergelim.", price: 18, image: images.burger, category: "hamburgueres" },
  { id: "cheeseburguer-especial", name: "Cheeseburguer Especial", description: "Pão, hambúrguer de carne, queijo, picles, molho, bacon e salada.", price: 9, image: images.burger, category: "hamburgueres" },
  { id: "torre-mas-que-bem", name: "Torre Mas Que Bem", description: "2 hambúrgueres de carne, alface, queijo, ovo, provolone, molho especial, bacon e pão com gergelim.", price: 19, image: images.burger, category: "hamburgueres" },
  { id: "x-torre", name: "X-Torre", description: "Hambúrguer de carne, alface, queijo, ovo, presunto, molho especial, bacon, calabresa e pão com gergelim.", price: 16, image: images.burger, category: "hamburgueres" },
  { id: "torre-picanhas-galaxia", name: "Torre Picanhas das Galáxia", description: "Hambúrguer de carne, 4 fatias crocantes de bacon, Cheddar cremoso, cebola, picles e pão com gergelim.", price: 20, image: images.burger, category: "hamburgueres" },
  { id: "sub-torre-carne", name: "Sub Torre Carne", description: "Carne, cebola, picles, alface, queijo Cheddar ou mussarela em fatias, tomate, azeitona, pimentão, ketchup, mostarda, maionese e Billy Jack.", price: 21, image: images.burger, category: "subtorre" },
  { id: "sub-torre-frango", name: "Sub Torre Frango", description: "Frango, cebola, picles, alface, queijo Cheddar ou mussarela em fatias, tomate, azeitona, pimentão, ketchup, mostarda, maionese e Billy Jack.", price: 21, image: images.burger, category: "subtorre" },
  { id: "cheeseburguer", name: "Cheeseburguer", description: "Pão, hambúrguer de carne e queijo.", price: 8, image: images.burger, category: "hamburgueres" },

  // COMBOS
  { id: "torre-feliz", name: "Torre Feliz", description: "Cheeseburguer + batata + refrigerante 250 ml.", price: 17, image: images.combo, category: "combos", badge: "Destaque", featured: true },
  { id: "combo-bom-demais", name: "Combo Bom Demais", description: "2 nº 12 + Kuat + batata com bacon e Cheddar.", price: 60, image: images.combo, category: "combos" },
  { id: "combo-original", name: "Combo Original", description: "2 nº 13 + Kuat + batata com bacon e Cheddar.", price: 56, image: images.combo, category: "combos" },
  { id: "combo-super-picanha", name: "Combo Super Picanha", description: "2 nº 06 + Kuat + batata com bacon e Cheddar.", price: 80, image: images.combo, category: "combos" },
  { id: "promocao-casado", name: "Promoção Casado", description: "2 hambúrgueres de carne, 1 fatia de queijo Cheddar, bacon, cebola, picles, alface e pão com gergelim.", price: 20, image: images.combo, category: "combos", badge: "Promoção" },
  { id: "promocao-super-casado", name: "Promoção Super Casado", description: "2 Casados + Antarctica 1L + batata com bacon e Cheddar.", price: 42, image: images.combo, category: "combos", badge: "Promoção" },
  { id: "super-combo-double", name: "Super Combo Double", description: "4 nº 2 + Kuat + batata com bacon e Cheddar.", price: 65, image: images.combo, category: "combos" },
  { id: "super-combo-cheesburguer", name: "Super Combo Cheeseburguer", description: "8 nº 17 + Kuat + batata com bacon e Cheddar.", price: 74, image: images.combo, category: "combos" },

  // PASTÉIS CHINESES
  { id: "pastel-queijo-minas", name: "Queijo Minas", description: "Queijo minas com orégano.", price: 13, image: images.pastel, category: "pasteis" },
  { id: "pastel-carne", name: "Carne", description: "Carne moída.", price: 14, image: images.pastel, category: "pasteis" },
  { id: "pastel-calabresa", name: "Calabresa", description: "Linguiça calabresa e orégano.", price: 13, image: images.pastel, category: "pasteis" },
  { id: "pastel-queijo-mussarela", name: "Queijo Mussarela", description: "Queijo mussarela com orégano.", price: 13, image: images.pastel, category: "pasteis" },
  { id: "pastel-alho", name: "Alho", description: "Mussarela, alho frito e orégano.", price: 14, image: images.pastel, category: "pasteis" },
  { id: "pastel-queijo-presunto", name: "Queijo e Presunto", description: "Mussarela, presunto e orégano.", price: 15, image: images.pastel, category: "pasteis" },
  { id: "pastel-lombo", name: "Lombo, Catupiry ou Cheddar", description: "Lombo canadense e orégano. Escolha Catupiry ou Cheddar.", price: 15, image: images.pastel, category: "pasteis" },
  { id: "pastel-frango", name: "Frango, Catupiry ou Cheddar", description: "Frango desfiado. Escolha Catupiry ou Cheddar.", price: 15, image: images.pastel, category: "pasteis" },
  { id: "pastel-palmito", name: "Palmito com Catupiry ou Cheddar", description: "Palmito picado e orégano. Escolha Catupiry ou Cheddar.", price: 15, image: images.pastel, category: "pasteis" },
  { id: "pastel-romeu-julieta", name: "Romeu e Julieta", description: "Queijo minas e goiabada.", price: 15, image: images.pastel, category: "pasteis" },
  { id: "pastel-banana", name: "Banana", description: "Mussarela, banana e canela.", price: 15, image: images.pastel, category: "pasteis" },
  { id: "pastel-chocolate", name: "Chocolate", description: "Mussarela e chocolate.", price: 16, image: images.pastel, category: "pasteis" },
  { id: "pastel-4-queijos", name: "4 Queijos", description: "Mussarela, provolone, Catupiry e Cheddar.", price: 15, image: images.pastel, category: "pasteis" },
  { id: "pastel-salame", name: "Salame", description: "Salame e orégano.", price: 18, image: images.pastel, category: "pasteis" },
  { id: "pastel-champignon", name: "Champignon", description: "Mussarela, champignon, alho e orégano.", price: 15, image: images.pastel, category: "pasteis" },
  { id: "pastel-carne-seca", name: "Carne Seca", description: "Carne seca e alho frito.", price: 22, image: images.pastel, category: "pasteis" },
  { id: "pastel-portuguesa", name: "Portuguesa", description: "Mussarela, presunto, tomate, pimentão, cebola, milho, ervilha e ovo.", price: 16, image: images.pastel, category: "pasteis" },
  { id: "pastel-frango-caipira", name: "Frango Caipira", description: "Frango, milho, ervilha e ovo.", price: 15, image: images.pastel, category: "pasteis" },
  { id: "pastel-franbacon", name: "Franbacon", description: "Mussarela, frango e bacon.", price: 15, image: images.pastel, category: "pasteis" },
  { id: "pastel-calabacon", name: "Calabacon", description: "Mussarela, linguiça calabresa e bacon.", price: 15, image: images.pastel, category: "pasteis" },
  { id: "pastel-napolitano", name: "Napolitano", description: "Mussarela, presunto, tomate e orégano.", price: 15, image: images.pastel, category: "pasteis" },

  // CALZONES
  { id: "calzone-4-queijos", name: "Calzone 4 Queijos", description: "Mussarela, provolone, Catupiry, Cheddar e orégano.", price: 17, image: images.calzone, category: "calzones" },
  { id: "calzone-di-napoli", name: "Calzone Di Napoli", description: "Mussarela, provolone, presunto, tomate e orégano.", price: 17, image: images.calzone, category: "calzones" },
  { id: "calzone-governa", name: "Calzone Governa", description: "Mussarela, provolone, gorgonzola, tomate, pimentão e orégano.", price: 17, image: images.calzone, category: "calzones" },
  { id: "calzone-palmares", name: "Calzone Palmares", description: "Mussarela, provolone, ervilha e Catupiry.", price: 17, image: images.calzone, category: "calzones" },
  { id: "calzone-ascoly", name: "Calzone Ascoly", description: "Mussarela, provolone, linguiça calabresa e orégano.", price: 17, image: images.calzone, category: "calzones" },
  { id: "calzone-chambacon", name: "Calzone Chambacon", description: "Mussarela, provolone, champignon, bacon e orégano.", price: 17, image: images.calzone, category: "calzones" },
  { id: "calzone-sertas", name: "Calzone Sertas", description: "Mussarela, provolone, frango, milho, ervilha, ovo e orégano.", price: 17, image: images.calzone, category: "calzones" },

  // PORÇÕES
  { id: "batata-bacon-cheddar", name: "Batata, Bacon e Cheddar", description: "Porção de batata com bacon e Cheddar.", price: 35, image: images.fries, category: "porcoes" },
  { id: "batata-frango", name: "Batata-frita e Frango", description: "Batata-frita com frango a passarinho ou drumet empanado.", price: 55, image: images.fries, category: "porcoes" },
  { id: "batata-barquinho", name: "Batata Barquinho", description: "Batata, bacon e Cheddar.", price: 20, image: images.fries, category: "porcoes" },
  { id: "nuggets-20", name: "Nuggets", description: "20 unidades.", price: 26, image: images.fries, category: "porcoes" },
  { id: "aneis-cebola-20", name: "Anéis de Cebola", description: "20 unidades.", price: 26, image: images.fries, category: "porcoes" },
  { id: "porcao-fritas", name: "Porção de Fritas", description: "Porção de batatas fritas.", price: 25, image: images.fries, category: "porcoes" },

  // BEBIDAS
  { id: "suco-natural", name: "Sucos Naturais", description: "Escolha o tipo e o sabor.", price: 7, image: images.drink, category: "bebidas", variants: [{ id: "natural", label: "Natural", price: 7 }, { id: "ao-leite", label: "Ao leite", price: 8 }], flavors: ["Morango", "Abacaxi", "Manga", "Maracujá", "Graviola", "Acerola", "Goiaba", "Abacaxi com Hortelã"], variantLabel: "tipo" },

  // GELADOS
  { id: "milkshake", name: "Milk-shake", description: "Escolha o tamanho e o sabor.", price: 7, image: images.drink, category: "gelados", variants: [{ id: "200ml", label: "200 ml", price: 7 }, { id: "500ml", label: "500 ml", price: 15 }, { id: "700ml", label: "700 ml", price: 17 }], flavors: ["Ovomaltine", "Morango", "Chocolate", "Creme", "Coco", "Tutti Frutti", "Abacaxi", "Graviola", "Milho Verde", "Passas ao Rum", "Banana"], variantLabel: "tamanho" },
  { id: "acai", name: "Açaí", description: "Escolha o tamanho, a calda, o que deseja no meio e suas guloseimas.", price: 8, image: images.drink, category: "gelados", variants: [{ id: "200ml", label: "200 ml", price: 8 }, { id: "500ml", label: "500 ml", price: 16 }, { id: "700ml", label: "700 ml", price: 18 }], variantLabel: "tamanho", customGroups: [{ id: "calda", label: "Calda", options: ["Chocolate", "Morango", "Leite condensado"], max: 1 }, { id: "meio", label: "No meio do açaí", options: ["Não quero nada no meio", "Paçoca", "Granulado", "Confete", "Jujuba", "Leite Ninho"], min: 0, max: 1 }, { id: "guloseimas", label: "Guloseimas", options: ["Paçoca", "Granulado", "Confete", "Jujuba", "Leite Ninho"], max: 3 }] },
];
// ---------------------------------------------------------------------------
// "Retirar ingredientes" (opcional) para pizzas, hambúrgueres, Sub Torre e combos.
// ---------------------------------------------------------------------------

const REMOVAL_CATEGORIES = new Set<Product["category"]>(["pizzas", "hamburgueres", "subtorre", "combos"]);

const PROPER_NOUNS = ["Catupiry", "Cheddar", "Billy", "Kuat", "Antarctica", "Coca"];

const tidy = (raw: string) => {
  const text = raw.trim().replace(/\.$/, "").trim();
  if (!text) return "";
  const firstWord = text.split(" ")[0] ?? "";
  if (PROPER_NOUNS.includes(firstWord)) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
};

/** Extrai os ingredientes da própria descrição do produto. */
export function ingredientsFromDescription(description: string): string[] {
  const parts = description.split(",");
  const last = parts.pop() ?? "";
  const tokens = [...parts, ...last.split(/ e (?=[^,]*$)/)];
  return tokens
    .flatMap((token) => token.split(/\s+ou\s+|\s*\/\s*/i))
    .map(tidy)
    .filter((item) => item.length > 0 && !/pão/i.test(item));
}

const potatoRemovals = ["bacon da batata", "Cheddar da batata"];

const burgerIngredients = (id: string) =>
  ingredientsFromDescription(baseProducts.find((item) => item.id === id)?.description ?? "");

const comboRemovals: Record<string, string[]> = {
  // Torre Feliz => Cheeseburguer do cardápio
  "torre-feliz": burgerIngredients("cheeseburguer"),
  // nº 12 = Torre Mas Que Bem
  "combo-bom-demais": [...burgerIngredients("torre-mas-que-bem"), ...potatoRemovals],
  // nº 13 = X-Torre
  "combo-original": [...burgerIngredients("x-torre"), ...potatoRemovals],
  // nº 06 = Torre Picanha
  "combo-super-picanha": [...burgerIngredients("torre-picanha"), ...potatoRemovals],
  // nº 2 = Big California
  "super-combo-double": [...burgerIngredients("big-california"), ...potatoRemovals],
  // nº 17 = Cheeseburguer
  "super-combo-cheesburguer": [...burgerIngredients("cheeseburguer"), ...potatoRemovals],
};

const removalOptions = (product: Product): string[] => {
  if (product.category === "combos") {
    const mapped = comboRemovals[product.id];
    if (mapped) return mapped;
    if (product.id === "promocao-super-casado") {
      return [
        ...ingredientsFromDescription(
          baseProducts.find((item) => item.id === "promocao-casado")?.description ?? "",
        ),
        ...potatoRemovals,
      ];
    }
  }
  return ingredientsFromDescription(product.description);
};

export const products: Product[] = baseProducts.map((product) => {
  if (!REMOVAL_CATEGORIES.has(product.category)) return product;
  const options = Array.from(new Set(removalOptions(product)));
  if (options.length === 0) return product;
  return {
    ...product,
    customGroups: [
      ...(product.customGroups ?? []),
      {
        id: "retirar",
        label: "Retirar ingredientes",
        options,
        min: 0,
        max: options.length,
        hint: "Selecione o que deseja retirar (opcional)",
      },
    ],
  };
});
