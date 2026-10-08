import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bike,
  ChartColumn,
  Check,
  CircleCheck,
  Clock3,
  MapPin,
  MessageCircleMore,
  Navigation,
  PackageCheck,
  Phone,
  Route,
  TrendingUp,
  UserRound,
  WalletCards,
  X,
  Home,
  Bell,
  ArrowRight,
} from "lucide-react";
import { usePersistedState } from "./usePersistedState";

export interface CourierOrder {
  id: number;
  store: string;
  customer: string;
  phone: string;
  address: string;
  neighborhood: string;
  distance: string;
  fee: string;
  payment: string;
  minutes: number;
  image: string;
  items: string[];
  notes?: string;
  stage?: "retirada" | "a_caminho" | "cheguei";
  deliveredAt?: string;
}

const defaultAvailable: CourierOrder[] = [
  {
    id: 1048,
    store: "Pizza do Juca",
    customer: "João Silva",
    phone: "(21) 99142-7730",
    address: "Rua das Flores, 123",
    neighborhood: "Paciência",
    distance: "1,8 km",
    fee: "R$ 7,50",
    payment: "Pix",
    minutes: 12,
    image: "/combo-calabresa-guarana.webp",
    items: ["1x Pizza Calabresa Especial (Grande)", "1x Coca-Cola 2L"],
    notes: "Sem cebola. Portão cinza ao lado do mercado.",
  },
  {
    id: 1049,
    store: "Pizza do Juca",
    customer: "Mariana Costa",
    phone: "(21) 98821-4452",
    address: "Estrada do Mendanha, 840",
    neighborhood: "Campo Grande",
    distance: "3,4 km",
    fee: "R$ 9,00",
    payment: "Cartão",
    minutes: 15,
    image: "/hero-pizza.webp",
    items: ["1x Pizza Frango c/ Catupiry (Grande)", "1x Borda Catupiry"],
    notes: "Interfone 204.",
  },
  {
    id: 1050,
    store: "Pizza do Juca",
    customer: "Carlos Ribeiro",
    phone: "(21) 98044-5012",
    address: "Rua Pioneiros, 789",
    neighborhood: "Paciência",
    distance: "2,2 km",
    fee: "R$ 7,00",
    payment: "Dinheiro",
    minutes: 10,
    image: "/fatia-calabresa-catupiry.webp",
    items: ["1x Pizza Quatro Queijos (Média)", "1x Guaraná 2L"],
    notes: "Troco para R$ 50.",
  },
];

const defaultActive: CourierOrder[] = [
  {
    id: 1045,
    store: "Pizza do Juca",
    customer: "Ana Paula",
    phone: "(21) 97420-1188",
    address: "Rua Silva Cardoso, 91",
    neighborhood: "Santa Cruz",
    distance: "2,6 km",
    fee: "R$ 8,00",
    payment: "Pix",
    minutes: 8,
    image: "/hero-calabresa-catupiry.webp",
    items: ["1x Pizza Portuguesa Tradicional (Grande)", "1x Coca-Cola 2L"],
    notes: "Casa com portão branco e muro alto.",
    stage: "a_caminho",
  },
];

const defaultHistory: CourierOrder[] = [
  {
    id: 1038,
    store: "Pizza do Juca",
    customer: "Rafael Gomes",
    phone: "(21) 98001-2291",
    address: "Rua Limites, 44",
    neighborhood: "Realengo",
    distance: "3,1 km",
    fee: "R$ 9,50",
    payment: "Pix",
    minutes: 14,
    image: "/combo-calabresa-guarana.webp",
    items: ["1x Pizza Dois Queijos (Grande)"],
    deliveredAt: "21:14",
  },
  {
    id: 1036,
    store: "Pizza do Juca",
    customer: "Bianca Santos",
    phone: "(21) 99731-3302",
    address: "Av. Brasil, 4120",
    neighborhood: "Bangu",
    distance: "4,0 km",
    fee: "R$ 10,00",
    payment: "Cartão",
    minutes: 18,
    image: "/hero-pizza.webp",
    items: ["1x Pizza Calabresa (Grande)", "1x Guaravita"],
    deliveredAt: "20:42",
  },
  {
    id: 1032,
    store: "Pizza do Juca",
    customer: "Pedro Henrique",
    phone: "(21) 97570-9011",
    address: "Rua Oliveira Braga, 77",
    neighborhood: "Campo Grande",
    distance: "1,8 km",
    fee: "R$ 7,50",
    payment: "Dinheiro",
    minutes: 11,
    image: "/fatia-calabresa-catupiry.webp",
    items: ["1x Pizza Frango Crocante (Grande)"],
    deliveredAt: "19:58",
  },
  {
    id: 1029,
    store: "Pizza do Juca",
    customer: "Larissa Melo",
    phone: "(21) 98111-4020",
    address: "Rua Amaral Costa, 210",
    neighborhood: "Santa Cruz",
    distance: "2,7 km",
    fee: "R$ 8,50",
    payment: "Pix",
    minutes: 16,
    image: "/hero-calabresa-catupiry.webp",
    items: ["1x Pizza Especial do Juca (Gigante 45cm)", "1x Coca-Cola 2L"],
    deliveredAt: "19:31",
  },
];

