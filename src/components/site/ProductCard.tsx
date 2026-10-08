import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Minus, Plus, X } from "lucide-react";
import { brl } from "@/data/business";
import type { Product } from "@/data/menu";
import { useCart } from "@/hooks/useCart";
import { productImage, productWithImage } from "@/lib/product-image";
import {
  displayProductDescription,
  optionPrice,
  productOptionGroups,
  type UiOptionGroup,
} from "@/lib/product-options";
import { cn } from "@/lib/utils";

export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const { add } = useCart();
  const allCustomGroups = useMemo(() => productOptionGroups(product), [product]);
  const hasFlavors = Boolean(product.flavors?.length);
  const hasCustomGroups = allCustomGroups.length > 0;
  const isCustomizable = hasFlavors || hasCustomGroups;
  const showCardVariants =
    Boolean(product.variants?.length) &&
    (!isCustomizable || product.category === "pizzas" || product.category === "gelados");
  const variantLabel = product.variantLabel ?? "opção";
  const [added, setAdded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [flavor, setFlavor] = useState("");
  const [groupSelections, setGroupSelections] = useState<Record<string, string[]>>({});
  const [variantId, setVariantId] = useState(isCustomizable ? "" : product.variants?.[0]?.id ?? "");
  const [customQty, setCustomQty] = useState(1);

  const selectedVariant = useMemo(
    () => product.variants?.find((variant) => variant.id === variantId),
    [product.variants, variantId],
  );

  const customGroups = useMemo(
    () => allCustomGroups.filter((group) => !group.onlyVariantIds || group.onlyVariantIds.includes(variantId)),
    [allCustomGroups, variantId],
  );

  const basePrice = selectedVariant?.price ?? product.price;
  const displayImage = productImage(product);
  const isCustomImage = displayImage.startsWith("/menu/");
  const displayDescription = displayProductDescription(product);
  const longDescription = displayDescription.length > 90;
  const customGroupsValid = customGroups.every(
    (group) => (groupSelections[group.id]?.length ?? 0) >= (group.min ?? 0),
  );
  const canAddCustom =
    (!product.variants?.length || Boolean(selectedVariant)) && (!hasFlavors || Boolean(flavor)) && customGroupsValid;

  const extrasPrice = customGroups.reduce((sum, group) => {
    const selected = groupSelections[group.id] ?? [];
    return sum + selected.reduce((groupSum, option) => groupSum + optionPrice(group, option), 0);
  }, 0);

  const unitPrice = basePrice + extrasPrice;
  const totalPrice = unitPrice * customQty;

  const showAddedFeedback = () => {
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  const handleAdd = () => {
    if (isCustomizable) {
      setCustomizing(true);
      return;
    }

    add(productWithImage(product), selectedVariant);
    showAddedFeedback();
  };

  const toggleGroupOption = (groupId: string, option: string, max = 1) => {
    setGroupSelections((current) => {
      const selected = current[groupId] ?? [];
      if (selected.includes(option)) {
        return { ...current, [groupId]: selected.filter((item) => item !== option) };
      }
      if (max === 1) return { ...current, [groupId]: [option] };
      if (selected.length >= max) return current;
      return { ...current, [groupId]: [...selected, option] };
    });
  };

  const selectedCustomDetails = [
    flavor || "",
    ...customGroups.flatMap((group) => {
      const selected = groupSelections[group.id] ?? [];
      if (selected.length === 0) return [];
      const details = selected.map((option) => {
        const price = optionPrice(group, option);
        return price > 0 ? `${option} (+${brl(price)})` : option;
      });
      return [`${group.label}: ${details.join(", ")}`];
    }),
  ].filter(Boolean);

  const resetCustomization = () => {
    setFlavor("");
    setGroupSelections({});
    setVariantId("");
    setCustomQty(1);
  };

  const closeCustomization = () => {
    setCustomizing(false);
    resetCustomization();
  };

  const confirmCustomization = () => {
    if (!canAddCustom) return;

    const details = selectedCustomDetails.join(" • ") || undefined;
    for (let i = 0; i < customQty; i += 1) {
      add(productWithImage(product), selectedVariant, details, extrasPrice);
    }
    setCustomizing(false);
    resetCustomization();
    showAddedFeedback();
  };

  const optionControl = (checked: boolean, singleChoice: boolean, isRemoval: boolean) => (
    <span
      className={cn(
        "grid h-6 w-6 shrink-0 place-items-center border-2 transition",
        singleChoice ? "rounded-full" : "rounded-md",
        checked
          ? isRemoval
            ? "border-destructive bg-destructive text-destructive-foreground"
            : "border-primary bg-primary text-primary-foreground"
          : "border-muted-foreground/35 bg-background",
      )}
    >
      {checked && (singleChoice ? <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground" /> : <Check className="h-4 w-4" />)}
    </span>
  );

  const renderGroup = (group: UiOptionGroup) => {
    const selected = groupSelections[group.id] ?? [];
    const min = group.min ?? 0;
    const max = group.max ?? 1;
    const isRemoval = group.id === "retirar";
    const singleChoice = max === 1;
    const helpText = isRemoval
      ? "Selecione os ingredientes que você NÃO quer no pedido"
      : group.hint ?? (singleChoice ? "Escolha 1 opção" : `Escolha até ${max} opções`);

    return (
      <section key={group.id} className="border-b-[8px] border-muted/70 bg-background px-5 py-5">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h4 className="text-base font-semibold leading-snug text-foreground">
              {isRemoval ? "O que você quer retirar?" : group.label}
            </h4>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">{helpText}</p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-md px-2 py-1 text-xs font-semibold",
              min > 0 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground",
            )}
          >
            {min > 0 ? "Obrigatório" : "Opcional"}
          </span>
        </div>

        <div>
          {group.options.map((option, index) => {
            const checked = selected.includes(option);
            const limitReached = !checked && max > 1 && selected.length >= max;
            const price = optionPrice(group, option);

            return (
              <button
                key={option}
                type="button"
                disabled={limitReached}
                onClick={() => toggleGroupOption(group.id, option, max)}
                className={cn(
                  "flex min-h-14 w-full items-center justify-between gap-4 py-3.5 text-left transition",
                  index > 0 && "border-t border-border",
                  limitReached && "cursor-not-allowed opacity-45",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm font-medium", checked && isRemoval ? "text-destructive" : "text-foreground")}>
                    {option}
                  </p>
                  {checked && isRemoval && (
                    <p className="mt-0.5 text-xs font-medium text-destructive">Será retirado</p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {price > 0 && <span className="text-sm font-medium text-foreground">+ {brl(price)}</span>}
                  {optionControl(checked, singleChoice, isRemoval)}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    );
  };

  const customizer =
    customizing && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[80] flex items-end justify-center bg-foreground/55 sm:items-center sm:p-5">
            <button
              type="button"
              aria-label="Fechar personalização"
              onClick={closeCustomization}
              className="absolute inset-0"
            />

            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Personalizar ${product.name}`}
              className="relative z-10 flex h-[96svh] w-full flex-col overflow-hidden rounded-t-2xl bg-background sm:h-auto sm:max-h-[92svh] sm:max-w-xl sm:rounded-2xl"
            >
              <header className="flex items-center gap-3 border-b border-border bg-background px-5 py-4">
                <div className={cn("h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted", isCustomImage && "bg-black")}>
                  <img
                    src={displayImage}
                    alt={product.name}
                    className={cn("h-full w-full", isCustomImage ? "object-contain" : "object-cover")}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-semibold text-foreground">{product.name}</h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{displayDescription}</p>
                  <p className="mt-1 text-base font-semibold text-foreground">{brl(unitPrice)}</p>
                </div>
                <button
                  type="button"
                  onClick={closeCustomization}
                  aria-label="Fechar"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto bg-muted/70">
                {product.variants && product.variants.length > 0 && (
                  <section className="border-b-[8px] border-muted/70 bg-background px-5 py-5">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-base font-semibold text-foreground">Escolha o {variantLabel}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">Escolha 1 opção</p>
                      </div>
                      <span className="rounded-md bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">Obrigatório</span>
                    </div>

                    <div>
                      {product.variants.map((variant, index) => {
                        const checked = variant.id === variantId;
                        return (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() => setVariantId(variant.id)}
                            className={cn(
                              "flex min-h-14 w-full items-center justify-between gap-4 py-3.5 text-left",
                              index > 0 && "border-t border-border",
                            )}
                          >
                            <p className="text-sm font-medium text-foreground">
                              {product.category === "pizzas" && variant.id === "grande"
                                ? `${variant.label} — + Refri 2L GRÁTIS`
                                : variant.label}
                            </p>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-foreground">{brl(variant.price)}</span>
                              {optionControl(checked, true, false)}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                {hasFlavors && (
                  <section className="border-b-[8px] border-muted/70 bg-background px-5 py-5">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-base font-semibold text-foreground">Escolha o sabor</h4>
                        <p className="mt-1 text-sm text-muted-foreground">Escolha 1 opção</p>
                      </div>
                      <span className="rounded-md bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">Obrigatório</span>
                    </div>

                    <div>
                      {product.flavors?.map((item, index) => {
                        const checked = flavor === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setFlavor(item)}
                            className={cn(
                              "flex min-h-14 w-full items-center justify-between gap-4 py-3.5 text-left",
                              index > 0 && "border-t border-border",
                            )}
                          >
                            <p className="text-sm font-medium text-foreground">{item}</p>
                            {optionControl(checked, true, false)}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                {product.category === "pizzas" && variantId === "grande" && (
                  <div className="border-b-[8px] border-muted/70 bg-primary/10 px-5 py-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-background px-4 py-3.5 shadow-soft">
                      <span className="text-xl leading-none">🎁</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">Você ganhou 1 Refri 2L</p>
                        <p className="text-xs text-muted-foreground">Escolha Kuat ou Convenção abaixo</p>
                      </div>
                    </div>
                  </div>
                )}

                {customGroups.map(renderGroup)}
              </div>

              <footer className="border-t border-border bg-background p-4">
                <div className="flex items-stretch gap-3">
                  <div className="flex shrink-0 items-center rounded-xl border border-border bg-background">
                    <button
                      type="button"
                      aria-label="Diminuir quantidade"
                      onClick={() => setCustomQty((qty) => Math.max(1, qty - 1))}
                      disabled={customQty <= 1}
                      className="grid h-14 w-11 place-items-center text-primary disabled:text-muted-foreground"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-8 text-center text-base font-semibold text-foreground">{customQty}</span>
                    <button
                      type="button"
                      aria-label="Aumentar quantidade"
                      onClick={() => setCustomQty((qty) => Math.min(20, qty + 1))}
                      className="grid h-14 w-11 place-items-center text-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={confirmCustomization}
                    disabled={!canAddCustom}
                    className={cn(
                      "min-h-14 min-w-0 flex-1 rounded-xl px-3 text-sm font-semibold transition sm:text-base",
                      canAddCustom
                        ? "bg-gradient-primary text-primary-foreground shadow-soft"
                        : "cursor-not-allowed bg-muted text-muted-foreground opacity-70",
                    )}
                  >
                    Adicionar • {brl(totalPrice)}
                  </button>
                </div>
              </footer>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <article
        className={cn(
          "group flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
          featured && "border-gold/50",
        )}
      >
        <div className={cn("relative aspect-square overflow-hidden", isCustomImage && "bg-black")}>
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className={cn(
              "h-full w-full",
              isCustomImage ? "object-contain" : "object-cover transition-transform duration-700 group-hover:scale-105",
            )}
          />
          {product.badge && (
            <span
              className={cn(
                "absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide shadow-soft",
                product.badge === "Promoção"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-gradient-gold text-gold-foreground",
              )}
            >
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-semibold leading-snug text-foreground">{product.name}</h3>
          <p className={cn("mt-1.5 text-sm leading-relaxed text-muted-foreground", !expanded && "line-clamp-3")}>
            {displayDescription}
          </p>
          {longDescription && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="mt-1 self-start text-xs font-semibold text-secondary hover:underline"
            >
              {expanded ? "ver menos" : "ver mais"}
            </button>
          )}

          {product.category === "pizzas" && (
            <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/60 px-3.5 py-2.5">
              <span className="text-lg leading-none">🎁</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">Pizza GRANDE ganha Refri 2L</p>
                <p className="text-[11px] text-muted-foreground">Kuat ou Convenção</p>
              </div>
            </div>
          )}

          {showCardVariants && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {product.category === "pizzas" || product.category === "gelados" ? "Escolha o tamanho" : "Escolha uma opção"}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {product.variants?.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setVariantId(variant.id)}
                    className={cn(
                      "rounded-2xl border px-2 py-2 text-center text-xs font-semibold transition",
                      variant.id === variantId
                        ? "border-primary bg-accent text-primary shadow-soft"
                        : "border-border bg-background text-foreground/75 hover:border-primary/30",
                    )}
                  >
                    <span className="block whitespace-nowrap text-[11px] sm:text-xs">{variant.label}</span>
                    <span className="mt-0.5 block text-[11px]">{brl(variant.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <div>
              {product.variants && !isCustomizable && <span className="block text-[11px] text-muted-foreground">Opção selecionada</span>}
              {isCustomizable && (
                <span className="block text-[11px] text-muted-foreground">
                  {selectedVariant && (product.category === "pizzas" || product.category === "gelados")
                    ? "Tamanho selecionado"
                    : "A partir de"}
                </span>
              )}
              <span className="font-display text-2xl font-semibold text-primary">{brl(basePrice)}</span>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold shadow-soft",
                added ? "bg-success text-success-foreground" : "bg-gradient-primary text-primary-foreground",
              )}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" />Adicionado
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />{isCustomizable ? "Escolher opções" : "Adicionar"}
                </>
              )}
            </button>
          </div>
        </div>
      </article>
      {customizer}
    </>
  );
}
