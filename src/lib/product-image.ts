import type { Product } from "@/data/menu";

export function productImage(product: Pick<Product, "id" | "image">) {
  return product.image || "/cardapio/calabresa.webp";
}

export function productWithImage(product: Product): Product {
  const image = productImage(product);
  return image === product.image ? product : { ...product, image };
}