const stageConfig = {
  retirada: {
    label: "Retirar na loja",
    button: "Pedido retirado",
    next: "Confirme que pegou a pizza quente no balcão.",
  },
  a_caminho: {
    label: "A caminho",
    button: "Cheguei no endereço",
    next: "Siga a rota segura e confirme quando chegar.",
  },
  cheguei: {
    label: "No endereço",
    button: "Confirmar entrega",
    next: "Entregue a pizza ao cliente e finalize.",
  },
};

export function CourierApp() {
  const [isOnline, setIsOnline] = usePersistedState<boolean>(
    "bora-courier-online",
    true,
  );
  const [currentTab, setCurrentTab] = useState<"available" | "active" | "history">(
    "available",
  );
  const [availableList, setAvailableList] = usePersistedState<CourierOrder[]>(
    "bora-courier-available",
    defaultAvailable,
  );
  const [activeList, setActiveList] = usePersistedState<CourierOrder[]>(
    "bora-courier-active",
    defaultActive,
  );
  const [historyList, setHistoryList] = usePersistedState<CourierOrder[]>(
    "bora-courier-history",
    defaultHistory,
  );

  const [detailsOrderId, setDetailsOrderId] = useState<number | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const selectedOrder = useMemo(
    () =>
      activeList.find((o) => o.id === detailsOrderId) ??
      availableList.find((o) => o.id === detailsOrderId) ??
      historyList.find((o) => o.id === detailsOrderId) ??
      null,
    [activeList, availableList, historyList, detailsOrderId],
  );

  const totalEarnings = useMemo(() => {
    return [...historyList, ...activeList]
      .map((o) =>
        Number(
          o.fee.replace("R$", "").replace(".", "").replace(",", ".").trim(),
        ),
      )
      .reduce((acc, curr) => acc + curr, 0);
  }, [historyList, activeList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(""), 2200);
  };

  const handleAcceptDelivery = (order: CourierOrder) => {
    if (!isOnline) {
      showToast("Fique online para aceitar entregas.");
      return;
    }
    setAvailableList((prev) => prev.filter((o) => o.id !== order.id));
    setActiveList((prev) => [...prev, { ...order, stage: "retirada" }]);
    setDetailsOrderId(order.id);
    setCurrentTab("active");
    showToast(`Entrega #${order.id} aceita.`);
  };

  const handleAdvanceDelivery = (order: CourierOrder) => {
    const currentStage = order.stage ?? "retirada";
    if (currentStage === "retirada") {
      setActiveList((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, stage: "a_caminho", minutes: 0 } : o)),
      );
      showToast("Pedido retirado. Boa rota!");
      return;
    }
    if (currentStage === "a_caminho") {
      setActiveList((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, stage: "cheguei", minutes: 0 } : o)),
      );
      showToast("Chegada registrada no endereço.");
      return;
    }
    // Concluir entrega
    const completed: CourierOrder = {
      ...order,
      stage: "cheguei",
      deliveredAt: "Agora",
    };
    setActiveList((prev) => prev.filter((o) => o.id !== order.id));
    setHistoryList((prev) => [completed, ...prev]);
    setDetailsOrderId(null);
    setCurrentTab("history");
    showToast(`Entrega #${order.id} concluída com sucesso!`);
  };

  return (
    <div className="min-h-screen bg-[#edf0f5] py-0 text-slate-950 sm:py-6 font-sans antialiased">
      <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#f7f8fb] shadow-[0_24px_80px_-30px_rgba(15,23,42,.32)] sm:min-h-[calc(100vh-48px)] sm:rounded-[30px] flex flex-col justify-between">
        <div className="px-4 pb-4 pt-4">
          {/* Topo do App Mobile */}
          <div className="flex items-center">
            <Link to="/painel" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-sm border border-slate-200/80 p-0.5">
                <img
                  src="/logo_juca.png"
                  alt="Pizza do Juca"
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/logo.png";
                  }}
                />
              </div>
              <span className="text-xs font-extrabold text-slate-900">Pizza do Juca</span>
            </Link>

            {/* Notificações */}
            <div className="relative ml-auto">
              <button
                type="button"
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
                aria-label="Notificações"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white">
                  2
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-11 z-50 w-[290px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <div className="text-xs font-extrabold text-slate-900">Notificações</div>
                    <div className="mt-1 text-[10px] text-slate-400">
                      Atualizações de entregas
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTab("available");
                      setNotificationsOpen(false);
                    }}
                    className="flex w-full gap-3 px-4 py-3 text-left hover:bg-slate-50"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                    <span>
                      <span className="block text-[11px] font-extrabold text-slate-900">
                        {availableList.length} entregas disponíveis
                      </span>
                      <span className="mt-1 block text-[9px] leading-4 text-slate-400">
                        Novas pizzas quentes para entregar.
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTab("active");
                      setNotificationsOpen(false);
                    }}
                    className="flex w-full gap-3 border-t border-slate-100 px-4 py-3 text-left hover:bg-slate-50"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    <span>
                      <span className="block text-[11px] font-extrabold text-slate-900">
                        {activeList.length > 0
                          ? `Entrega #${activeList[0].id} em andamento`
                          : "Nenhuma entrega ativa"}
                      </span>
                      <span className="mt-1 block text-[9px] leading-4 text-slate-400">
                        Rota em Paciência e adjacências.
                      </span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cartão do Motoboy & Toggle Online */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-slate-800 to-slate-600 text-white shadow"
            >
              <UserRound className="h-6 w-6" />
              <span
                className={
                  "absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#f7f8fb] " +
                  (isOnline ? "bg-emerald-500" : "bg-slate-400")
                }
              />
            </button>
            <div>
              <div className="text-base font-extrabold text-slate-900">Lucas Mendes</div>
              <button
                type="button"
                onClick={() => setProfileOpen(true)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Motoboy • ver perfil
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsOnline((prev) => !prev)}
              className={
                "ml-auto inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-extrabold transition " +
                (isOnline
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-500")
              }
            >
              <span
                className={
                  "h-2.5 w-2.5 rounded-full " +
                  (isOnline ? "bg-emerald-500" : "bg-slate-400")
                }
              />
              {isOnline ? "Online" : "Offline"}
            </button>
          </div>

          {/* Título */}
          <div className="mt-6">
            <h1 className="text-[30px] font-extrabold tracking-[-0.035em] text-slate-950">
              Minhas Entregas
            </h1>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Aceite pedidos de pizza, navegue até o cliente e acompanhe seus ganhos do dia.
            </p>
          </div>

          {/* 3 Métricas Rápidas */}
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[
              {
                icon: WalletCards,
                label: "Disponíveis",
                val: String(availableList.length),
                tone: "bg-orange-50 text-orange-600",
              },
              {
                icon: Bike,
                label: "Em rota",
                val: String(activeList.length),
                tone: "bg-blue-50 text-blue-600",
              },
              {
                icon: CircleCheck,
                label: "Concluídas",
                val: String(historyList.length),
                tone: "bg-emerald-50 text-emerald-600",
              },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm"
                >
                  <div
                    className={
                      "grid h-9 w-9 place-items-center rounded-xl " + m.tone
                    }
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="mt-3 text-[10px] font-semibold text-slate-500">
                    {m.label}
                  </div>
                  <div className="mt-0.5 text-lg font-extrabold text-slate-900">{m.val}</div>
                </div>
              );
            })}
          </div>

          {/* Card Ganhos de Hoje & Mapa Ilustrativo */}
          <div className="mt-3 grid grid-cols-[1fr_1.08fr] gap-2.5">
            <button
              id="ganhos-motoboy"
              type="button"
              onClick={() => setCurrentTab("history")}
              className="rounded-2xl border border-slate-200/70 bg-white p-4 text-left shadow-sm hover:border-slate-300 transition"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600">
                <ChartColumn className="h-5 w-5" />
              </div>
              <div className="mt-3 text-[10px] font-semibold text-slate-500">Ganhos de hoje</div>
              <div className="mt-1 text-xl font-extrabold text-slate-900">
                {totalEarnings.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
              <div className="mt-1 text-[10px] font-extrabold text-emerald-600">
                ↑ 18% vs. ontem
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentTab("active");
                if (activeList[0]) setDetailsOrderId(activeList[0].id);
              }}
              className="relative min-h-[148px] overflow-hidden rounded-2xl border border-slate-200/70 bg-white text-left shadow-sm"
            >
              <div className="absolute inset-0 bg-[#eef2f7]">
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    backgroundImage:
                      "linear-gradient(35deg, transparent 47%, #cbd5e1 48%, #cbd5e1 51%, transparent 52%), linear-gradient(125deg, transparent 47%, #dbe2ea 48%, #dbe2ea 51%, transparent 52%)",
                    backgroundSize: "55px 55px",
                  }}
                />
              </div>
              <svg viewBox="0 0 280 160" className="absolute inset-0 h-full w-full">
                <path
                  d="M25 120 C75 35, 115 135, 165 88 S220 100, 260 45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute left-4 top-[88px] grid h-8 w-8 place-items-center overflow-hidden rounded-full border-2 border-white bg-orange-500 shadow">
                <img
                  src="/logo_juca.png"
                  alt=""
                  className="h-full w-full bg-white object-contain p-1"
                  onError={(e) => {
                    e.currentTarget.src = "/logo.png";
                  }}
                />
              </div>
              <div className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-red-500 text-white shadow">
                <Home className="h-4 w-4" />
              </div>
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-[10px] font-extrabold text-slate-700 shadow">
                Abrir rota <ArrowRight className="h-3 w-3" />
              </span>
            </button>
          </div>

          {/* Entrega Atual Banner */}
          {activeList[0] && (
            <button
              type="button"
              onClick={() => {
                setCurrentTab("active");
                setDetailsOrderId(activeList[0].id);
              }}
              className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-3 text-left"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500 text-white">
                <Route className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-blue-500">
                  Entrega atual
                </div>
                <div className="mt-1 truncate text-xs font-extrabold text-slate-900">
                  #{activeList[0].id} • {activeList[0].customer}
                </div>
                <div className="mt-1 text-[10px] text-blue-700">
                  {stageConfig[activeList[0].stage ?? "retirada"].next}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-blue-500" />
            </button>
          )}

          {/* Abas [Disponíveis, Em andamento, Histórico] */}
          <div className="mt-5 grid grid-cols-3 rounded-2xl bg-slate-200/60 p-1">
            {[
              { id: "available" as const, label: "Disponíveis", count: availableList.length },
              { id: "active" as const, label: "Em andamento", count: activeList.length },
              { id: "history" as const, label: "Histórico", count: historyList.length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentTab(tab.id)}
                className={
                  "rounded-xl px-2 py-3 text-[10px] font-extrabold transition " +
                  (currentTab === tab.id
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-slate-500")
                }
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Conteúdo da Aba: Disponíveis */}
          {currentTab === "available" && (
            <div className="mt-3 space-y-3">
              {availableList.map((ord) => (
                <article
                  key={ord.id}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setDetailsOrderId(ord.id)}
                    className="w-full text-left"
                  >
                    <div className="flex gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-orange-50 border border-slate-100">
                        <img
                          src={ord.image}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/logo_juca.png";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900">#{ord.id}</span>
                          <span className="rounded-full bg-orange-50 px-2 py-1 text-[8px] font-extrabold text-orange-600">
                            Novo
                          </span>
                        </div>
                        <div className="mt-1 text-xs font-extrabold text-slate-900">
                          {ord.customer}
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                          <MapPin className="h-3 w-3" />
                          {ord.neighborhood} • {ord.distance}
                        </div>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 text-slate-300" />
                    </div>
                  </button>

                  <div className="mt-3 flex items-center rounded-xl bg-slate-50 p-3">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">{ord.fee}</div>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                        <WalletCards className="h-3 w-3" />
                        {ord.payment}
                      </div>
                    </div>
                    <div className="ml-5 flex items-center gap-1.5 text-[10px] text-slate-500">
                      <Clock3 className="h-3 w-3" />~ {ord.minutes} min
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAcceptDelivery(ord)}
                      className="ml-auto rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition"
                    >
                      Aceitar
                    </button>
                  </div>
                </article>
              ))}

              {availableList.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs font-semibold text-slate-400">
                  Nenhuma entrega disponível agora.
                </div>
              )}
            </div>
          )}

          {/* Conteúdo da Aba: Em andamento */}
          {currentTab === "active" && (
            <div className="mt-3 space-y-3">
              {activeList.map((ord) => {
                const stage = ord.stage ?? "retirada";
                return (
                  <article
                    key={ord.id}
                    className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setDetailsOrderId(ord.id)}
                      className="w-full text-left"
                    >
                      <div className="flex gap-3">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-blue-50 border border-slate-100">
                          <img
                            src={ord.image}
                            alt=""
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/logo_juca.png";
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-900">
                              #{ord.id}
                            </span>
                            <span className="rounded-full bg-blue-50 px-2 py-1 text-[8px] font-extrabold text-blue-600">
                              {stageConfig[stage].label}
                            </span>
                          </div>
                          <div className="mt-1 text-xs font-extrabold text-slate-900">
                            {ord.customer}
                          </div>
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                            <MapPin className="h-3 w-3" />
                            {ord.address}
                          </div>
                        </div>
                        <ArrowRight className="mt-1 h-4 w-4 text-slate-300" />
                      </div>
                    </button>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <a
                        href={
                          "https://www.google.com/maps/search/?api=1&query=" +
                          encodeURIComponent(ord.address + ", " + ord.neighborhood + ", Rio de Janeiro")
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-3 text-[11px] font-extrabold text-blue-600 hover:bg-blue-100 transition"
                      >
                        <Navigation className="h-4 w-4" /> Abrir rota
                      </a>
                      <button
                        type="button"
                        onClick={() => handleAdvanceDelivery(ord)}
                        className="rounded-xl bg-orange-500 px-3 py-3 text-[11px] font-extrabold text-white hover:bg-orange-600 transition"
                      >
                        {stageConfig[stage].button}
                      </button>
                    </div>
                  </article>
                );
              })}

              {activeList.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs font-semibold text-slate-400">
                  Você não tem entregas em andamento.
                </div>
              )}
            </div>
          )}

          {/* Conteúdo da Aba: Histórico */}
          {currentTab === "history" && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CircleCheck className="h-4 w-4" />
                  </div>
                  <div className="mt-3 text-[10px] font-semibold text-slate-500">
                    Entregues hoje
                  </div>
                  <div className="mt-1 text-xl font-extrabold text-slate-900">
                    {historyList.length}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600">
                    <WalletCards className="h-4 w-4" />
                  </div>
                  <div className="mt-3 text-[10px] font-semibold text-slate-500">
                    Ganhos registrados
                  </div>
                  <div className="mt-1 text-xl font-extrabold text-slate-900">
                    {totalEarnings.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                </div>
              </div>

              {/* Resumo do Turno */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <div className="text-xs font-extrabold text-slate-900">Resumo do turno</div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-base font-extrabold text-slate-900">2,4 km</div>
                    <div className="mt-1 text-[9px] text-slate-400">média/rota</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-base font-extrabold text-slate-900">15 min</div>
                    <div className="mt-1 text-[9px] text-slate-400">tempo médio</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-base font-extrabold text-slate-900">4,9</div>
                    <div className="mt-1 text-[9px] text-slate-400">avaliação</div>
                  </div>
                </div>
              </div>

              {historyList.map((ord) => (
                <button
                  key={ord.id}
                  type="button"
                  onClick={() => setDetailsOrderId(ord.id)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-sm hover:border-slate-300 transition"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Check className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-extrabold text-slate-900">
                      #{ord.id} • {ord.customer}
                    </div>
                    <div className="mt-1 truncate text-[10px] text-slate-400">
                      {ord.neighborhood} • entregue {ord.deliveredAt}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-slate-900">{ord.fee}</div>
                    <div className="mt-1 text-[9px] text-emerald-600 font-bold">Concluída</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Barra de Navegação Inferior Fixa */}
        <nav className="sticky bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur-xl">
          <div className="grid grid-cols-4">
            {[
              {
                icon: Home,
                label: "Início",
                action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
                active: false,
              },
              {
                icon: Bike,
                label: "Entregas",
                action: () => setCurrentTab("active"),
                active: currentTab === "active" || currentTab === "available",
              },
              {
                icon: ChartColumn,
                label: "Ganhos",
                action: () => setCurrentTab("history"),
                active: currentTab === "history",
              },
              {
                icon: UserRound,
                label: "Perfil",
                action: () => setProfileOpen(true),
                active: profileOpen,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={tab.action}
                  className={
                    "flex flex-col items-center gap-1 rounded-xl py-2 text-[9px] font-extrabold " +
                    (tab.active ? "bg-orange-50 text-orange-600" : "text-slate-500")
                  }
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Modal / Bottom Sheet de Detalhes da Entrega */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div className="max-h-[92vh] w-full max-w-[430px] overflow-y-auto rounded-t-[30px] bg-white p-5 shadow-2xl sm:rounded-[30px]">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-200 sm:hidden" />
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                <Bike className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-orange-500">
                  Entrega #{selectedOrder.id}
                </div>
                <div className="mt-1 text-lg font-extrabold text-slate-900">
                  {selectedOrder.customer}
                </div>
                <div className="mt-1 text-[10px] text-slate-400">
                  {selectedOrder.neighborhood} • {selectedOrder.distance}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailsOrderId(null)}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Endereço & Contato */}
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                <div>
                  <div className="text-xs font-extrabold text-slate-900">
                    {selectedOrder.address}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    {selectedOrder.neighborhood}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${selectedOrder.phone.replace(/\D/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-[10px] font-extrabold text-slate-700 shadow-sm"
                >
                  <Phone className="h-3.5 w-3.5" /> Ligar
                </a>
                <a
                  href={`https://wa.me/55${selectedOrder.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-2.5 text-[10px] font-extrabold text-white"
                >
                  <MessageCircleMore className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </div>
            </div>

            {/* Pedido & Itens */}
            <div className="mt-4 rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-2">
                <PackageCheck className="h-4 w-4 text-orange-500" />
                <div className="text-xs font-extrabold text-slate-900">Itens do pedido</div>
              </div>
              <div className="mt-3 space-y-2">
                {selectedOrder.items.map((it) => (
                  <div
                    key={it}
                    className="rounded-xl bg-slate-50 px-3 py-2.5 text-[10px] font-semibold text-slate-600"
                  >
                    {it}
                  </div>
                ))}
              </div>
              {selectedOrder.notes && (
                <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2.5 text-[10px] font-semibold leading-5 text-amber-800">
                  Obs.: {selectedOrder.notes}
                </div>
              )}
            </div>

            {/* 3 Caixinhas de Info */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <WalletCards className="mx-auto h-4 w-4 text-slate-400" />
                <div className="mt-2 text-[9px] text-slate-400">Pagamento</div>
                <div className="mt-1 text-[10px] font-extrabold text-slate-900">
                  {selectedOrder.payment}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <Clock3 className="mx-auto h-4 w-4 text-slate-400" />
                <div className="mt-2 text-[9px] text-slate-400">Estimativa</div>
                <div className="mt-1 text-[10px] font-extrabold text-slate-900">
                  ~ {selectedOrder.minutes} min
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <CircleCheck className="mx-auto h-4 w-4 text-slate-400" />
                <div className="mt-2 text-[9px] text-slate-400">Ganho</div>
                <div className="mt-1 text-[10px] font-extrabold text-slate-900">
                  {selectedOrder.fee}
                </div>
              </div>
            </div>

            {/* Etapas da Entrega Se Ativa */}
            {activeList.some((o) => o.id === selectedOrder.id) && (
              <>
                <div className="mt-5">
                  <div className="text-xs font-extrabold text-slate-900">Etapas da rota</div>
                  <div className="mt-4 flex items-start">
                    {(["retirada", "a_caminho", "cheguei"] as const).map((st, idx) => {
                      const curStage = selectedOrder.stage ?? "retirada";
                      const stages = ["retirada", "a_caminho", "cheguei"];
                      const curIdx = stages.indexOf(curStage);
                      const isDone = idx <= curIdx;
                      return (
                        <div
                          key={st}
                          className="flex flex-1 items-start last:flex-none"
                        >
                          <div className="text-center">
                            <span
                              className={
                                "mx-auto grid h-8 w-8 place-items-center rounded-full text-[10px] font-extrabold " +
                                (isDone
                                  ? "bg-orange-500 text-white"
                                  : "bg-slate-100 text-slate-400")
                              }
                            >
                              {isDone ? "✓" : idx + 1}
                            </span>
                            <div className="mt-2 max-w-[82px] text-[9px] font-bold text-slate-500">
                              {stageConfig[st].label}
                            </div>
                          </div>
                          {idx < 2 && (
                            <div
                              className={
                                "mt-4 h-0.5 flex-1 " +
                                (idx < curIdx ? "bg-orange-300" : "bg-slate-200")
                              }
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <a
                  href={
                    "https://www.google.com/maps/search/?api=1&query=" +
                    encodeURIComponent(selectedOrder.address + ", " + selectedOrder.neighborhood)
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-xs font-extrabold text-blue-600 hover:bg-blue-100 transition"
                >
                  <Navigation className="h-4 w-4" /> Abrir rota no mapa
                </a>

                <button
                  type="button"
                  onClick={() => handleAdvanceDelivery(selectedOrder)}
                  className="mt-2 w-full rounded-xl bg-orange-500 px-4 py-3 text-xs font-extrabold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition"
                >
                  {stageConfig[selectedOrder.stage ?? "retirada"].button}
                </button>
              </>
            )}

            {availableList.some((o) => o.id === selectedOrder.id) && (
              <button
                type="button"
                onClick={() => handleAcceptDelivery(selectedOrder)}
                className="mt-5 w-full rounded-xl bg-orange-500 px-4 py-3 text-xs font-extrabold text-white hover:bg-orange-600 transition"
              >
                Aceitar esta entrega
              </button>
            )}

            {historyList.some((o) => o.id === selectedOrder.id) && (
              <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-extrabold text-emerald-700">
                <CircleCheck className="h-4 w-4" /> Entrega concluída
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal / Perfil do Motoboy */}
      {profileOpen && (
        <div className="fixed inset-0 z-[85] flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div className="w-full max-w-[430px] rounded-t-[30px] bg-white p-5 shadow-2xl sm:rounded-[30px]">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-200 sm:hidden" />
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-orange-500">
                  Meu perfil
                </div>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900">Lucas Mendes</h2>
              </div>
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-slate-50 p-3 text-center">
                <div className="text-lg font-extrabold text-slate-900">{historyList.length}</div>
                <div className="mt-1 text-[9px] text-slate-400">entregas hoje</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 text-center">
                <div className="text-lg font-extrabold text-slate-900">4,9</div>
                <div className="mt-1 text-[9px] text-slate-400">avaliação</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 text-center">
                <div className="text-lg font-extrabold text-slate-900">96%</div>
                <div className="mt-1 text-[9px] text-slate-400">conclusão</div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <Bike className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Honda CG 160 Fan</div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    Moto cadastrada • RJK-2A44
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-100 p-4">
              <div className="text-xs font-extrabold text-slate-900">Turno de hoje</div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                <span>Início</span>
                <span className="font-extrabold text-slate-800">19:00</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                <span>Tempo online</span>
                <span className="font-extrabold text-slate-800">3h 42min</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOnline((prev) => !prev);
                setProfileOpen(false);
              }}
              className={
                "mt-5 w-full rounded-xl px-4 py-3 text-xs font-extrabold transition " +
                (isOnline
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  : "bg-emerald-500 text-white hover:bg-emerald-600")
              }
            >
              {isOnline ? "Ficar offline" : "Ficar online"}
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2.5 text-[10px] font-extrabold text-white shadow-2xl animate-fade-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
