import type { Product } from "@/data/menu";

const productImages: Record<string, string> = {
  // HAMBÚRGUERES E SUBS
  "big-torre": "/menu/big torre.webp",
  "big-california": "/menu/big-california.webp",
  "big-frango": "/menu/big frango.webp",
  "big-lombo": "/menu/big lombo.webp",
  "big-presunto": "/menu/big presunto.webp",
  "torre-picanha": "/menu/torre-picanha.webp",
  "triplo-torre-picanha": "/menu/triplo torre picanha.webp",
  "duplo-torre-picanha": "/menu/duplo torre picanha.webp",
  "quatro-queijos-torre": "/menu/quatro queijos torre.webp",
  "frango-crocante-torre": "/menu/frango crocante torre.webp",
  "cheeseburguer-especial": "/menu/cheeseburguer-especial.webp",
  "torre-mas-que-bem": "/menu/torre mais que bom.webp",
  "x-torre": "/menu/x torre.webp",
  "torre-picanhas-galaxia": "/menu/torre picanhas das galaxia.webp",
  "sub-torre-carne": "/menu/sub torre carne.webp",
  "sub-torre-frango": "/menu/sub-torre-frango.webp",
  "cheeseburguer": "/menu/cheese burguer.webp",
  "torre-feliz": "/menu/torre-feliz.webp",
  "combo-bom-demais": "/menu/combo-bom-demais.webp",
  "combo-original": "/menu/combo-original.webp",
  "combo-super-picanha": "/menu/combo-super-picanha.webp",
  "promocao-casado": "/menu/promocao-casado.webp",
  "promocao-super-casado": "/menu/promocao-super-casado.webp",
  "super-combo-double": "/menu/super-combo-double.webp",
  "super-combo-cheesburguer": "/menu/super-combo-cheeseburguer.webp",
  "pizza-calabresa": "/menu/pizza-calabresa.webp",
  "pizza-mussarela": "/menu/pizza-mussarela.webp",
  "pizza-presunto": "/menu/pizza-presunto.webp",
  "pizza-frango-catupiry-cheddar": "/menu/pizza-frango-catupiry-cheddar.webp",
  "pizza-frango-caipira": "/menu/pizza-frango-caipira.webp",
  "pizza-atum": "/menu/pizza-atum.webp",
  "pizza-palmito": "/menu/pizza-palmito.webp",
  "pizza-lombo": "/menu/pizza-lombo.webp",
  "pizza-salame": "/menu/pizza-salame.webp",
  "pizza-champignon-alho": "/menu/pizza-champignon-alho.webp",
  "pizza-2-queijos": "/menu/pizza-2-queijos.webp",
  "pizza-3-queijos": "/menu/pizza-3-queijos.webp",
  "pizza-4-queijos": "/menu/pizza-4-queijos.webp",
  "pizza-5-queijos": "/menu/pizza-5-queijos.webp",
  "pizza-6-queijos": "/menu/pizza-6-queijos.webp",
  "pizza-portuguesa": "/menu/pizza-portuguesa.webp",
  "calzone-4-queijos": "/menu/calzone-4-queijos.webp",
  "calzone-di-napoli": "/menu/calzone-di-napoli.webp",
  "calzone-governa": "/menu/calzone-governa.webp",
  "calzone-palmares": "/menu/calzone-palmares.webp",
  "calzone-ascoly": "/menu/calzone-ascoly.webp",
  "calzone-chambacon": "/menu/calzone-chambacon.webp",
  "calzone-sertas": "/menu/calzone-sertas.webp",
  "suco-natural": "/menu/sucos-naturais.webp",
  "milkshake": "/menu/milkshakes-com-calda.webp",
  "acai": "/menu/acai.webp",
  "batata-bacon-cheddar": "/menu/porcao-batata-bacon-cheddar.webp",
  "batata-frango": "/menu/porcao-batata-frango.webp",
  "batata-barquinho": "/menu/porcao-batata-barquinho.webp",
  "nuggets-20": "/menu/porcao-nuggets-20.webp",
  "aneis-cebola-20": "/menu/porcao-aneis-cebola-20.webp",
  "porcao-fritas": "/menu/porcao-fritas.webp",
};


export function productImage(product: Pick<Product, "id" | "image">) {
  return productImages[product.id] ?? product.image;
}

export function productWithImage(product: Product): Product {
  const image = productImage(product);
  return image === product.image ? product : { ...product, image };
}
