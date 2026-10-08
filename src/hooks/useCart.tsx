import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product, ProductVariant } from "@/data/menu";

const MAX_CART_LINES = 40;
const MAX_ITEM_QTY = 20;
const MAX_NOTES_LENGTH = 500;

export type CartItem = {
  product: Product;
  qty: number;
  variant?: ProductVariant | undefined;
  flavor?: string | undefined;
  extraPrice?: number | undefined;
  key: string;
};

type CartContext = {
  items: CartItem[];
  count: number;
  subtotal: number;
  notes: string;
  setNotes: (v: string) => void;
  add: (product: Product, variant?: ProductVariant, flavor?: string, extraPrice?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<CartContext | null>(null);

const safeQty = (qty: number) => {
  if (!Number.isFinite(qty)) return 0;
  return Math.min(MAX_ITEM_QTY, Math.max(0, Math.floor(qty)));
};

export const cartItemPrice = (item: Pick<CartItem, "product" | "variant" | "extraPrice">) =>
  (item.variant?.price ?? item.product.price) + (item.extraPrice ?? 0);

export const cartItemKey = (product: Product, variant?: ProductVariant, flavor?: string, extraPrice = 0) =>
  `${product.id}::${variant?.id ?? "default"}::${flavor ?? "default"}::${extraPrice.toFixed(2)}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [notes, setNotesState] = useState("");
  const [open, setOpen] = useState(false);

  const value = useMemo<CartContext>(() => {
    const setQty = (key: string, qty: number) => {
      const nextQty = safeQty(qty);
      setItems((prev) =>
        nextQty <= 0
          ? prev.filter((i) => i.key !== key)
          : prev.map((i) => (i.key === key ? { ...i, qty: nextQty } : i)),
      );
    };

    return {
      items,
      notes,
      setNotes: (value) => setNotesState(value.slice(0, MAX_NOTES_LENGTH)),
      open,
      setOpen,
      count: items.reduce((sum, item) => sum + item.qty, 0),
      subtotal: items.reduce((sum, item) => sum + item.qty * cartItemPrice(item), 0),
      add: (product, variant, flavor, extraPrice = 0) =>
        setItems((prev) => {
          const key = cartItemKey(product, variant, flavor, extraPrice);
          const found = prev.find((i) => i.key === key);
          if (found) {
            if (found.qty >= MAX_ITEM_QTY) return prev;
            return prev.map((i) => (i.key === key ? { ...i, qty: safeQty(i.qty + 1) } : i));
          }
          if (prev.length >= MAX_CART_LINES) return prev;
          return [...prev, { product, variant, flavor, extraPrice, key, qty: 1 }];
        }),
      remove: (key) => setItems((prev) => prev.filter((i) => i.key !== key)),
      setQty,
      clear: () => {
        setItems([]);
        setNotesState("");
      },
    };
  }, [items, notes, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
