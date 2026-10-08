import { brl, business } from "@/data/business";
import { cartItemPrice, type CartItem } from "@/hooks/useCart";

const MAX_WHATSAPP_MESSAGE_LENGTH = 8000;

export type FulfillmentType = "delivery" | "pickup";

const emoji = {
  pizza: String.fromCodePoint(0x1f355),
  person: String.fromCodePoint(0x1f464),
  name: String.fromCodePoint(0x1f64b),
  pin: String.fromCodePoint(0x1f4cd),
  card: String.fromCodePoint(0x1f4b3),
  cash: String.fromCodePoint(0x1f4b5),
  change: String.fromCodePoint(0x1f504),
  cart: String.fromCodePoint(0x1f6d2),
  money: String.fromCodePoint(0x1f4b0),
  note: String.fromCodePoint(0x1f4dd),
  check: String.fromCodePoint(0x2705),
  delivery: String.fromCodePoint(0x1f6f5),
  store: String.fromCodePoint(0x1f3ea),
  route: String.fromCodePoint(0x1f4cf),
} as const;

function stripControlCharacters(value: string) {
  return Array.from(value, (character) => {
    const code = character.codePointAt(0) ?? 0;
    return code <= 0x1f || code === 0x7f ? " " : character;
  }).join("");
}

function safeText(value: string, maxLength: number) {
  return stripControlCharacters(value)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function hasIngredientException(details: string[]) {
  return details.some((detail) =>
    /^(retirar\b|sem\b)|ingrediente(?:s)?\s+(?:retirado|removido)|\bretirar\s+(?:da|do|de|ingrediente)/i.test(detail),
  );
}

export function whatsappLink(message: string) {
  const boundedMessage = message.slice(0, MAX_WHATSAPP_MESSAGE_LENGTH);
  return `https://api.whatsapp.com/send?phone=${business.whatsapp}&text=${encodeURIComponent(boundedMessage)}`;
}

export function orderMessage(
  items: CartItem[],
  subtotal: number,
  notes: string,
  customerName: string,
  address: string,
  complement: string,
  paymentMethod: string,
  cashAmount: number | null,
  fulfillmentType: FulfillmentType,
  deliveryFee: number | null,
  deliveryDistanceKm: number | null,
) {
  const safeCustomerName = safeText(customerName, 100);
  const safeAddress = safeText(address, 300);
  const safeComplement = safeText(complement, 200);
  const safeNotes = safeText(notes, 500);
  const safePaymentMethod = safeText(paymentMethod, 50);

  const lines = items.slice(0, 40).flatMap((item) => {
    const size = item.variant?.label ? ` (${item.variant.label})` : "";
    const head = `${item.qty}x ${item.product.name}${size} — ${brl(item.qty * cartItemPrice(item))}`;
    const rawDetails = (item.flavor ?? "")
      .split("•")
      .map((part) => safeText(part, 200))
      .filter(Boolean);
    const details = rawDetails.map((part) => `   ↳ ${part}`);
    if (hasIngredientException(rawDetails)) {
      details.push("   ↳ Restante dos ingredientes: normal");
    }
    return [head, ...details];
  });

  const safeCashAmount =
    cashAmount !== null && Number.isFinite(cashAmount) && cashAmount >= 0 && cashAmount <= 1_000_000
      ? cashAmount
      : null;
  const safeDeliveryFee =
    fulfillmentType === "delivery" && deliveryFee !== null && Number.isFinite(deliveryFee) && deliveryFee >= 0
      ? deliveryFee
      : 0;
  const finalTotal = subtotal + safeDeliveryFee;
  const isCash = safePaymentMethod === "Dinheiro";
  const change = isCash && safeCashAmount !== null ? Math.max(0, safeCashAmount - finalTotal) : null;

  const fulfillmentLines =
    fulfillmentType === "delivery"
      ? [
          `${emoji.delivery} Entrega`,
          `${emoji.pin} ${safeAddress}`,
          `${emoji.pin} Complemento/Referência: ${safeComplement}`,
          ...(deliveryDistanceKm !== null && Number.isFinite(deliveryDistanceKm)
            ? [`${emoji.route} Distância estimada: ${deliveryDistanceKm.toFixed(1).replace(".", ",")} km`]
            : []),
          `${emoji.money} Taxa de entrega: ${brl(safeDeliveryFee)}`,
        ]
      : [
          `${emoji.store} Retirada no local`,
          `${emoji.pin} Retirada em: ${business.address}`,
        ];

  return [
    `${emoji.pizza} *NOVO PEDIDO — ${business.name.toUpperCase()}*`,
    "",
    `${emoji.cart} *PEDIDO*`,
    ...lines,
    "",
    `${emoji.money} Produtos: ${brl(subtotal)}`,
    ...(fulfillmentType === "delivery" ? [`${emoji.money} Taxa de entrega: ${brl(safeDeliveryFee)}`] : []),
    `${emoji.money} *Total:* ${brl(finalTotal)}`,
    ...(safeNotes ? ["", `${emoji.note} *Obs.:* ${safeNotes}`] : []),
    "",
    `${emoji.person} *CLIENTE*`,
    `${emoji.name} ${safeCustomerName}`,
    "",
    `${emoji.check} *RECEBIMENTO*`,
    ...fulfillmentLines,
    "",
    `${emoji.card} *PAGAMENTO*`,
    safePaymentMethod,
    ...(isCash && safeCashAmount !== null
      ? [`${emoji.cash} Paga com ${brl(safeCashAmount)} — troco ${brl(change ?? 0)}`]
      : []),
  ].join("\n");
}
