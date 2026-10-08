import { createFileRoute } from "@tanstack/react-router";
import { OrdersBoard } from "@/components/painel/OrdersBoard";

export const Route = createFileRoute("/painel/pedidos")({
  head: () => ({
    meta: [
      { title: "Central de Pedidos (Kanban) | Pizza do Juca" },
      { name: "description", content: "Operação em tempo real e controle de pedidos da Pizza do Juca." },
    ],
  }),
  component: OrdersBoard,
});
