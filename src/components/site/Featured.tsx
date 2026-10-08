import { Flame } from "lucide-react";
import { brl } from "@/data/business";
import { products } from "@/data/menu";
import { useCart } from "@/hooks/useCart";
import { productImage, productWithImage } from "@/lib/product-image";
import { productOptionGroups } from "@/lib/product-options";
import { cn } from "@/lib/utils";

export function Featured() {
  const { add } = useCart();
  const featured = products.filter((product) => product.featured);

  return (
    <section className="relative overflow-hidden bg-primary py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold">
              <Flame className="h-4 w-4" /> Destaques do cardápio
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-primary-foreground sm:text-4xl">
              Algumas opções da Torre
            </h2>
          </div>
          <a href="#cardapio" className="hidden shrink-0 rounded-full border border-primary-foreground/25 px-5 py-2.5 text-sm font-semibold text-primary-foreground sm:inline-flex">
            Ver tudo
          </a>
        </div>

        <div className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:px-0">
          {featured.map((product) => {
            const displayImage = productImage(product);
            const isCustomImage = displayImage.startsWith("/menu/");
            const hasChoices =
              Boolean(product.variants?.length) ||
              Boolean(product.flavors?.length) ||
              productOptionGroups(product).length > 0;

            return (
              <article key={product.id} className="group w-[74%] shrink-0 snap-start overflow-hidden rounded-3xl bg-card shadow-lift md:w-auto">
                <div className={cn("relative aspect-square overflow-hidden", isCustomImage && "bg-black")}>
                  <img
                    src={displayImage}
                    alt={product.name}
                    loading="lazy"
                    className={cn(
                      "h-full w-full",
                      isCustomImage
                        ? "object-contain"
                        : "object-cover transition-transform duration-700 group-hover:scale-105",
                    )}
                  />
                  {product.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-gradient-gold px-3 py-1 text-[11px] font-bold uppercase text-gold-foreground">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-semibold text-foreground">{product.name}</h3>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="font-display text-xl font-semibold text-primary">{brl(product.price)}</span>
                    {hasChoices ? (
                      <a href="#cardapio" className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-primary hover:bg-gradient-gold">
                        Escolher opções
                      </a>
                    ) : (
                      <button type="button" onClick={() => add(productWithImage(product))} className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-primary hover:bg-gradient-gold">
                        Adicionar
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
