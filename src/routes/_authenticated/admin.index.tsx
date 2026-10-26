import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarClock, DollarSign, FileSignature, UserPlus, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/pricing";
import { formatDate, leadsQuery, schedulesQuery } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: leads = [] } = useQuery(leadsQuery);
  const { data: schedules = [] } = useQuery(schedulesQuery);
  const today = new Date().toISOString().slice(0, 10);
  const active = leads.filter((l) => l.status === "Contrato Ativo");
  const mrr = active.reduce((s, l) => s + Number(l.estimated_value ?? 0), 0);
  const upcoming = schedules.filter((s) => s.status === "Pendente" && s.scheduled_date >= today).slice(0, 6);

  const metrics = [
    { label: "Total de Leads", value: leads.length, icon: Users },
    { label: "Novos Contatos", value: leads.filter((l) => l.status === "Novo Lead").length, icon: UserPlus },
    { label: "Contratos Ativos", value: active.length, icon: FileSignature },
    { label: "MRR Estimado", value: formatBRL(mrr), icon: DollarSign },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da operação PrevTI.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: I }) => (
          <Card key={label}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 font-display text-3xl font-bold">{value}</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-accent text-primary"><I className="h-5 w-5" /></span>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><CalendarClock className="h-5 w-5 text-primary" /> Próximas visitas técnicas</CardTitle>
          <Button asChild variant="outline" size="sm"><Link to="/admin/agenda">Ver agenda</Link></Button>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma visita pendente agendada.</p>
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="font-medium">{s.leads?.company_name}</p>
                    <p className="text-sm text-muted-foreground">{s.service_type}</p>
                  </div>
                  <Badge variant="secondary">{formatDate(s.scheduled_date)} {s.scheduled_time}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
