import { createFileRoute } from "@tanstack/react-router";
import { PanelHub } from "@/components/painel/PanelHub";

export const Route = createFileRoute("/painel/")({
  head: () => ({
    meta: [
      { title: "Painel de Gestão | Pizza do Juca" },
      { name: "description", content: "Área interna de gestão da Pizza do Juca." },
    ],
  }),
  component: PanelHub,
});
