import { memo, useDeferredValue, useMemo, useState } from "react";
import { Info, Search, UtensilsCrossed } from "lucide-react";
import { categories, pizzaNotices, products, type CategoryId } from "@/data/menu";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

const MenuProductCard = memo(ProductCard);
const menuProducts = products.map((product) =>
  product.badge === "Destaque" ? { ...product, badge: undefined } : product,
);

export function MenuSection() {
  const [active, setActive] = useState<CategoryId>("pizzas");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const list = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return menuProducts.filter((product) => {
      const matchesCategory = q ? true : product.category === active;
      const matchesQuery = !q || product.name.toLowerCase().includes(q) || product.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [active, deferredQuery]);

  return (
    <section id="cardapio" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <div className="mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b23a26] dark:text-[#f87171]">Cardápio Pizza do Juca</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-[#2f4a32] sm:text-4xl dark:text-[#faf5ec]">Escolha o seu pedido</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-[#6f6457] dark:text-[#c4b5a2]">
          Pizzas artesanais, hambúrgueres, Sub Torre, combos, pastéis, calzones, porções, bebidas e gelados.
        </p>
      </div>

      <div className="relative mx-auto mb-6 max-w-xl">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7a8450]" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar no cardápio..."
          aria-label="Buscar no cardápio"
          className="w-full rounded-full border border-[#dccdb2] bg-[#faf5ec] py-4 pl-14 pr-5 text-sm text-[#2f4a32] shadow-sm outline-none transition focus:border-[#2f4a32] focus:ring-4 focus:ring-[#2f4a32]/10 dark:bg-[#1a1412] dark:border-[#382b24] dark:text-[#faf5ec]"
        />
      </div>

      <div className="no-scrollbar -mx-4 mb-7 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {categories.filter((category) => category.id !== "destaques").map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => {
              setActive(category.id);
              setQuery("");
            }}
            className={cn(
              "shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition",
              active === category.id && !query
                ? "border-transparent bg-[#2f4a32] text-[#faf5ec] shadow-md"
                : "border-[#dccdb2] bg-[#faf5ec] text-[#4e3220] hover:border-[#2f4a32]/40 hover:bg-[#e8d9be]/50 dark:bg-[#1a1412] dark:border-[#382b24] dark:text-[#c4b5a2]",
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {!query && active === "pizzas" && (
        <div className="mb-7 rounded-3xl border border-[#dccdb2] bg-[#e8d9be]/30 p-5 dark:bg-white/5 dark:border-[#382b24]">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#b23a26] dark:text-[#f87171]" />
            <div>
              <p className="text-sm font-bold text-[#2f4a32] dark:text-[#faf5ec]">Informações das pizzas</p>
              <div className="mt-1.5 space-y-1">
                {pizzaNotices.map((notice) => (
                  <p key={notice} className="text-xs leading-relaxed text-[#6f6457] dark:text-[#c4b5a2]">• {notice}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {list.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((product) => (
            <div
              key={product.id}
              style={{ contentVisibility: "auto", containIntrinsicSize: "auto 520px" }}
            >
              <MenuProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-md rounded-3xl border border-dashed border-gold/60 bg-card px-8 py-14 text-center shadow-soft">
          <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-accent">
            <UtensilsCrossed className="h-7 w-7 text-primary" />
          </span>
          <h3 className="font-display text-xl font-semibold text-foreground">Nenhum item encontrado</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Tente buscar outro nome ou escolher uma categoria.</p>
        </div>
      )}
    </section>
  );
}
