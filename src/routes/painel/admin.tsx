import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/painel/AdminDashboard";

export const Route = createFileRoute("/painel/admin")({
  head: () => ({
    meta: [
      { title: "Dashboard Administrativo | Pizza do Juca" },
      { name: "description", content: "Visão executiva do negócio da Pizza do Juca." },
    ],
  }),
  component: AdminDashboard,
});
