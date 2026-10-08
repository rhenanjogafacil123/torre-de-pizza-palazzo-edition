import React, { useState, useEffect, useMemo } from "react";
import {
  Printer,
  Settings2,
  Check,
  ChefHat,
  Clock3,
  MapPin,
  Trash2,
  PackageCheck,
  Pencil,
  Phone,
  Plus,
  ReceiptText,
  ShoppingBag,
  Store,
  UserRound,
  X,
  Bike,
  CircleDollarSign,
  Package,
} from "lucide-react";
import { DashboardShell, CardBox } from "./DashboardShell";
import { usePersistedState } from "./usePersistedState";

export interface OrderItem {
  id: number;
  customer: string;
  channel: string;
  items: string[];
  payment: string;
  price: string;
  minutes: number;
  status: "recebido" | "preparando" | "pronto" | "entrega";
  phone?: string;
  address?: string;
  neighborhood?: string;
  notes?: string;
  courier?: string;
  createdAt?: string;
}

const defaultOrders: OrderItem[] = [
  {
    id: 1048,
    customer: "João Silva",
    channel: "WhatsApp",
    items: ["1x Pizza Calabresa Especial (Grande)", "1x Coca-Cola 2L"],
    payment: "Pix",
    price: "R$ 58,00",
    minutes: 2,
    status: "recebido",
    phone: "(21) 99142-7730",
    address: "Rua das Flores, 123",
    neighborhood: "Paciência",
    notes: "Sem cebola. Massa bem assada.",
    createdAt: "19:32",
  },
  {
    id: 1049,
    customer: "Mariana Costa",
    channel: "Cardápio Digital",
    items: ["1x Pizza Frango c/ Catupiry (Grande)", "1x Borda Recheada de Catupiry"],
    payment: "Cartão",
    price: "R$ 62,00",
    minutes: 6,
    status: "recebido",
    phone: "(21) 98821-4452",
    address: "Estrada do Mendanha, 840",
    neighborhood: "Campo Grande",
    notes: "Interfone 204.",
    createdAt: "19:28",
  },
  {
    id: 1050,
    customer: "Carlos Ribeiro",
    channel: "Balcão",
    items: ["1x Pizza Quatro Queijos (Média)", "1x Guaraná Antarctica 2L"],
    payment: "Dinheiro",
    price: "R$ 48,50",
    minutes: 8,
    status: "recebido",
    phone: "(21) 98044-5012",
    neighborhood: "Paciência",
    notes: "Retirada no balcão em 20 min.",
    createdAt: "19:22",
  },
  {
    id: 1045,
    customer: "Ana Paula",
    channel: "Cardápio Digital",
    items: ["1x Pizza Portuguesa Tradicional (Grande)", "1x Coca-Cola 2L"],
    payment: "Cartão",
    price: "R$ 59,90",
    minutes: 12,
    status: "preparando",
    phone: "(21) 97420-1188",
    address: "Rua Silva Cardoso, 91",
    neighborhood: "Santa Cruz",
    notes: "Caprichar no orégano e azeitonas.",
    createdAt: "19:12",
  },
  {
    id: 1047,
    customer: "Lucas Mendes",
    channel: "WhatsApp",
    items: ["1x Pizza Dois Queijos (Grande)", "1x Guaraná 2L"],
    payment: "Pix",
    price: "R$ 49,00",
    minutes: 15,
    status: "preparando",
    phone: "(21) 98211-8301",
    address: "Rua Pioneiros, 557",
    neighborhood: "Paciência",
    createdAt: "19:09",
  },
  {
    id: 1051,
    customer: "Fernanda Lima",
    channel: "Balcão",
    items: ["1x Pizza Chocolate c/ Morango (Broto)"],
    payment: "Dinheiro",
    price: "R$ 32,50",
    minutes: 18,
    status: "preparando",
    phone: "(21) 99763-9120",
    neighborhood: "Paciência",
    notes: "Troco para R$ 50.",
    createdAt: "19:05",
  },
  {
    id: 1046,
    customer: "Pedro Santos",
    channel: "WhatsApp",
    items: ["1x Pizza Calabresa (Grande)", "1x Guaravita 290ml"],
    payment: "Pix",
    price: "R$ 48,00",
    minutes: 5,
    status: "pronto",
    phone: "(21) 99280-1477",
    address: "Rua Felipe Cardoso, 303",
    neighborhood: "Santa Cruz",
    createdAt: "18:58",
  },
  {
    id: 1044,
    customer: "Juliana Alves",
    channel: "Cardápio Digital",
    items: ["1x Pizza Marguerita Especial (Grande)"],
    payment: "Cartão",
    price: "R$ 49,00",
    minutes: 8,
    status: "pronto",
    phone: "(21) 97331-6009",
    address: "Av. Cesário de Melo, 1902",
    neighborhood: "Campo Grande",
    createdAt: "18:51",
  },
  {
    id: 1042,
    customer: "Amanda Rocha",
    channel: "Delivery",
    items: ["1x Pizza Especial do Juca (Gigante 45cm)", "1x Coca-Cola 2L"],
    payment: "Cartão",
    price: "R$ 76,00",
    minutes: 8,
    status: "entrega",
    courier: "Matheus Alves",
    phone: "(21) 99812-3381",
    address: "Rua das Acácias, 321",
    neighborhood: "Campo Grande",
    notes: "Casa com portão branco.",
    createdAt: "18:40",
  },
  {
    id: 1043,
    customer: "Gabriel Martins",
    channel: "Delivery",
    items: ["1x Pizza Frango Crocante (Grande)", "1x Guaraná 2L"],
    payment: "Pix",
    price: "R$ 56,00",
    minutes: 12,
    status: "entrega",
    courier: "Rafael Lima",
    phone: "(21) 97642-2230",
    address: "Rua Álvaro Alberto, 789",
    neighborhood: "Paciência",
    createdAt: "18:34",
  },
];

