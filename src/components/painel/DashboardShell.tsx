import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Boxes,
  Tag,
  Bike,
  ContactRound,
  Users,
  CircleDollarSign,
  ChartNoAxesCombined,
  Settings,
  Search,
  Bell,
  ArrowRight,
  MonitorSmartphone,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  to?: string;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Visão geral",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/painel/admin" },
      { id: "pedidos", label: "Pedidos", icon: ClipboardList, to: "/painel/pedidos", badge: "10" },
    ],
  },
  {
    label: "Operação",
    items: [
      { id: "produtos", label: "Pizzas & Itens", icon: Package, to: "/painel/admin" },
      { id: "categorias", label: "Categorias", icon: Boxes, to: "/painel/admin" },
      { id: "promocoes", label: "Promoções", icon: Tag, to: "/painel/admin" },
      { id: "motoboy", label: "Motoboys", icon: Bike, to: "/painel/motoboy" },
      { id: "clientes", label: "Clientes", icon: ContactRound, to: "/painel/admin" },
      { id: "atendentes", label: "Atendentes", icon: Users, to: "/painel/pedidos" },
    ],
  },
  {
    label: "Gestão",
    items: [
      { id: "financeiro", label: "Financeiro", icon: CircleDollarSign, to: "/painel/admin" },
      { id: "relatorios", label: "Relatórios", icon: ChartNoAxesCombined, to: "/painel/admin" },
      { id: "configuracoes", label: "Configurações", icon: Settings, to: "/painel" },
    ],
  },
];

export function CardBox({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={
        "rounded-2xl border border-slate-200/75 bg-white shadow-[0_18px_48px_-36px_rgba(15,23,42,0.30)] " +
        className
      }
    >
      {children}
    </section>
  );
}

function MobileWarning() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f5f7fb] px-5 xl:hidden">
      <div className="max-w-sm rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-[0_24px_80px_-50px_rgba(15,23,42,.55)]">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-orange-50 text-orange-600">
          <MonitorSmartphone className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950">
          Painel feito para computador
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          A administração e a central de pedidos usam bastante informação ao mesmo tempo. Abra em uma tela
          desktop com pelo menos 1280px para manter tudo legível.
        </p>
        <Link
          to="/painel"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          Voltar para os painéis <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

interface DashboardShellProps {
  children: React.ReactNode;
  active: string;
  role: string;
  name: string;
  search?: {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
  };
}

