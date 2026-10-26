import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, Check, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScheduleDialog } from "@/components/admin/ScheduleDialog";
import { SCHEDULE_STATUSES } from "@/lib/pricing";
import { formatDate, schedulesQuery } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/agenda")({
  component: AgendaPage,
});

const sClass: Record<string, string> = {
  Pendente: "bg-warning/15 text-foreground",
  "Concluído": "bg-success/15 text-success",
  Cancelado: "bg-destructive/10 text-destructive",
};

function AgendaPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery(schedulesQuery);
  const [filter, setFilter] = useState("Pendente");
  const [open, setOpen] = useState(false);

  const groups = useMemo(() => {
    const m = new Map<string, typeof data>();
    data.filter((s) => filter === "all" || s.status === filter).forEach((s) => {
      m.set(s.scheduled_date, [...(m.get(s.scheduled_date) ?? []), s]);
    });
    return [...m.entries()];
  }, [data, filter]);

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("preventive_schedules").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, v) => { toast.success(v.status === "Concluído" ? "Visita concluída!" : "Visita atualizada"); qc.invalidateQueries({ queryKey: ["schedules"] }); },
    onError: () => toast.error("Erro ao atualizar visita"),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Agenda Preventiva</h1>
          <p className="text-muted-foreground">Visitas técnicas agrupadas por data.</p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">Todos</SelectItem>{SCHEDULE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Button onClick={() => setOpen(true)}><Plus className="mr-1 h-4 w-4" />Novo agendamento</Button>
        </div>
      </div>
      {isLoading && <p className="text-muted-foreground">Carregando...</p>}
      {!isLoading && groups.length === 0 && (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhuma visita encontrada.</CardContent></Card>
      )}
      {groups.map(([date, items]) => (
        <Card key={date}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><CalendarDays className="h-4 w-4 text-primary" />{formatDate(date)}</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {items.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-4">
                  <span className="font-display text-lg font-semibold text-primary">{s.scheduled_time}</span>
                  <div>
                    <p className="font-medium">{s.leads?.company_name}</p>
                    <p className="text-sm text-muted-foreground">{s.service_type} · {s.leads?.contact_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn("border-0", sClass[s.status])}>{s.status}</Badge>
                  {s.status === "Pendente" && (
                    <>
                      <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => setStatus.mutate({ id: s.id, status: "Concluído" })}><Check className="mr-1 h-4 w-4" />Concluir</Button>
                      <Button size="sm" variant="ghost" onClick={() => setStatus.mutate({ id: s.id, status: "Cancelado" })}><X className="h-4 w-4" /></Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      <ScheduleDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
