import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { settingsQuery } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/configuracoes")({
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const { data = [] } = useQuery(settingsQuery);
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setNumber(data.find((s) => s.key === "whatsapp_number")?.value ?? "");
    setMessage(data.find((s) => s.key === "whatsapp_default_message")?.value ?? "");
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const n = number.replace(/\D/g, "");
      if (n.length < 12 || n.length > 13) throw new Error("Use o formato DDI + DDD + número, ex.: 5531999999999");
      if (!message.trim() || message.length > 1000) throw new Error("Mensagem deve ter entre 1 e 1000 caracteres");
      const { error } = await supabase.from("system_settings").upsert(
        [
          { key: "whatsapp_number", value: n, updated_at: new Date().toISOString() },
          { key: "whatsapp_default_message", value: message.trim(), updated_at: new Date().toISOString() },
        ],
        { onConflict: "key" },
      );
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Configurações salvas!"); qc.invalidateQueries({ queryKey: ["settings"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Configurações</h1>
        <p className="text-muted-foreground">Ajustes do atendimento via WhatsApp no simulador.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp de atendimento</CardTitle>
          <CardDescription>Número que recebe as simulações enviadas pelo site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Número (com DDI e DDD)</Label>
            <Input value={number} inputMode="numeric" placeholder="5531999999999" onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 13))} />
          </div>
          <div className="space-y-1.5">
            <Label>Mensagem padrão da simulação</Label>
            <Textarea rows={4} maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} />
            <p className="text-xs text-muted-foreground">Os dados da simulação são adicionados automaticamente ao final.</p>
          </div>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>Salvar configurações</Button>
        </CardContent>
      </Card>
    </div>
  );
}
