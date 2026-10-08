import React from "react";
import { Link } from "@tanstack/react-router";
import {
  TrendingUp,
  ShoppingCart,
  ReceiptText,
  Clock3,
  ArrowUpRight,
  CreditCard,
  WalletCards,
  Award,
} from "lucide-react";
import { DashboardShell, CardBox } from "./DashboardShell";

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  note: string;
  tone: string;
}

function MetricCard({ icon: Icon, label, value, note, tone }: MetricCardProps) {
  return (
    <CardBox className="p-5">
      <div className="flex items-start gap-4">
        <div className={"grid h-11 w-11 shrink-0 place-items-center rounded-2xl " + tone}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">{value}</p>
          <p className="mt-2 text-xs font-semibold text-emerald-600">{note}</p>
        </div>
      </div>
    </CardBox>
  );
}

const topProducts = [
  {
    name: "Pizza Calabresa Especial (Grande)",
    sales: "54 vendas",
    value: "R$ 2.430,00",
    image: "/combo-calabresa-guarana.webp",
  },
  {
    name: "Pizza Quatro Queijos (Grande)",
    sales: "46 vendas",
    value: "R$ 2.208,00",
    image: "/hero-pizza.webp",
  },
  {
    name: "Pizza Frango com Catupiry (Grande)",
    sales: "41 vendas",
    value: "R$ 1.968,00",
    image: "/fatia-calabresa-catupiry.webp",
  },
  {
    name: "Pizza Portuguesa Tradicional (Grande)",
    sales: "35 vendas",
    value: "R$ 1.680,00",
    image: "/hero-calabresa-catupiry.webp",
  },
  {
    name: "Coca-Cola 2 Litros",
    sales: "52 vendas",
    value: "R$ 676,00",
    image: "/logo_juca.png",
  },
];

const orderStatuses: [string, number, number, string][] = [
  ["Concluído", 36, 48, "bg-emerald-500"],
  ["Em entrega", 14, 19, "bg-blue-500"],
  ["Em preparo", 12, 16, "bg-amber-400"],
  ["Recebido", 8, 11, "bg-slate-400"],
  ["Cancelado", 4, 6, "bg-red-500"],
];

