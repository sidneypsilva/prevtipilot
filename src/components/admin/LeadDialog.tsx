import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BUSINESS_TYPES, LEAD_STATUSES, calculateTotal, maskPhone, suggestPlan } from "@/lib/pricing";
import type { Lead } from "@/lib/admin-data";

const schema = z.object({
  company_name: z.string().trim().min(1, "Informe a empresa").max(150),
  contact_name: z.string().trim().min(1, "Informe o contato").max(120),
  whatsapp: z.string().refine((v) => v.replace(/\D/g, "").length >= 10, "WhatsApp inválido"),
  email: z.string().trim().max(255).email("E-mail inválido").or(z.literal("")),
  technical_notes: z.string().max(5000),
});

const empty = {
  company_name: "", contact_name: "", whatsapp: "", email: "", business_type: BUSINESS_TYPES[0] as string,
  pc_count: 5, has_server: false, has_cloud_backup: false, status: "Novo Lead", technical_notes: "",
};

export function LeadDialog({ open, onOpenChange, lead }: { open: boolean; onOpenChange: (o: boolean) => void; lead?: Lead | null }) {
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (!open) return;
    setForm(lead ? {
      company_name: lead.company_name, contact_name: lead.contact_name, whatsapp: maskPhone(lead.whatsapp),
      email: lead.email ?? "", business_type: lead.business_type ?? BUSINESS_TYPES[0], pc_count: lead.pc_count ?? 5,
      has_server: !!lead.has_server, has_cloud_backup: !!lead.has_cloud_backup, status: lead.status, technical_notes: lead.technical_notes ?? "",
    } : empty);
  }, [open, lead]);

  const save = useMutation({
    mutationFn: async () => {
      const p = schema.safeParse(form);
      if (!p.success) throw new Error(p.error.issues[0].message);
      const input = { pcCount: form.pc_count, hasServer: form.has_server, hasCloudBackup: form.has_cloud_backup };
      const row = {
        ...form,
        email: form.email || null,
        technical_notes: form.technical_notes || null,
        suggested_plan: suggestPlan(input),
        estimated_value: calculateTotal(input),
      };
      const { error } = lead
        ? await supabase.from("leads").update(row).eq("id", lead.id)
        : await supabase.from("leads").insert(row);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(lead ? "Lead atualizado!" : "Lead criado!");
      qc.invalidateQueries({ queryKey: ["leads"] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader><DialogTitle>{lead ? "Editar lead" : "Novo lead"}</DialogTitle></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <F l="Empresa *"><Input value={form.company_name} onChange={(e) => set("company_name", e.target.value)} /></F>
          <F l="Contato *"><Input value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} /></F>
          <F l="WhatsApp *"><Input value={form.whatsapp} onChange={(e) => set("whatsapp", maskPhone(e.target.value))} /></F>
          <F l="E-mail"><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></F>
          <F l="Segmento">
            <Select value={form.business_type} onValueChange={(v) => set("business_type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{BUSINESS_TYPES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>
          </F>
          <F l="Status">
            <Select value={form.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{LEAD_STATUSES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>
          </F>
          <F l="Computadores"><Input type="number" min={1} max={30} value={form.pc_count} onChange={(e) => set("pc_count", Math.max(1, Math.min(30, Number(e.target.value) || 1)))} /></F>
          <div className="flex items-end gap-6 pb-2">
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.has_server} onCheckedChange={(v) => set("has_server", v)} /> Servidor/NAS</label>
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.has_cloud_backup} onCheckedChange={(v) => set("has_cloud_backup", v)} /> Backup nuvem</label>
          </div>
          <div className="sm:col-span-2"><F l="Notas técnicas"><Textarea rows={4} value={form.technical_notes} onChange={(e) => set("technical_notes", e.target.value)} /></F></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function F({ l, children }: { l: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{l}</Label>{children}</div>;
}
