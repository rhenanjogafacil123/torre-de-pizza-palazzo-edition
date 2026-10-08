import { ShoppingBag } from "lucide-react";
import { brl } from "@/data/business";
import { useCart } from "@/hooks/useCart";
export function MobileCartBar(){const{count,subtotal,setOpen,open}=useCart();if(count===0||open)return null;return <div className="animate-rise fixed inset-x-0 bottom-0 z-50 p-3 md:hidden"><button type="button" onClick={()=>setOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-lift"><ShoppingBag className="h-4 w-4"/>Ver pedido • {count} {count===1?"item":"itens"} • {brl(subtotal)}</button></div>}