export function DashboardShell({
  children,
  active,
  role,
  name,
  search,
}: DashboardShellProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
      <MobileWarning />

      <div className="hidden min-h-screen bg-[#f4f6fa] text-slate-950 xl:block font-sans antialiased">
        {/* Barra Lateral Fixa */}
        <aside className="fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-slate-200/80 bg-white px-4 py-5">
          <Link to="/painel" className="mb-7 flex items-center gap-3 px-2">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 p-1 overflow-hidden border border-orange-100 shadow-sm">
              <img
                src="/logo_juca.png"
                alt="Pizza do Juca"
                className="h-9 w-9 object-contain"
                onError={(e) => {
                  // Fallback se logo_juca falhar
                  const target = e.currentTarget;
                  target.src = "/logo.png";
                }}
              />
            </div>
            <div className="leading-none">
              <div className="text-[16px] font-extrabold tracking-tight text-slate-950">
                Pizza do Juca
              </div>
              <div className="mt-1.5 text-[9px] font-extrabold uppercase tracking-[0.18em] text-orange-500">
                Painel de gestão
              </div>
            </div>
          </Link>

          {/* Navegação */}
          <div className="space-y-6 overflow-y-auto pr-1">
            {navGroups.map((group) => (
              <div key={group.label}>
                <div className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                  {group.label}
                </div>
                <nav className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === active;
                    return item.to ? (
                      <Link
                        key={item.id}
                        to={item.to}
                        className={
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition" +
                          (isActive
                            ? " bg-orange-50 text-orange-600 font-bold"
                            : " text-slate-600 hover:bg-slate-50 hover:text-slate-950")
                        }
                      >
                        <Icon className="h-[17px] w-[17px]" strokeWidth={2} />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ) : (
                      <button
                        key={item.id}
                        type="button"
                        disabled
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition cursor-not-allowed text-slate-400"
                      >
                        <Icon className="h-[17px] w-[17px]" strokeWidth={2} />
                        <span className="flex-1">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Card Rodapé Sidebar */}
          <div className="mt-auto rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-orange-600">
              Pizza do Juca
            </div>
            <div className="mt-2 text-xs leading-5 text-slate-500">
              Operação em Paciência - RJ. Atendimento, delivery e balcão ativos.
            </div>
            <Link
              to="/"
              className="mt-3 inline-flex items-center text-xs font-extrabold text-slate-800 hover:text-orange-600"
            >
              Ver cardápio <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <div className="pl-[248px]">
          {/* Header Superior */}
          <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/92 backdrop-blur-xl">
            <div className="flex h-[70px] items-center gap-4 px-6 xl:px-8">
              {search ? (
                <div className="relative max-w-[620px] flex-1">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    aria-label="Buscar no painel"
                    value={search.value}
                    onChange={(e) => search.onChange(e.target.value)}
                    placeholder={search.placeholder ?? "Buscar pedidos, clientes, produtos..."}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Operação interna • Pizza do Juca • Paciência - RJ
                </div>
              )}

              {/* Ações Topo Direito */}
              <div className="ml-auto flex items-center gap-3">
                {/* Notificações */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen((prev) => !prev)}
                    className="relative rounded-xl border border-transparent p-2.5 text-slate-500 transition hover:border-slate-200 hover:bg-slate-50"
                    aria-label="Notificações"
                    aria-expanded={notificationsOpen}
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white">
                      3
                    </span>
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 top-13 z-50 w-[330px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <div>
                          <div className="text-xs font-extrabold text-slate-900">Notificações</div>
                          <div className="mt-0.5 text-[10px] text-slate-400">
                            3 itens precisam de atenção
                          </div>
                        </div>
                        <span className="rounded-full bg-orange-50 px-2 py-1 text-[9px] font-extrabold text-orange-600">
                          Agora
                        </span>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {[
                          [
                            "Pedido #1053",
                            "Novo pedido de Pizza Calabresa recebido há 1 minuto.",
                            "bg-emerald-500",
                            "/painel/pedidos",
                          ],
                          [
                            "Item pausado",
                            "Borda de Catupiry está marcada como indisponível.",
                            "bg-amber-400",
                            "/painel/pedidos",
                          ],
                          [
                            "Entrega em rota",
                            "Pedido #1043 em entrega para Paciência há 18 minutos.",
                            "bg-red-500",
                            "/painel/motoboy",
                          ],
                        ].map(([title, desc, dotClass, linkTarget]) => (
                          <Link
                            key={title}
                            to={linkTarget}
                            onClick={() => setNotificationsOpen(false)}
                            className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                          >
                            <span className={"mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full " + dotClass} />
                            <span>
                              <span className="block text-xs font-extrabold text-slate-800">
                                {title}
                              </span>
                              <span className="mt-1 block text-[10px] leading-4 text-slate-400">
                                {desc}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                      <Link
                        to="/painel/pedidos"
                        onClick={() => setNotificationsOpen(false)}
                        className="flex items-center justify-center border-t border-slate-100 px-4 py-3 text-[10px] font-extrabold text-orange-600 hover:bg-orange-50 transition"
                      >
                        Abrir central de pedidos
                      </Link>
                    </div>
                  )}
                </div>

                {/* Badge Perfil Usuário */}
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-xs font-extrabold text-white">
                    {name
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")}
                  </div>
                  <div className="min-w-[112px] text-left">
                    <div className="text-xs font-extrabold text-slate-900">{name}</div>
                    <div className="text-[10px] text-slate-400">{role}</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Conteúdo Dinâmico */}
          <main className="mx-auto w-full max-w-[1680px] p-6 2xl:p-8">{children}</main>
        </div>
      </div>
    </>
  );
}