const columnDefs = [
  {
    status: "recebido" as const,
    title: "Recebido",
    dot: "bg-slate-400",
    action: "Confirmar pedido",
    button: "bg-emerald-500 text-white hover:bg-emerald-600",
  },
  {
    status: "preparando" as const,
    title: "Preparando",
    dot: "bg-amber-400",
    action: "Marcar pronto",
    button: "bg-amber-100 text-amber-700 hover:bg-amber-200",
  },
  {
    status: "pronto" as const,
    title: "Pronto",
    dot: "bg-emerald-500",
    action: "Atribuir motoboy",
    button: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  },
  {
    status: "entrega" as const,
    title: "Em entrega",
    dot: "bg-blue-500",
    action: "Finalizar",
    button: "bg-slate-900 text-white hover:bg-slate-800",
  },
];

const couriersList = [
  { name: "Rafael Lima", status: "Disponível", deliveries: "12 entregas hoje", tone: "green" },
  { name: "Diego Souza", status: "Disponível", deliveries: "8 entregas hoje", tone: "green" },
  { name: "Matheus Alves", status: "Em entrega", deliveries: "9 entregas hoje", tone: "amber" },
  { name: "Bruno Costa", status: "Disponível", deliveries: "6 entregas hoje", tone: "green" },
];

const defaultSoldOut = [
  "Borda Recheada de Cheddar",
  "Pizza Especial de Camarão",
  "Guaracamp 285ml",
];

