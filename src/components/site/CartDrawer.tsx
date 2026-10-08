import { useState } from "react";
import {
  Banknote,
  Bike,
  CreditCard,
  LoaderCircle,
  MapPin,
  MessageSquareText,
  Minus,
  Plus,
  Route,
  ShoppingBag,
  Store,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { brl, business } from "@/data/business";
import { cartItemPrice, useCart } from "@/hooks/useCart";
import { getDeliveryQuote, type DeliveryQuote } from "@/lib/delivery";
import { orderMessage, whatsappLink, type FulfillmentType } from "@/lib/whatsapp";
import { trackWhatsappOrderClick } from "@/lib/order-tracking";

const paymentOptions = [
  { value: "PIX", label: "PIX", icon: CreditCard },
  { value: "Dinheiro", label: "Dinheiro", icon: Banknote },
  { value: "Cartão de crédito", label: "Crédito", icon: CreditCard },
  { value: "Cartão de débito", label: "Débito", icon: CreditCard },
] as const;

type DeliveryStatus = "idle" | "loading" | "success" | "error";

export function CartDrawer() {
  const { open, setOpen, items, subtotal, count, setQty, remove, notes, setNotes, clear } = useCart();
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType | "">("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [complement, setComplement] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>("idle");
  const [deliveryQuote, setDeliveryQuote] = useState<DeliveryQuote | null>(null);
  const [deliveryError, setDeliveryError] = useState("");
  const [quotedAddress, setQuotedAddress] = useState("");

  if (!open) return null;

  const isDelivery = fulfillmentType === "delivery";
  const deliveryFee = isDelivery ? deliveryQuote?.fee ?? null : 0;
  const displayedTotal = subtotal + (deliveryFee ?? 0);
  const parsedCash = cashAmount.trim() ? Number(cashAmount.replace(",", ".")) : Number.NaN;
  const validCashValue = Number.isFinite(parsedCash) ? parsedCash : null;
  const change = paymentMethod === "Dinheiro" && validCashValue !== null ? validCashValue - displayedTotal : null;

  const fulfillmentMissing = attemptedSubmit && !fulfillmentType;
  const nameMissing = attemptedSubmit && !customerName.trim();
  const addressMissing = attemptedSubmit && isDelivery && !address.trim();
  const complementMissing = attemptedSubmit && isDelivery && !complement.trim();
  const paymentMissing = attemptedSubmit && !paymentMethod;
  const cashMissing = attemptedSubmit && paymentMethod === "Dinheiro" && validCashValue === null;
  const cashInsufficient = paymentMethod === "Dinheiro" && validCashValue !== null && validCashValue < displayedTotal;

  const resetDeliveryQuote = () => {
    setDeliveryStatus("idle");
    setDeliveryQuote(null);
    setDeliveryError("");
    setQuotedAddress("");
  };

  const calculateQuote = async (targetAddress: string) => {
    const cleanAddress = targetAddress.trim();
    if (!cleanAddress) return null;

    setDeliveryStatus("loading");
    setDeliveryError("");

    try {
      const quote = await getDeliveryQuote(cleanAddress);
      setDeliveryQuote(quote);
      setQuotedAddress(cleanAddress);
      setDeliveryStatus("success");
      return quote;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível calcular a entrega.";
      setDeliveryQuote(null);
      setDeliveryError(message);
      setDeliveryStatus("error");
      return null;
    }
  };

  const chooseFulfillment = (type: FulfillmentType) => {
    setFulfillmentType(type);
    resetDeliveryQuote();
    if (type === "pickup") {
      setAddress("");
      setComplement("");
    } else if (address.trim()) {
      void calculateQuote(address);
    }
  };

  const resetCheckout = () => {
    setFulfillmentType("");
    setCustomerName("");
    setAddress("");
    setComplement("");
    setPaymentMethod("");
    setCashAmount("");
    setAttemptedSubmit(false);
    resetDeliveryQuote();
  };

  const finish = async () => {
    setAttemptedSubmit(true);

    const missing: string[] = [];
    if (!fulfillmentType) missing.push("forma de recebimento");
    if (!customerName.trim()) missing.push("nome");
    if (fulfillmentType === "delivery" && !address.trim()) missing.push("endereço");
    if (fulfillmentType === "delivery" && !complement.trim()) missing.push("complemento/referência");
    if (!paymentMethod) missing.push("forma de pagamento");

    if (missing.length > 0) {
      window.alert(`Antes de finalizar, preencha: ${missing.join(", ")}.`);
      return;
    }

    let quoteForOrder = deliveryQuote;
    if (fulfillmentType === "delivery" && (!quoteForOrder || quotedAddress !== address.trim())) {
      quoteForOrder = await calculateQuote(address);
      if (!quoteForOrder) return;
    }

    if (fulfillmentType === "delivery" && quoteForOrder?.fee === null) {
      window.alert(
        "A distância já foi calculada, mas a regra de preço da entrega ainda não foi configurada pela loja. Por enquanto, escolha retirada no local ou aguarde a definição da tarifa.",
      );
      return;
    }

    const feeForOrder = fulfillmentType === "delivery" ? quoteForOrder?.fee ?? 0 : 0;
    const totalForOrder = subtotal + feeForOrder;

    if (paymentMethod === "Dinheiro") {
      if (validCashValue === null) {
        window.alert("Informe com quanto você vai pagar em dinheiro para calcular o troco.");
        return;
      }
      if (validCashValue < totalForOrder) {
        window.alert(`O valor informado precisa ser pelo menos ${brl(totalForOrder)}.`);
        return;
      }
    }

    if (!notes.trim()) {
      const continueWithoutNotes = window.confirm(
        "Você não adicionou observações. Confira se precisa informar alguma instrução de entrega ou observação extra. Deseja finalizar sem observações?",
      );
      if (!continueWithoutNotes) return;
    }

    trackWhatsappOrderClick({
      items,
      subtotal,
      notes,
      paymentMethod,
      cashAmount: paymentMethod === "Dinheiro" ? validCashValue : null,
    });

    window.open(
      whatsappLink(
        orderMessage(
          items,
          subtotal,
          notes,
          customerName,
          fulfillmentType === "delivery" ? address : "",
          fulfillmentType === "delivery" ? complement : "",
          paymentMethod,
          paymentMethod === "Dinheiro" ? validCashValue : null,
          fulfillmentType,
          fulfillmentType === "delivery" ? quoteForOrder?.fee ?? 0 : null,
          fulfillmentType === "delivery" ? quoteForOrder?.distanceKm ?? null : null,
        ),
      ),
      "_blank",
    );

    clear();
    resetCheckout();
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Fechar carrinho"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-foreground/55 backdrop-blur-sm"
      />

      <aside className="animate-rise absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-background shadow-lift">
        <header className="border-b border-border bg-card px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Finalizar pedido</p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">Confira antes de enviar</h2>
              <p className="mt-1 text-xs text-muted-foreground">{count} item(ns) • campos com * são obrigatórios</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-accent">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </span>
            <p className="font-display text-lg font-semibold text-foreground">Seu carrinho está vazio.</p>
            <p className="mt-2 text-sm text-muted-foreground">Escolha um item no cardápio para começar.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Seu pedido</h3>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">{count} item(ns)</span>
                </div>

                <div className="space-y-3">
                  {items.map((item) => {
                    const { product, qty, variant, flavor, key } = item;
                    return (
                      <div key={key} className="flex gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-soft">
                        <img src={product.image} alt={product.name} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-foreground">{product.name}</p>
                          {(variant || flavor) && (
                            <p className="text-xs font-medium text-secondary">
                              {[variant?.label, flavor].filter(Boolean).join(" • ")}
                            </p>
                          )}
                          <p className="text-sm font-medium text-primary">{brl(cartItemPrice(item))}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button type="button" onClick={() => setQty(key, qty - 1)} className="grid h-8 w-8 place-items-center rounded-full bg-accent text-primary" aria-label={`Diminuir quantidade de ${product.name}`}>
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                            <button type="button" onClick={() => setQty(key, qty + 1)} className="grid h-8 w-8 place-items-center rounded-full bg-accent text-primary" aria-label={`Aumentar quantidade de ${product.name}`}>
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                            <button type="button" onClick={() => remove(key)} className="ml-auto grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label={`Remover ${product.name}`}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className={`rounded-3xl border bg-card p-4 shadow-soft ${fulfillmentMissing ? "border-destructive" : "border-border"}`}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent text-primary"><Route className="h-5 w-5" /></span>
                  <div>
                    <h3 className="font-semibold text-foreground">1. Como vai receber? <span className="text-destructive">*</span></h3>
                    <p className="text-xs text-muted-foreground">Escolha entrega ou retirada no local.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => chooseFulfillment("delivery")}
                    className={`flex min-h-16 items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold ${isDelivery ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"}`}
                  >
                    <Bike className="h-4 w-4" /> Entrega
                  </button>
                  <button
                    type="button"
                    onClick={() => chooseFulfillment("pickup")}
                    className={`flex min-h-16 items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold ${fulfillmentType === "pickup" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"}`}
                  >
                    <Store className="h-4 w-4" /> Retirar no local
                  </button>
                </div>
                {fulfillmentMissing && <p className="mt-2 text-xs font-medium text-destructive">Escolha como deseja receber o pedido.</p>}
              </section>

              <section className="rounded-3xl border border-border bg-card p-4 shadow-soft">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent text-primary"><UserRound className="h-5 w-5" /></span>
                  <div>
                    <h3 className="font-semibold text-foreground">2. Dados do cliente</h3>
                    <p className="text-xs text-muted-foreground">Preencha os dados necessários.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="customer-name" className="mb-1.5 block text-sm font-medium text-foreground">Nome <span className="text-destructive">*</span></label>
                    <input
                      id="customer-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Seu nome"
                      aria-invalid={nameMissing}
                      className={`w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-primary/10 ${nameMissing ? "border-destructive" : "border-border"}`}
                    />
                    {nameMissing && <p className="mt-1 text-xs font-medium text-destructive">Informe seu nome.</p>}
                  </div>

                  {isDelivery && (
                    <>
                      <div>
                        <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-foreground">Endereço de entrega <span className="text-destructive">*</span></label>
                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                          <textarea
                            id="address"
                            rows={2}
                            value={address}
                            onChange={(e) => {
                              setAddress(e.target.value);
                              if (e.target.value.trim() !== quotedAddress) resetDeliveryQuote();
                            }}
                            onBlur={() => {
                              if (address.trim() && address.trim() !== quotedAddress) void calculateQuote(address);
                            }}
                            placeholder="Rua, número e bairro"
                            aria-invalid={addressMissing}
                            className={`w-full resize-none rounded-2xl border bg-background py-3 pl-11 pr-4 text-sm outline-none focus:ring-4 focus:ring-primary/10 ${addressMissing ? "border-destructive" : "border-border"}`}
                          />
                        </div>
                        {addressMissing && <p className="mt-1 text-xs font-medium text-destructive">Informe o endereço.</p>}
                      </div>

                      <div>
                        <label htmlFor="complement" className="mb-1.5 block text-sm font-medium text-foreground">Complemento / Referência <span className="text-destructive">*</span></label>
                        <input
                          id="complement"
                          type="text"
                          value={complement}
                          onChange={(e) => setComplement(e.target.value)}
                          placeholder="Ex.: muro branco, portão preto, apto 202..."
                          aria-invalid={complementMissing}
                          className={`w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-primary/10 ${complementMissing ? "border-destructive" : "border-border"}`}
                        />
                        {complementMissing && <p className="mt-1 text-xs font-medium text-destructive">Informe um complemento ou ponto de referência.</p>}
                      </div>

                      <div className="rounded-2xl border border-primary/20 bg-accent/30 p-3.5">
                        {deliveryStatus === "loading" && (
                          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <LoaderCircle className="h-4 w-4 animate-spin text-primary" /> Calculando distância e taxa de entrega...
                          </div>
                        )}
                        {deliveryStatus === "success" && deliveryQuote && (
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">Distância estimada: {deliveryQuote.distanceKm.toFixed(1).replace(".", ",")} km</p>
                            {deliveryQuote.fee !== null ? (
                              <p className="text-sm font-semibold text-primary">Taxa de entrega: {brl(deliveryQuote.fee)}</p>
                            ) : (
                              <p className="text-xs leading-relaxed text-muted-foreground">A distância já está funcionando. A tarifa ainda aguarda a regra de cobrança que a loja vai fornecer.</p>
                            )}
                          </div>
                        )}
                        {deliveryStatus === "error" && (
                          <div>
                            <p className="text-xs font-medium text-destructive">{deliveryError}</p>
                            <button type="button" onClick={() => void calculateQuote(address)} className="mt-2 text-xs font-semibold text-primary underline underline-offset-2">Tentar novamente</button>
                          </div>
                        )}
                        {deliveryStatus === "idle" && (
                          <p className="text-xs leading-relaxed text-muted-foreground">A distância será calculada automaticamente quando você terminar de preencher o endereço.</p>
                        )}
                      </div>
                    </>
                  )}

                  {fulfillmentType === "pickup" && (
                    <div className="rounded-2xl border border-primary/20 bg-accent/30 p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Retirada</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{business.address}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Sem taxa de entrega.</p>
                    </div>
                  )}
                </div>
              </section>

              <section className={`rounded-3xl border bg-card p-4 shadow-soft ${paymentMissing ? "border-destructive" : "border-border"}`}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent text-primary"><CreditCard className="h-5 w-5" /></span>
                  <div>
                    <h3 className="font-semibold text-foreground">3. Forma de pagamento <span className="text-destructive">*</span></h3>
                    <p className="text-xs text-muted-foreground">Escolha uma opção.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {paymentOptions.map(({ value, label, icon: Icon }) => {
                    const selected = paymentMethod === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(value);
                          if (value !== "Dinheiro") setCashAmount("");
                        }}
                        className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"}`}
                      >
                        <Icon className="h-4 w-4" />{label}
                      </button>
                    );
                  })}
                </div>
                {paymentMissing && <p className="mt-2 text-xs font-medium text-destructive">Selecione uma forma de pagamento.</p>}

                {paymentMethod === "Dinheiro" && (
                  <div className={`mt-4 rounded-2xl border p-4 ${cashInsufficient || cashMissing ? "border-destructive bg-destructive/5" : "border-primary/20 bg-accent/40"}`}>
                    <label htmlFor="cash-amount" className="mb-2 block text-sm font-semibold text-foreground">Vai pagar com quanto? <span className="text-destructive">*</span></label>
                    <input
                      id="cash-amount"
                      type="text"
                      inputMode="decimal"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      placeholder={`Ex.: ${Math.ceil(displayedTotal / 10) * 10},00`}
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-primary/10"
                    />
                    {change !== null && change >= 0 && <p className="mt-2 text-sm font-semibold text-primary">Troco: {brl(change)}</p>}
                    {cashMissing && <p className="mt-2 text-xs font-medium text-destructive">Informe o valor em dinheiro.</p>}
                    {cashInsufficient && <p className="mt-2 text-xs font-medium text-destructive">O valor precisa ser pelo menos {brl(displayedTotal)}.</p>}
                  </div>
                )}
              </section>

              <section className="rounded-3xl border border-primary/20 bg-accent/30 p-4">
                <div className="mb-3 flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-background text-primary"><MessageSquareText className="h-5 w-5" /></span>
                  <div>
                    <h3 className="font-semibold text-foreground">4. Observações <span className="text-xs font-normal text-muted-foreground">(opcional)</span></h3>
                    <p className="text-xs text-muted-foreground">Use para detalhes do pedido, retirada ou entrega.</p>
                  </div>
                </div>
                <textarea
                  id="obs"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex.: tocar o interfone, retirar ingrediente, observação extra..."
                  className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:ring-4 focus:ring-primary/10"
                />
              </section>
            </div>

            <footer className="border-t border-border bg-card px-5 py-4">
              {isDelivery && (
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Produtos</span>
                  <span className="font-medium text-foreground">{brl(subtotal)}</span>
                </div>
              )}
              {isDelivery && (
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de entrega</span>
                  <span className="font-semibold text-primary">
                    {deliveryQuote?.fee !== null && deliveryQuote?.fee !== undefined ? brl(deliveryQuote.fee) : "A configurar"}
                  </span>
                </div>
              )}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{isDelivery && deliveryFee === null ? "Total parcial" : "Total do pedido"}</span>
                <span className="font-display text-2xl font-semibold text-primary">{brl(displayedTotal)}</span>
              </div>
              <button
                type="button"
                onClick={() => void finish()}
                disabled={deliveryStatus === "loading"}
                className="w-full rounded-full bg-gradient-gold py-4 text-base font-semibold text-gold-foreground shadow-gold disabled:cursor-wait disabled:opacity-60"
              >
                {deliveryStatus === "loading" ? "Calculando entrega..." : "Finalizar no WhatsApp"}
              </button>
              <p className="mt-2 text-center text-xs text-muted-foreground">Confira os dados antes de enviar.</p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
