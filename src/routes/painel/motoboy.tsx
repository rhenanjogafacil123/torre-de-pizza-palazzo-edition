import { createFileRoute } from "@tanstack/react-router";
import { CourierApp } from "@/components/painel/CourierApp";

export const Route = createFileRoute("/painel/motoboy")({
  head: () => ({
    meta: [
      { title: "Área do Entregador | Pizza do Juca" },
      { name: "description", content: "Aplicativo mobile para motoboys da Pizza do Juca." },
    ],
  }),
  component: CourierApp,
});
