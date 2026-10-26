import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowUpDown, CalendarPlus, Kanban, List, MessageCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LeadDialog } from "@/components/admin/LeadDialog";
import { ScheduleDialog } from "@/components/admin/ScheduleDialog";
import { BUSINESS_TYPES, LEAD_STATUSES, formatBRL, toWaNumber, waLink } from "@/lib/pricing";
import { leadsQuery, type Lead } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: LeadsPage,
});

const statusClass: Record<string, string> = {
  "Novo Lead": "bg-primary/10 text-primary",
  "Em Contato": "bg-warning/15 text-foreground",
  "Visita Agendada": "bg-accent text-accent-foreground",
  "Contrato Ativo": "bg-success/15 text-success",
  "Perdido": "bg-destructive/10 text-destructive",
};

const PAGE = 10;
type SortKey = "created_at" | "company_name" | "estimated_value";

function LeadsPage() {
  const qc = useQueryClient();
  const { data: leads = [], isLoading } = useQuery(leadsQuery);
  const [view, setView] = useState("table");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [segment, setSegment] = useState("all");
  const [sort, setSort] = useState<{ k: SortKey; asc: boolean }>({ k: "created_at", asc: false });
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [dialog, setDialog] = useState(false);
  const [toDelete, setToDelete] = useState<Lead | null>(null);
  const [scheduleFor, setScheduleFor] = useState<string | undefined>();
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return leads
      .filter((l) => (status === "all" || l.status === status) && (segment === "all" || l.business_type === segment))
      .filter((l) => !t || [l.company_name, l.contact_name, l.email, l.whatsapp].some((v) => v?.toLowerCase().includes(t)))
      .sort((a, b) => {
        const av = a[sort.k] ?? "", bv = b[sort.k] ?? "";
        const r = sort.k === "estimated_value" ? Number(av) - Number(bv) : String(av).localeCompare(String(bv));
        return sort.asc ? r : -r;
      });
  }, [leads, q, status, segment, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const rows = filtered.slice(page * PAGE, page * PAGE + PAGE);

  const updateStatus = useMutation({
    mutationFn: async ({ id, s }: { id: string; s: string }) => {
      const { error } = await supabase.from("leads").update({ status: s }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
    onError: () => toast.error("Erro ao atualizar status"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Lead excluído"); qc.invalidateQueries({ queryKey: ["leads"] }); qc.invalidateQueries({ queryKey: ["schedules"] }); setToDelete(null); },
    onError: () => toast.error("Erro ao excluir"),
  });

  const toggleSort = (k: SortKey) => setSort((s) => ({ k, asc: s.k === k ? !s.asc : true }));
  const openWa = (l: Lead) => window.open(waLink(toWaNumber(l.whatsapp), `Olá ${l.contact_name}, aqui é da PrevTI!`), "_blank");
  const schedule = (l: Lead) => { setScheduleFor(l.id); setScheduleOpen(true); };

  const Actions = ({ l }: { l: Lead }) => (
    <div className="flex gap-1">
      <Button size="icon" variant="ghost" title="WhatsApp" onClick={() => openWa(l)}><MessageCircle className="h-4 w-4 text-success" /></Button>
      <Button size="icon" variant="ghost" title="Agendar visita" onClick={() => schedule(l)}><CalendarPlus className="h-4 w-4 text-primary" /></Button>
      <Button size="icon" variant="ghost" title="Editar" onClick={() => { setEditing(l); setDialog(true); }}><Pencil className="h-4 w-4" /></Button>
      <Button size="icon" variant="ghost" title="Excluir" onClick={() => setToDelete(l)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Clientes & Leads</h1>
          <p className="text-muted-foreground">{leads.length} registros</p>
        </div>
        <div className="flex gap-2">
          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="table"><List className="mr-1 h-4 w-4" />Tabela</TabsTrigger>
              <TabsTrigger value="kanban"><Kanban className="mr-1 h-4 w-4" />Funil</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => { setEditing(null); setDialog(true); }}><Plus className="mr-1 h-4 w-4" />Novo lead</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input placeholder="Buscar por empresa, contato, e-mail..." value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} className="max-w-sm" />
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Todos os status</SelectItem>{LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={segment} onValueChange={(v) => { setSegment(v); setPage(0); }}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Todos os segmentos</SelectItem>{BUSINESS_TYPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {view === "table" ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><button className="flex items-center gap-1" onClick={() => toggleSort("company_name")}>Empresa <ArrowUpDown className="h-3 w-3" /></button></TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Segmento</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead><button className="flex items-center gap-1" onClick={() => toggleSort("estimated_value")}>Valor <ArrowUpDown className="h-3 w-3" /></button></TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><button className="flex items-center gap-1" onClick={() => toggleSort("created_at")}>Criado <ArrowUpDown className="h-3 w-3" /></button></TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">Carregando...</TableCell></TableRow>}
                {!isLoading && rows.length === 0 && <TableRow><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">Nenhum lead encontrado.</TableCell></TableRow>}
                {rows.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.company_name}</TableCell>
                    <TableCell><div>{l.contact_name}</div><div className="text-xs text-muted-foreground">{l.whatsapp}</div></TableCell>
                    <TableCell className="text-sm">{l.business_type}</TableCell>
                    <TableCell>{l.suggested_plan}</TableCell>
                    <TableCell>{formatBRL(Number(l.estimated_value ?? 0))}</TableCell>
                    <TableCell><Badge className={cn("border-0", statusClass[l.status])}>{l.status}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{l.created_at ? new Date(l.created_at).toLocaleDateString("pt-BR") : ""}</TableCell>
                    <TableCell><Actions l={l} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between border-t border-border p-3 text-sm">
              <span className="text-muted-foreground">Página {page + 1} de {pages}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
                <Button size="sm" variant="outline" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}>Próxima</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 overflow-x-auto pb-2 md:grid-cols-5">
          {LEAD_STATUSES.map((s) => {
            const col = filtered.filter((l) => l.status === s);
            return (
              <div
                key={s}
                className="min-w-60 rounded-xl border border-border bg-muted/50 p-3"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { const id = e.dataTransfer.getData("id"); if (id) updateStatus.mutate({ id, s }); }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <Badge className={cn("border-0", statusClass[s])}>{s}</Badge>
                  <span className="text-xs text-muted-foreground">{col.length}</span>
                </div>
                <div className="space-y-2">
                  {col.map((l) => (
                    <Card key={l.id} draggable onDragStart={(e) => e.dataTransfer.setData("id", l.id)} className="cursor-grab active:cursor-grabbing">
                      <CardContent className="space-y-2 p-3">
                        <p className="font-medium leading-tight">{l.company_name}</p>
                        <p className="text-xs text-muted-foreground">{l.contact_name} · {l.pc_count} PCs</p>
                        <p className="text-sm font-semibold text-primary">{formatBRL(Number(l.estimated_value ?? 0))}/mês</p>
                        <Select value={l.status} onValueChange={(v) => updateStatus.mutate({ id: l.id, s: v })}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>{LEAD_STATUSES.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
                        </Select>
                        <Actions l={l} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <LeadDialog open={dialog} onOpenChange={setDialog} lead={editing} />
      <ScheduleDialog open={scheduleOpen} onOpenChange={setScheduleOpen} leadId={scheduleFor} />
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {toDelete?.company_name}?</AlertDialogTitle>
            <AlertDialogDescription>O lead e todas as visitas vinculadas serão removidos permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => toDelete && del.mutate(toDelete.id)}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
