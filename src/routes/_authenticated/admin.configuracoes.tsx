import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bell, CheckCircle2, Circle, Globe, Mail, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { settingsQuery } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/configuracoes")({
  component: SettingsPage,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SettingsPage() {
  const qc = useQueryClient();
  const { data = [] } = useQuery(settingsQuery);
  const get = (k: string) => data.find((s) => s.key === k)?.value ?? "";

  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [alertEmail, setAlertEmail] = useState("");
  const [alertsOn, setAlertsOn] = useState(false);
  const [clientCopy, setClientCopy] = useState(false);
  const [senderName, setSenderName] = useState("");

  useEffect(() => {
    setNumber(get("whatsapp_number"));
    setMessage(get("whatsapp_default_message"));
    setAlertEmail(get("admin_alert_email"));
    setAlertsOn(get("email_alerts_enabled") === "true");
    setClientCopy(get("email_client_copy_enabled") === "true");
    setSenderName(get("email_sender_name") || "PrevTI - TI Preventiva");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const upsert = async (rows: { key: string; value: string }[]) => {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("system_settings")
      .upsert(rows.map((r) => ({ ...r, updated_at: now })), { onConflict: "key" });
    if (error) throw error;
  };

  const onDone = () => {
    toast.success("Configurações salvas!");
    qc.invalidateQueries({ queryKey: ["settings"] });
  };

  const saveWa = useMutation({
    mutationFn: async () => {
      const n = number.replace(/\D/g, "");
      if (n.length < 12 || n.length > 13) throw new Error("Use o formato DDI + DDD + número, ex.: 5531999999999");
      if (!message.trim() || message.length > 1000) throw new Error("Mensagem deve ter entre 1 e 1000 caracteres");
      await upsert([
        { key: "whatsapp_number", value: n },
        { key: "whatsapp_default_message", value: message.trim() },
      ]);
    },
    onSuccess: onDone,
    onError: (e: Error) => toast.error(e.message),
  });

  const saveEmail = useMutation({
    mutationFn: async () => {
      const e = alertEmail.trim();
      if (alertsOn && !EMAIL_RE.test(e)) throw new Error("Informe um e-mail válido para receber os avisos");
      if (e && !EMAIL_RE.test(e)) throw new Error("E-mail inválido");
      if (!senderName.trim() || senderName.length > 80) throw new Error("Nome do remetente deve ter entre 1 e 80 caracteres");
      await upsert([
        { key: "admin_alert_email", value: e },
        { key: "email_alerts_enabled", value: String(alertsOn) },
        { key: "email_client_copy_enabled", value: String(clientCopy) },
        { key: "email_sender_name", value: senderName.trim() },
      ]);
    },
    onSuccess: onDone,
    onError: (e: Error) => toast.error(e.message),
  });

  const steps = [
    { done: !!get("admin_alert_email"), label: "E-mail para receber avisos cadastrado" },
    { done: true, label: "Campo de e-mail no simulador do site" },
    { done: false, label: "Domínio próprio conectado (ex.: prevti.com.br)" },
    { done: false, label: "Envio automático de e-mails ligado" },
  ];
  const progress = steps.filter((s) => s.done).length;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Configurações</h1>
        <p className="text-muted-foreground">Atendimento pelo WhatsApp e avisos de novos contatos.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5 text-success" /> WhatsApp de atendimento</CardTitle>
          <CardDescription>Número que recebe as simulações enviadas pelo site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="wa-number">Número (com DDI e DDD)</Label>
            <Input id="wa-number" value={number} inputMode="numeric" placeholder="5531999999999" onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 13))} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wa-msg">Mensagem padrão da simulação</Label>
            <Textarea id="wa-msg" rows={4} maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} />
            <p className="text-xs text-muted-foreground">Os dados da simulação são adicionados automaticamente ao final.</p>
          </div>
          <Button onClick={() => saveWa.mutate()} disabled={saveWa.isPending}>Salvar WhatsApp</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Notificações por e-mail</CardTitle>
            <Badge variant="secondary">Aguardando domínio</Badge>
          </div>
          <CardDescription>Defina quem recebe o aviso quando um cliente faz uma simulação no site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="alert-email">E-mail que recebe os avisos</Label>
            <Input id="alert-email" type="email" maxLength={255} placeholder="seuemail@gmail.com" value={alertEmail} onChange={(e) => setAlertEmail(e.target.value)} />
            <p className="text-xs text-muted-foreground">Pode ser o seu Gmail. É para onde chegará o resumo de cada novo contato.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sender">Nome do remetente</Label>
            <Input id="sender" maxLength={80} value={senderName} onChange={(e) => setSenderName(e.target.value)} />
            <p className="text-xs text-muted-foreground">Nome que aparece como "de quem" o e-mail veio na caixa de entrada.</p>
          </div>
          <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border p-4">
            <span>
              <span className="block font-medium">Avisar-me a cada nova simulação</span>
              <span className="text-sm text-muted-foreground">Você recebe nome, empresa, WhatsApp e plano escolhido.</span>
            </span>
            <Switch checked={alertsOn} onCheckedChange={setAlertsOn} />
          </label>
          <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border p-4">
            <span>
              <span className="block font-medium">Enviar a proposta para o cliente</span>
              <span className="text-sm text-muted-foreground">O cliente recebe um e-mail com o resumo do plano e o valor mensal.</span>
            </span>
            <Switch checked={clientCopy} onCheckedChange={setClientCopy} />
          </label>
          <Button onClick={() => saveEmail.mutate()} disabled={saveEmail.isPending}>
            <Mail className="mr-2 h-4 w-4" /> Salvar notificações
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Caminho para ligar os e-mails</CardTitle>
          <CardDescription>{progress} de {steps.length} etapas concluídas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-success transition-all" style={{ width: `${(progress / steps.length) * 100}%` }} />
          </div>
          <ul className="space-y-2">
            {steps.map((s) => (
              <li key={s.label} className="flex items-center gap-2 text-sm">
                {s.done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                <span className={s.done ? "" : "text-muted-foreground"}>{s.label}</span>
              </li>
            ))}
          </ul>
          <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
            Suas escolhas já ficam guardadas. Quando você tiver um domínio próprio (o endereço do site, como prevti.com.br), é só avisar que os e-mails passam a sair sozinhos, sem refazer nada aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
