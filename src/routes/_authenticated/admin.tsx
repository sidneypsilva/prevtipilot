import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { isAdminQuery } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel — PrevTI" },
      { name: "description", content: "Painel administrativo PrevTI." },
      { property: "og:title", content: "Painel — PrevTI" },
      { property: "og:description", content: "Painel administrativo PrevTI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/leads", label: "Clientes & Leads", icon: Users },
  { to: "/admin/agenda", label: "Agenda Preventiva", icon: CalendarClock },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
] as const;

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: isAdmin, isLoading } = useQuery(isAdminQuery(user.id));

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <aside className="flex flex-col bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:h-screen md:w-64">
        <div className="p-5"><Logo light /></div>
        <nav className="flex gap-1 overflow-x-auto px-3 md:flex-1 md:flex-col">
          {links.map(({ to, label, icon: I, ...rest }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: "exact" in rest }}
              className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{ className: "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary" }}
            >
              <I className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <p className="truncate px-3 pb-2 text-xs text-sidebar-foreground/50">{user.email}</p>
          <Button variant="ghost" onClick={signOut} className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">
        {isLoading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : isAdmin ? (
          <Outlet />
        ) : (
          <div className="mx-auto mt-20 max-w-md text-center">
            <h1 className="text-2xl font-bold">Acesso pendente</h1>
            <p className="mt-2 text-muted-foreground">Sua conta ainda não tem permissão de administrador. Peça ao administrador responsável para liberar seu acesso.</p>
          </div>
        )}
      </main>
    </div>
  );
}
