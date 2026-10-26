import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICE_TYPES } from "@/lib/pricing";
import { leadsQuery } from "@/lib/admin-data";

export function ScheduleDialog({ open, onOpenChange, leadId }: { open: boolean; onOpenChange: (o: boolean) => void; leadId?: string }) {
  const qc = useQueryClient();
  const { data: leads = [] } = useQuery(leadsQuery);
  const [form, setForm] = useState({ lead_id: "", scheduled_date: "", scheduled_time: "09:00", service_type: SERVICE_TYPES[0] as string });

  useEffect(() => {
    if (open) setForm((f) => ({ ...f, lead_id: leadId ?? "", scheduled_date: new Date().toISOString().slice(0, 10) }));
  }, [open, leadId]);

  const save = useMutation({
    mutationFn: async () => {
      if (!form.lead_id || !form.scheduled_date) throw new Error("Selecione cliente e data.");
      const { error } = await supabase.from("preventive_schedules").insert(form);
      if (error) throw error;
      const lead = leads.find((l) => l.id === form.lead_id);
      if (lead && (lead.status === "Novo Lead" || lead.status === "Em Contato")) {
        await supabase.from("leads").update({ status: "Visita Agendada" }).eq("id", lead.id);
      }
    },
    onSuccess: () => {
      toast.success("Visita agendada!");
      qc.invalidateQueries({ queryKey: ["schedules"] });
      qc.invalidateQueries({ queryKey: ["leads"] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Agendar visita técnica</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label>Cliente</Label>
            <Select value={form.lead_id} onValueChange={(v) => setForm({ ...form, lead_id: v })}>
              <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
              <SelectContent>{leads.map((l) => <SelectItem key={l.id} value={l.id}>{l.company_name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Data</Label><Input type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Horário</Label><Input type="time" value={form.scheduled_time} onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5">
            <Label>Tipo de serviço</Label>
            <Select value={form.service_type} onValueChange={(v) => setForm({ ...form, service_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SERVICE_TYPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>Agendar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