export function OrdersBoard() {
  const [orders, setOrders] = usePersistedState<OrderItem[]>(
    "bora-panel-orders",
    defaultOrders,
  );
  const [modalNewOpen, setModalNewOpen] = useState(false);
  const [modalKanbanOpen, setModalKanbanOpen] = useState(false);
  const [assigningOrder, setAssigningOrder] = useState<OrderItem | null>(null);
  const [soldOutItems, setSoldOutItems] = usePersistedState<string[]>(
    "bora-panel-sold-out",
    defaultSoldOut,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleStatuses, setVisibleStatuses] = usePersistedState<string[]>(
    "bora-panel-visible-statuses",
    ["recebido", "preparando", "pronto", "entrega"],
  );
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [printingOrderId, setPrintingOrderId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  // Sincronização automática com pedidos vindos do Cardápio
  useEffect(() => {
    try {
      const incomingOrderStr = window.localStorage.getItem("bora-panel-repeat-order");
      if (!incomingOrderStr) return;
      const incoming = JSON.parse(incomingOrderStr);
      setOrders((prev) => (prev.some((o) => o.id === incoming.id) ? prev : [incoming, ...prev]));
      window.localStorage.removeItem("bora-panel-repeat-order");
    } catch {
      window.localStorage.removeItem("bora-panel-repeat-order");
    }
  }, [setOrders]);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase("pt-BR");
    if (!q) return orders;
    return orders.filter((o) =>
      [
        String(o.id),
        o.customer,
        o.channel,
        o.payment,
        o.price,
        o.courier ?? "",
        ...o.items,
      ]
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(q),
    );
  }, [orders, searchQuery]);

  const activeColumns = useMemo(
    () =>
      columnDefs
        .filter((col) => visibleStatuses.includes(col.status))
        .map((col) => ({
          ...col,
          orders: filteredOrders.filter((o) => o.status === col.status),
        })),
    [filteredOrders, visibleStatuses],
  );

  const selectedOrder = useMemo(
    () => (selectedOrderId ? orders.find((o) => o.id === selectedOrderId) ?? null : null),
    [orders, selectedOrderId],
  );

  const editingOrder = useMemo(
    () => (editingOrderId ? orders.find((o) => o.id === editingOrderId) ?? null : null),
    [orders, editingOrderId],
  );

  const printingOrder = useMemo(
    () => (printingOrderId ? orders.find((o) => o.id === printingOrderId) ?? null : null),
    [orders, printingOrderId],
  );

  const counts = useMemo(
    () => ({
      recebido: orders.filter((o) => o.status === "recebido").length,
      preparando: orders.filter((o) => o.status === "preparando").length,
      pronto: orders.filter((o) => o.status === "pronto").length,
      entrega: orders.filter((o) => o.status === "entrega").length,
    }),
    [orders],
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(""), 2500);
  };

  const advanceStatus = (order: OrderItem) => {
    if (order.status === "pronto") {
      setAssigningOrder(order);
      return;
    }
    const nextMap: Record<string, OrderItem["status"] | null> = {
      recebido: "preparando",
      preparando: "pronto",
      entrega: null,
    };
    const next = nextMap[order.status];
    if (next) {
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: next, minutes: 0 } : o)),
      );
    } else {
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      showToast(`Pedido #${order.id} finalizado.`);
    }
  };

  const handleAssignCourier = (courierName: string) => {
    if (!assigningOrder) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === assigningOrder.id
          ? { ...o, status: "entrega", channel: "Delivery", courier: courierName, minutes: 0 }
          : o,
      ),
    );
    setAssigningOrder(null);
    showToast(`Pedido #${assigningOrder.id} atribuído a ${courierName}.`);
  };

  const toggleStatusColumn = (st: string) => {
    setVisibleStatuses((prev) => {
      if (prev.includes(st)) {
        if (prev.length === 1) return prev;
        return prev.filter((s) => s !== st);
      }
      return columnDefs.map((c) => c.status).filter((s) => [...prev, st].includes(s));
    });
  };

  const cancelOrder = (order: OrderItem) => {
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
    setSelectedOrderId(null);
    showToast(`Pedido #${order.id} cancelado.`);
  };

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingOrder) return;
    const form = new FormData(e.currentTarget);
    const items = String(form.get("items") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const notes = String(form.get("notes") || "").trim();
    const payment = String(form.get("payment") || editingOrder.payment);
    const rawPrice = String(form.get("price") || editingOrder.price).trim();
    const price = rawPrice.startsWith("R$") ? rawPrice : "R$ " + rawPrice;

    if (items.length > 0) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === editingOrder.id ? { ...o, items, notes, payment, price } : o,
        ),
      );
      setEditingOrderId(null);
      showToast(`Pedido #${editingOrder.id} atualizado.`);
    }
  };

  const handleCreateManualOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const customer = String(form.get("customer") || "Cliente");
    const item = String(form.get("item") || "Pizza Personalizada");
    const rawPrice = String(form.get("price") || "50,00");
    const price = rawPrice.startsWith("R$") ? rawPrice : "R$ " + rawPrice;
    const payment = String(form.get("payment") || "Pix");
    const channel = String(form.get("channel") || "Balcão");
    const nextId = Math.max(...orders.map((o) => o.id), 1051) + 1;

    const newOrder: OrderItem = {
      id: nextId,
      customer,
      channel,
      items: [`1x ${item}`],
      payment,
      price,
      minutes: 0,
      status: "recebido",
      phone: "Não informado",
      address: channel === "Balcão" ? "Retirada no balcão" : "Paciência - RJ",
      neighborhood: "Paciência",
      notes: "Pedido criado manualmente no painel.",
      createdAt: "Agora",
    };

    setOrders((prev) => [newOrder, ...prev]);
    setModalNewOpen(false);
    showToast(`Pedido #${nextId} cadastrado.`);
  };

  return (
    <DashboardShell
      active="pedidos"
      role="Atendente"
      name="Camila Oliveira"
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: "Buscar por pedido, cliente, sabor, pagamento ou motoboy...",
      }}
    >
      {/* Cabeçalho da Central */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-500">
              Operação em tempo real
            </p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
              Operação ativa
            </span>
          </div>
          <h1 className="mt-1 text-[34px] font-extrabold tracking-[-0.035em] text-slate-950">
            Central de Pedidos
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Confirme, prepare, despache e acompanhe cada pizza sem sair desta tela.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setModalKanbanOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 shadow-sm hover:border-slate-300 transition"
          >
            <Settings2 className="h-4 w-4" /> Configurar Kanban
          </button>
          <button
            type="button"
            onClick={() => setModalNewOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" /> Criar pedido manual
          </button>
        </div>
      </div>

      {/* 4 Cards de Resumo */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        {[
          { icon: ShoppingBag, title: "Novos pedidos", count: counts.recebido, note: "Entraram agora", tone: "bg-emerald-50 text-emerald-600" },
          { icon: ChefHat, title: "No forno / preparo", count: counts.preparando, note: "Na cozinha", tone: "bg-orange-50 text-orange-600" },
          { icon: PackageCheck, title: "Prontos", count: counts.pronto, note: "Aguardando saída", tone: "bg-violet-50 text-violet-600" },
          { icon: Bike, title: "Em entrega", count: counts.entrega, note: "Com motoboy", tone: "bg-blue-50 text-blue-600" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <CardBox key={item.title} className="p-4">
              <div className="flex items-center gap-3">
                <div className={"grid h-11 w-11 place-items-center rounded-2xl " + item.tone}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">{item.title}</div>
                  <div className="mt-0.5 flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-slate-950">{item.count}</span>
                    <span className="text-[10px] font-semibold text-slate-400">{item.note}</span>
                  </div>
                </div>
              </div>
            </CardBox>
          );
        })}
      </div>

      {/* Aviso de busca */}
      {searchQuery.trim() && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
          <span>
            <strong>{filteredOrders.length}</strong> pedido(s) encontrado(s) para “{searchQuery}”.
          </span>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="font-extrabold hover:underline"
          >
            Limpar busca
          </button>
        </div>
      )}

      {/* Colunas do Kanban */}
      <div
        className="mt-4 grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${Math.max(activeColumns.length, 1)}, minmax(0, 1fr))`,
        }}
      >
        {activeColumns.map((col) => (
          <CardBox key={col.status} className="overflow-hidden">
            <div className="flex items-center border-b border-slate-100 px-4 py-3.5">
              <span className={"mr-2 h-2.5 w-2.5 rounded-full " + col.dot} />
              <h2 className="text-sm font-extrabold text-slate-900">{col.title}</h2>
              <span className="ml-1 text-xs font-bold text-slate-400">
                ({col.orders.length})
              </span>
              <span className="ml-auto text-[10px] font-bold text-slate-300">Mais antigos</span>
            </div>

            <div className="max-h-[620px] min-h-[470px] space-y-3 overflow-y-auto bg-slate-50/65 p-3">
              {col.orders.map((ord) => (
                <article
                  key={ord.id}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:border-slate-300"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">#{ord.id}</div>
                      <div className="mt-1 text-sm font-extrabold text-slate-900">
                        {ord.customer}
                      </div>
                    </div>
                    <div
                      className={
                        "text-[10px] font-extrabold " +
                        (ord.status === "entrega" ? "text-blue-500" : "text-red-500")
                      }
                    >
                      {ord.status === "entrega" ? "Saiu há " : "Há "}
                      {ord.minutes} min
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                    <Store className="h-3.5 w-3.5" /> {ord.channel}
                    {ord.courier && (
                      <span className="ml-auto font-bold text-blue-600">🛵 {ord.courier}</span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center text-xs">
                    <span className="inline-flex items-center gap-1.5 text-slate-500">
                      <CircleDollarSign className="h-3.5 w-3.5" />
                      {ord.payment}
                    </span>
                    <span className="ml-auto font-extrabold text-slate-900">{ord.price}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedOrderId(ord.id)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-extrabold text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <ReceiptText className="h-3.5 w-3.5" /> Ver detalhes
                  </button>

                  <button
                    type="button"
                    onClick={() => advanceStatus(ord)}
                    className={
                      "mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-extrabold transition " +
                      col.button
                    }
                  >
                    {ord.status === "recebido" || ord.status === "preparando" ? (
                      <Check className="h-4 w-4" />
                    ) : ord.status === "pronto" ? (
                      <Bike className="h-4 w-4" />
                    ) : (
                      <PackageCheck className="h-4 w-4" />
                    )}
                    {col.action}
                  </button>
                </article>
              ))}

              {col.orders.length === 0 && (
                <div className="grid min-h-36 place-items-center rounded-2xl border border-dashed border-slate-200 bg-white text-center text-xs font-semibold text-slate-400">
                  Nenhum pedido nesta etapa.
                </div>
              )}
            </div>
          </CardBox>
        ))}
      </div>

      {/* Linha Inferior: Motoboys Disponíveis e Produtos Esgotados */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* Motoboys */}
        <CardBox className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bike className="h-5 w-5 text-orange-500" />
              <h2 className="font-extrabold text-slate-900">Motoboys na escala</h2>
            </div>
            <span className="text-[10px] font-extrabold text-slate-400">Atualização visual</span>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {couriersList.map((c) => (
              <div key={c.name} className="flex items-center gap-3 py-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100">
                  <UserRound className="h-4 w-4 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold text-slate-900">{c.name}</div>
                  <div
                    className={
                      "mt-1 text-[10px] font-semibold " +
                      (c.tone === "green" ? "text-emerald-600" : "text-amber-600")
                    }
                  >
                    ● {c.status}
                  </div>
                </div>
                <div className="text-[10px] font-semibold text-slate-400">{c.deliveries}</div>
              </div>
            ))}
          </div>
        </CardBox>

        {/* Esgotados */}
        <CardBox className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              <h2 className="font-extrabold text-slate-900">Itens pausados / esgotados</h2>
            </div>
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-extrabold text-red-600">
              {soldOutItems.length} itens
            </span>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {soldOutItems.map((item) => (
              <div key={item} className="flex items-center gap-3 py-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 p-1">
                  <img
                    src="/logo_juca.png"
                    alt=""
                    className="h-8 w-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/logo.png";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold text-slate-900">{item}</div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    Indisponível para novos pedidos
                  </div>
                </div>
                <span className="rounded-full bg-red-50 px-2 py-1 text-[9px] font-extrabold text-red-600">
                  Pausado
                </span>
                <button
                  type="button"
                  onClick={() => setSoldOutItems((prev) => prev.filter((i) => i !== item))}
                  className="rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-extrabold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  Repor
                </button>
              </div>
            ))}
            {soldOutItems.length === 0 && (
              <div className="py-8 text-center text-xs font-semibold text-emerald-600">
                Todos os produtos estão disponíveis.
              </div>
            )}
          </div>
        </CardBox>
      </div>

      {/* Drawer Lateral de Detalhes do Pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[85] flex justify-end bg-slate-950/35 backdrop-blur-sm">
          <div className="h-full w-full max-w-[590px] overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                  <ReceiptText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-500">
                    Detalhes do pedido
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-900">#{selectedOrder.id}</h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold text-slate-500">
                      {columnDefs.find((c) => c.status === selectedOrder.status)?.title}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrderId(null)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-5 p-6">
              {/* Card Cliente */}
              <CardBox className="p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-amber-300 text-xs font-extrabold text-white">
                    {selectedOrder.customer
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-extrabold text-slate-900">
                      {selectedOrder.customer}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Phone className="h-3 w-3" />
                      {selectedOrder.phone ?? "Não informado"}
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold text-slate-500">
                    {selectedOrder.channel}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <MapPin className="h-3.5 w-3.5" /> Endereço
                    </div>
                    <div className="mt-2 text-xs font-extrabold leading-5 text-slate-900">
                      {selectedOrder.address ?? "Endereço não informado"}
                    </div>
                    <div className="mt-1 text-[10px] text-slate-400">
                      {selectedOrder.neighborhood ?? "Paciência - RJ"}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <Clock3 className="h-3.5 w-3.5" /> Entrada
                    </div>
                    <div className="mt-2 text-xs font-extrabold text-slate-900">
                      {selectedOrder.createdAt ?? "Agora"}
                    </div>
                    <div className="mt-1 text-[10px] text-slate-400">
                      Há {selectedOrder.minutes} min nesta etapa
                    </div>
                  </div>
                </div>
              </CardBox>

              {/* Card Itens */}
              <CardBox className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="h-5 w-5 text-orange-500" />
                    <h3 className="font-extrabold text-slate-900">Pizzas e adicionais</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingOrderId(selectedOrder.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-extrabold text-slate-600 hover:border-orange-200 hover:text-orange-600 transition"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </button>
                </div>
                <div className="mt-4 space-y-2">
                  {selectedOrder.items.map((it) => (
                    <div
                      key={it}
                      className="rounded-xl bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-700"
                    >
                      {it}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center border-t border-slate-100 pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <CircleDollarSign className="h-4 w-4" />
                    {selectedOrder.payment}
                  </span>
                  <span className="ml-auto text-lg font-extrabold text-slate-900">
                    {selectedOrder.price}
                  </span>
                </div>
              </CardBox>

              {/* Card Observações */}
              <CardBox className="p-5">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-orange-500" />
                  <h3 className="font-extrabold text-slate-900">Observações</h3>
                </div>
                <p className="mt-3 rounded-2xl bg-amber-50 p-4 text-xs font-semibold leading-6 text-amber-900">
                  {selectedOrder.notes || "Nenhuma observação neste pedido."}
                </p>
              </CardBox>

              {/* Linha do Tempo */}
              <CardBox className="p-5">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-5 w-5 text-orange-500" />
                  <h3 className="font-extrabold text-slate-900">Linha do tempo</h3>
                </div>
                <div className="mt-5 space-y-0">
                  {[
                    ["recebido", "Pedido recebido", "Entrou na central de pedidos"],
                    ["preparando", "No forno / preparo", "Pizza sendo montada e assada"],
                    ["pronto", "Pedido pronto", "Embalado aguardando saída"],
                    [
                      "entrega",
                      "Em rota de entrega",
                      selectedOrder.courier
                        ? `Com motoboy ${selectedOrder.courier}`
                        : "Aguardando motoboy",
                    ],
                  ].map(([stKey, title, desc], idx) => {
                    const stOrder = ["recebido", "preparando", "pronto", "entrega"];
                    const currentIdx = stOrder.indexOf(selectedOrder.status);
                    const isDone = idx <= currentIdx;
                    return (
                      <div key={stKey} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span
                            className={
                              "grid h-7 w-7 place-items-center rounded-full text-[10px] font-extrabold " +
                              (isDone ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400")
                            }
                          >
                            {isDone ? "✓" : idx + 1}
                          </span>
                          {idx < 3 && (
                            <span
                              className={
                                "h-9 w-px " +
                                (idx < currentIdx ? "bg-orange-300" : "bg-slate-200")
                              }
                            />
                          )}
                        </div>
                        <div className="pt-1">
                          <div
                            className={
                              "text-xs font-extrabold " +
                              (isDone ? "text-slate-900" : "text-slate-400")
                            }
                          >
                            {title}
                          </div>
                          <div className="mt-1 text-[10px] text-slate-400">{desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardBox>

              {/* Botões de Ação */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPrintingOrderId(selectedOrder.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-extrabold text-slate-700 hover:border-orange-200 transition"
                >
                  <Printer className="h-4 w-4" /> Comprovante
                </button>
                <button
                  type="button"
                  onClick={() => setEditingOrderId(selectedOrder.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-extrabold text-slate-700 hover:border-orange-200 transition"
                >
                  <Pencil className="h-4 w-4" /> Editar pedido
                </button>
              </div>

              <button
                type="button"
                onClick={() => cancelOrder(selectedOrder)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-extrabold text-rose-700 hover:bg-rose-100 transition"
              >
                <Trash2 className="h-4 w-4" /> Cancelar pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {editingOrder && (
        <div className="fixed inset-0 z-[105] grid place-items-center bg-slate-950/45 p-6 backdrop-blur-sm">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-500">
                  Editar pedido
                </div>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  #{editingOrder.id} • {editingOrder.customer}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingOrderId(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">
                  Itens — um por linha
                </span>
                <textarea
                  name="items"
                  rows={5}
                  defaultValue={editingOrder.items.join("\n")}
                  className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
              </label>

              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Observações</span>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={editingOrder.notes ?? ""}
                  className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-extrabold text-slate-700">Pagamento</span>
                  <select
                    name="payment"
                    defaultValue={editingOrder.payment}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-300"
                  >
                    <option>Pix</option>
                    <option>Cartão</option>
                    <option>Dinheiro</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-extrabold text-slate-700">Valor</span>
                  <input
                    name="price"
                    defaultValue={editingOrder.price}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setEditingOrderId(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-extrabold text-slate-600 hover:bg-slate-50 transition"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white hover:bg-orange-600 transition"
              >
                Salvar alterações
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de Comprovante Térmico para Impressão */}
      {printingOrder && (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/50 p-6 backdrop-blur-sm">
          <div className="w-full max-w-[410px] rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-500">
                  Comprovante para Impressão
                </div>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  Pedido #{printingOrder.id}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPrintingOrderId(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 font-mono text-[11px] leading-6 text-slate-700">
              <div className="text-center">
                <img
                  src="/logo_juca.png"
                  alt="Pizza do Juca"
                  className="mx-auto h-12 w-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/logo.png";
                  }}
                />
                <div className="mt-2 font-bold text-slate-900">PIZZA DO JUCA</div>
                <div className="text-[10px] text-slate-500">Paciência - Rio de Janeiro - RJ</div>
                <div className="text-[10px] text-slate-500">WhatsApp: (21) 97314-2264</div>
                <div className="mt-1 font-bold">
                  Pedido #{printingOrder.id} • {printingOrder.createdAt ?? "Hoje"}
                </div>
              </div>

              <div className="my-4 border-t border-dashed border-slate-300" />
              <div>
                <strong>Cliente:</strong> {printingOrder.customer}
              </div>
              <div>
                <strong>Telefone:</strong> {printingOrder.phone ?? "WhatsApp"}
              </div>
              <div>
                <strong>Canal:</strong> {printingOrder.channel}
              </div>
              <div>
                <strong>Endereço:</strong> {printingOrder.address ?? "Retirada no balcão"} (
                {printingOrder.neighborhood ?? "Paciência"})
              </div>
              <div>
                <strong>Pagamento:</strong> {printingOrder.payment}
              </div>

              <div className="my-4 border-t border-dashed border-slate-300" />
              <div className="font-bold mb-1">ITENS DO PEDIDO:</div>
              {printingOrder.items.map((it) => (
                <div key={it}>• {it}</div>
              ))}

              <div className="my-4 border-t border-dashed border-slate-300" />
              <div className="flex justify-between text-sm font-bold text-slate-900">
                <span>TOTAL A PAGAR</span>
                <span>{printingOrder.price}</span>
              </div>

              {printingOrder.notes && (
                <>
                  <div className="my-4 border-t border-dashed border-slate-300" />
                  <div>
                    <strong>Obs.:</strong> {printingOrder.notes}
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPrintingOrderId(null)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-extrabold text-slate-600 hover:bg-slate-50 transition"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  showToast("Janela de impressão acionada.");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-extrabold text-white hover:bg-slate-800 transition"
              >
                <Printer className="h-4 w-4" /> Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar Pedido Manual */}
      {modalNewOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/35 p-6 backdrop-blur-sm">
          <form
            onSubmit={handleCreateManualOrder}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                  Novo pedido manual
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Cadastre rapidamente um pedido feito no balcão, telefone ou WhatsApp.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalNewOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Cliente</span>
                <input
                  name="customer"
                  required
                  placeholder="Nome do cliente"
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
              </label>

              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Item principal</span>
                <input
                  name="item"
                  required
                  placeholder="Ex.: Pizza Calabresa Especial (Grande) + Coca-Cola 2L"
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-extrabold text-slate-700">Canal</span>
                  <select
                    name="channel"
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-300"
                  >
                    <option>Balcão</option>
                    <option>WhatsApp</option>
                    <option>Telefone</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-extrabold text-slate-700">Pagamento</span>
                  <select
                    name="payment"
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-300"
                  >
                    <option>Pix</option>
                    <option>Cartão</option>
                    <option>Dinheiro</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-extrabold text-slate-700">Valor</span>
                <input
                  name="price"
                  required
                  inputMode="decimal"
                  placeholder="58,00"
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
              </label>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setModalNewOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-extrabold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-extrabold text-white hover:bg-orange-600 transition"
              >
                Criar pedido
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Configurar Kanban */}
      {modalKanbanOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/35 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                  Configurar Kanban
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Escolha quais etapas quer visualizar. Pelo menos uma deve ficar ativa.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalKanbanOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-2">
              {columnDefs.map((col) => {
                const isVisible = visibleStatuses.includes(col.status);
                return (
                  <button
                    key={col.status}
                    type="button"
                    onClick={() => toggleStatusColumn(col.status)}
                    className={
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-bold transition " +
                      (isVisible
                        ? "border-orange-200 bg-orange-50 text-orange-700"
                        : "border-slate-200 bg-white text-slate-500")
                    }
                  >
                    <span className={"h-2.5 w-2.5 rounded-full " + col.dot} />
                    <span className="flex-1">{col.title}</span>
                    <span className="text-xs">{isVisible ? "Visível" : "Oculto"}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setModalKanbanOpen(false)}
              className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-extrabold text-white hover:bg-slate-800 transition"
            >
              Concluir
            </button>
          </div>
        </div>
      )}

      {/* Modal Atribuir Motoboy */}
      {assigningOrder && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/35 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                  Atribuir motoboy
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Pedido #{assigningOrder.id} • {assigningOrder.customer}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAssigningOrder(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-2">
              {couriersList.map((c) => {
                const isAvail = c.status === "Disponível";
                return (
                  <button
                    key={c.name}
                    type="button"
                    disabled={!isAvail}
                    onClick={() => handleAssignCourier(c.name)}
                    className={
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition " +
                      (isAvail
                        ? "border-slate-200 hover:border-blue-200 hover:bg-blue-50"
                        : "cursor-not-allowed border-slate-100 bg-slate-50 opacity-55")
                    }
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100">
                      <UserRound className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-extrabold text-slate-900">{c.name}</div>
                      <div
                        className={
                          "mt-1 text-[10px] font-semibold " +
                          (isAvail ? "text-emerald-600" : "text-amber-600")
                        }
                      >
                        ● {c.status}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">{c.deliveries}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[120] rounded-2xl bg-slate-950 px-4 py-3 text-xs font-extrabold text-white shadow-2xl animate-fade-in">
          {toastMessage}
        </div>
      )}
    </DashboardShell>
  );
}