export function AdminDashboard() {
  return (
    <DashboardShell active="dashboard" role="Administrador" name="Juca Oliveira">
      {/* Título e Botão de Ação */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
              Visão do negócio
            </p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
              Painel ativo
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-950">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Acompanhe a operação e as vendas da Pizza do Juca em tempo real.
          </p>
        </div>
        <Link
          to="/painel/pedidos"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-600 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
        >
          Hoje • ver pedidos ao vivo
        </Link>
      </div>

      {/* 4 Cards de Métricas */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        <MetricCard
          icon={TrendingUp}
          label="Faturamento hoje"
          value="R$ 3.840,00"
          note="↑ 14% em relação a ontem"
          tone="bg-emerald-50 text-emerald-600"
        />
        <MetricCard
          icon={ShoppingCart}
          label="Pedidos hoje"
          value="74"
          note="↑ 18% em relação a ontem"
          tone="bg-blue-50 text-blue-600"
        />
        <MetricCard
          icon={ReceiptText}
          label="Ticket médio"
          value="R$ 51,89"
          note="↑ 8% em relação a ontem"
          tone="bg-violet-50 text-violet-600"
        />
        <MetricCard
          icon={Clock3}
          label="Pedidos em andamento"
          value="14"
          note="Em preparo e entrega"
          tone="bg-orange-50 text-orange-600"
        />
      </div>

      {/* Linha do Gráfico e Formas de Pagamento */}
      <div className="mt-4 grid grid-cols-[minmax(0,1.55fr)_minmax(310px,0.85fr)] gap-4">
        {/* Gráfico Semanal */}
        <CardBox className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <h2 className="font-extrabold text-slate-900">Faturamento da semana</h2>
              </div>
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-extrabold tracking-tight text-slate-950">
                  R$ 18.940,00
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  ↑ 26% na comparação com a semana anterior
                </span>
              </div>
            </div>
            <span className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500">
              Últimos 7 dias • Paciência - RJ
            </span>
          </div>

          <div className="mt-7 overflow-hidden rounded-2xl bg-gradient-to-b from-orange-50/70 to-transparent px-2 pt-3">
            <svg
              viewBox="0 0 700 240"
              className="h-[240px] w-full"
              role="img"
              aria-label="Gráfico de faturamento semanal da Pizza do Juca"
            >
              {[40, 90, 140, 190].map((y) => (
                <line
                  key={y}
                  x1="20"
                  y1={y}
                  x2="680"
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              ))}
              <defs>
                <linearGradient id="admin-chart-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fb923c" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M35,185 C90,170 115,145 145,148 C190,151 215,112 250,110 C300,107 320,143 355,136 C410,125 430,95 475,90 C530,84 555,58 610,56 C640,54 660,40 675,32 L675,220 L35,220 Z"
                fill="url(#admin-chart-fill)"
              />
              <path
                d="M35,185 C90,170 115,145 145,148 C190,151 215,112 250,110 C300,107 320,143 355,136 C410,125 430,95 475,90 C530,84 555,58 610,56 C640,54 660,40 675,32"
                fill="none"
                stroke="#f97316"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {[
                ["35", "185"],
                ["145", "148"],
                ["250", "110"],
                ["355", "136"],
                ["475", "90"],
                ["610", "56"],
                ["675", "32"],
              ].map(([cx, cy]) => (
                <circle
                  key={cx}
                  cx={cx}
                  cy={cy}
                  r="5.5"
                  fill="#fff"
                  stroke="#f97316"
                  strokeWidth="3"
                />
              ))}
            </svg>
            <div className="-mt-2 grid grid-cols-7 pb-3 text-center text-[11px] font-semibold text-slate-400">
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </CardBox>

        {/* Formas de Pagamento */}
        <CardBox className="p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <WalletCards className="h-5 w-5 text-orange-500" />
            <h2 className="font-extrabold text-slate-900">Formas de pagamento</h2>
          </div>

          <div className="mt-7 grid place-items-center">
            <div
              className="relative grid h-44 w-44 place-items-center rounded-full"
              style={{
                background:
                  "conic-gradient(#22c55e 0 54%, #3b82f6 54% 86%, #f59e0b 86% 100%)",
              }}
            >
              <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center shadow-inner">
                <div>
                  <div className="text-base font-extrabold text-slate-950">
                    R$ 3.840,00
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">total hoje</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            {[
              ["Pix", "54%", "R$ 2.073,60", "bg-emerald-500"],
              ["Cartão", "32%", "R$ 1.228,80", "bg-blue-500"],
              ["Dinheiro", "14%", "R$ 537,60", "bg-amber-400"],
            ].map(([method, pct, val, dotBg]) => (
              <div
                key={method}
                className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-0"
              >
                <span className={"h-2.5 w-2.5 rounded-full " + dotBg} />
                <span className="font-semibold text-slate-700">{method}</span>
                <span className="ml-auto text-xs font-bold text-slate-400">{pct}</span>
                <span className="w-24 text-right text-xs font-bold text-slate-700">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </CardBox>
      </div>

      {/* Linha Inferior: Produtos Mais Vendidos e Status dos Pedidos */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* Produtos Mais Vendidos */}
        <CardBox className="p-5">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-orange-500" />
            <h2 className="font-extrabold text-slate-900">Pizzas mais vendidas</h2>
          </div>
          <div className="mt-4 space-y-3">
            {topProducts.map((prod, idx) => (
              <div
                key={prod.name}
                className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-amber-50 text-[11px] font-extrabold text-amber-600">
                  {idx + 1}
                </span>
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="h-10 w-10 rounded-xl bg-orange-50 object-cover border border-slate-100"
                  onError={(e) => {
                    e.currentTarget.src = "/logo_juca.png";
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold text-slate-900">{prod.name}</div>
                  <div className="mt-0.5 text-[10px] text-slate-400">{prod.sales}</div>
                </div>
                <div className="text-xs font-extrabold text-slate-900">{prod.value}</div>
              </div>
            ))}
          </div>
        </CardBox>

        {/* Status dos Pedidos */}
        <CardBox className="p-5">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-500" />
            <h2 className="font-extrabold text-slate-900">Status dos pedidos</h2>
          </div>
          <div className="mt-5 space-y-5">
            {orderStatuses.map(([statusName, count, pct, barBg]) => (
              <div key={statusName}>
                <div className="mb-2 flex items-center text-xs">
                  <span className="font-semibold text-slate-700">{statusName}</span>
                  <span className="ml-auto font-extrabold text-slate-900">{count}</span>
                  <span className="ml-3 w-8 text-right text-[10px] text-slate-400">
                    {pct}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={"h-full rounded-full " + barBg}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/painel/pedidos"
            className="mt-6 flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700 transition"
          >
            Acessar Kanban de pedidos <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </CardBox>
      </div>
    </DashboardShell>
  );
}
