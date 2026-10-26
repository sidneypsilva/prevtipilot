import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  AlertTriangle, ArrowRight, CheckCircle2, Clock, Cloud, HardDrive, Info, Monitor, ShieldCheck,
  Stethoscope, Scale, Wrench, XCircle, Activity, Star, MessageCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  BUSINESS_TYPES, CLOUD_BACKUP_PRICE, MAX_PCS, MIN_PCS, PRICE_PER_PC, SERVER_PRICE,
  calculateTotal, formatBRL, maskPhone, planItems, suggestPlan, waLink,
} from "@/lib/pricing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PrevTI — TI Preventiva por Assinatura para Clínicas e Escritórios" },
      { name: "description", content: "Evite computadores parados e perda de dados. Suporte e manutenção preventiva de TI por assinatura para consultórios, clínicas e escritórios." },
      { property: "og:title", content: "PrevTI — TI Preventiva por Assinatura" },
      { property: "og:description", content: "Simule seu plano de TI preventiva e agende uma avaliação gratuita." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const leadSchema = z.object({
  contact_name: z.string().trim().min(2, "Informe seu nome").max(120),
  company_name: z.string().trim().min(2, "Informe a empresa").max(150),
  whatsapp: z.string().refine((v) => v.replace(/\D/g, "").length >= 10, "WhatsApp inválido"),
  business_type: z.enum(BUSINESS_TYPES, { errorMap: () => ({ message: "Selecione o segmento" }) }),
});

const nav = [
  ["#por-que", "Por que Prevenir?"],
  ["#como-funciona", "Como Funciona"],
  ["#simulador", "Simulador"],
  ["#faq", "Perguntas Frequentes"],
] as const;

function Landing() {
  return (
    <TooltipProvider delayDuration={150}>
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <a href="#top"><Logo /></a>
          <nav className="hidden gap-7 text-sm font-medium text-muted-foreground md:flex">
            {nav.map(([h, l]) => (
              <a key={h} href={h} className="transition-colors hover:text-foreground">{l}</a>
            ))}
          </nav>
          <Button asChild variant="outline" size="sm">
            <Link to="/login">Acesso Técnico</Link>
          </Button>
        </div>
      </header>
      <Hero />
      <WhySection />
      <HowSection />
      <Simulator />
      <Trust />
      <Faq />
      <footer className="bg-navy py-10 text-navy-foreground/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <Logo light />
          <p className="text-sm">© {new Date().getFullYear()} PrevTI — TI Preventiva por Assinatura.</p>
        </div>
      </footer>
    </div>
    </TooltipProvider>
  );
}

function Hero() {
  return (
    <section id="top" className="bg-hero text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <Badge className="mb-6 border-success/40 bg-success/15 text-success hover:bg-success/15">
            <Activity className="mr-1 h-3.5 w-3.5" /> Monitoramento 24/7
          </Badge>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Computador parado é paciente remarcado e prazo perdido.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-navy-foreground/75">
            A PrevTI cuida da TI do seu consultório, clínica ou escritório antes que ela quebre.
            Manutenção preventiva, backup testado e suporte por uma assinatura mensal previsível.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-success text-success-foreground hover:bg-success/90">
              <a href="#simulador">Simular meu plano <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-navy-foreground/25 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground">
              <a href="#como-funciona">Como funciona</a>
            </Button>
          </div>
          <div className="mt-10 flex gap-8 text-sm text-navy-foreground/70">
            <div><p className="font-display text-3xl font-bold text-navy-foreground">99,8%</p>uptime médio</div>
            <div><p className="font-display text-3xl font-bold text-navy-foreground">-73%</p>chamados urgentes</div>
            <div><p className="font-display text-3xl font-bold text-navy-foreground">2h</p>SLA prioritário</div>
          </div>
        </div>
        <div className="grid gap-4 self-center sm:grid-cols-2">
          <Card className="border-destructive/30 bg-navy-2/60 text-navy-foreground">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2 font-display font-semibold text-destructive">
                <XCircle className="h-5 w-5" /> TI Reativa
              </div>
              <ul className="space-y-3 text-sm text-navy-foreground/75">
                {["Chama o técnico só quando quebra", "Agenda parada por horas ou dias", "Backup que ninguém testou", "Custos imprevisíveis e urgentes"].map((t) => (
                  <li key={t} className="flex gap-2"><AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />{t}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-success/40 bg-navy-2/60 text-navy-foreground shadow-elegant sm:-mt-6">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2 font-display font-semibold text-success">
                <ShieldCheck className="h-5 w-5" /> TI Preventiva
              </div>
              <ul className="space-y-3 text-sm text-navy-foreground/75">
                {["Falhas detectadas antes de parar", "Atendimento sem interrupções", "Backup diário e restauração testada", "Mensalidade fixa e previsível"].map((t) => (
                  <li key={t} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-success" />{t}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  const items = [
    { icon: Stethoscope, t: "Clínicas e consultórios", d: "Prontuários, agenda e imagens precisam estar disponíveis o tempo todo — e protegidos pela LGPD." },
    { icon: Scale, t: "Escritórios contábeis e jurídicos", d: "Prazos fiscais e processuais não esperam o computador voltar a funcionar." },
    { icon: HardDrive, t: "Dados que não voltam", d: "Ransomware e falha de disco são as maiores causas de perda definitiva de dados em pequenas empresas." },
  ];
  return (
    <section id="por-que" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Por que prevenir?</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">Uma hora parada custa mais que um mês de prevenção.</h2>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {items.map(({ icon: I, t, d }) => (
          <Card key={t} className="transition-shadow hover:shadow-elegant">
            <CardContent className="p-6">
              <I className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function HowSection() {
  const steps = [
    { icon: Monitor, t: "Simule", d: "Informe quantos computadores e serviços sua empresa usa." },
    { icon: Wrench, t: "Diagnóstico gratuito", d: "Um técnico avalia sua estrutura sem compromisso." },
    { icon: ShieldCheck, t: "Proteção contínua", d: "Monitoramento, atualizações e backup gerenciados." },
    { icon: Clock, t: "Visitas mensais", d: "Manutenção preventiva programada e relatório técnico." },
  ];
  return (
    <section id="como-funciona" className="scroll-mt-20 border-y border-border bg-card py-20">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Como funciona</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">Quatro passos para nunca mais parar.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map(({ icon: I, t, d }, i) => (
            <div key={t} className="relative rounded-xl border border-border bg-background p-6">
              <span className="font-display text-5xl font-extrabold text-primary/15">0{i + 1}</span>
              <I className="mt-2 h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Simulator() {
  const [pcCount, setPcCount] = useState(5);
  const [hasServer, setHasServer] = useState(false);
  const [hasCloudBackup, setHasCloudBackup] = useState(false);
  const [form, setForm] = useState({ contact_name: "", company_name: "", whatsapp: "", business_type: "" });
  const [errors, setErrors] = useState<Partial<Record<"contact_name" | "company_name" | "whatsapp" | "business_type", string>>>({});
  const [loading, setLoading] = useState(false);

  const input = { pcCount, hasServer, hasCloudBackup };
  const plan = suggestPlan(input);
  const total = calculateTotal(input);
  const items = planItems(input);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs as typeof errors);
      return;
    }
    setErrors({});
    setLoading(true);
    // Open the tab synchronously so popup blockers allow it.
    const win = window.open("", "_blank");
    try {
      const { error } = await supabase.from("leads").insert({
        ...parsed.data,
        pc_count: pcCount,
        has_server: hasServer,
        has_cloud_backup: hasCloudBackup,
        suggested_plan: plan,
        estimated_value: total,
      });
      if (error) throw error;
      const { data: settings } = await supabase.from("system_settings").select("key,value");
      const get = (k: string) => settings?.find((s) => s.key === k)?.value ?? "";
      const msg = `${get("whatsapp_default_message")}\n\nEmpresa: ${parsed.data.company_name}\nContato: ${parsed.data.contact_name}\nSegmento: ${parsed.data.business_type}\nComputadores: ${pcCount}\nServidor/NAS: ${hasServer ? "Sim" : "Não"}\nBackup em nuvem: ${hasCloudBackup ? "Sim" : "Não"}\nPlano sugerido: ${plan} — ${formatBRL(total)}/mês`;
      const url = waLink(get("whatsapp_number") || "5531999999999", msg);
      if (win) win.location.href = url; else window.location.href = url;
      toast.success("Simulação enviada!", { description: "Abrimos o WhatsApp para você concluir o agendamento." });
      setForm({ contact_name: "", company_name: "", whatsapp: "", business_type: "" });
    } catch {
      win?.close();
      toast.error("Não foi possível enviar sua simulação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="simulador" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Simulador</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">Monte seu plano em 30 segundos.</h2>
        <p className="mt-3 text-muted-foreground">Valores transparentes: {formatBRL(PRICE_PER_PC)} por máquina/mês, sem taxa de adesão.</p>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardContent className="space-y-8 p-6 md:p-8">
            <div>
              <div className="flex items-end justify-between">
                <Label className="text-base">Quantidade de computadores</Label>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setPcCount((c) => Math.max(MIN_PCS, c - 1))}>−</Button>
                  <span className="w-12 text-center font-display text-3xl font-bold text-primary">{pcCount}</span>
                  <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setPcCount((c) => Math.min(MAX_PCS, c + 1))}>+</Button>
                </div>
              </div>
              <Slider className="mt-5" min={MIN_PCS} max={MAX_PCS} step={1} value={[pcCount]} onValueChange={(v) => setPcCount(v[0] ?? MIN_PCS)} />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>1</span><span>30</span></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('[role="switch"]')) return;
                  setHasServer((v) => !v);
                }}
                className={cn(
                  "flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-border p-4",
                  hasServer && "border-primary",
                )}
              >
                <div className="flex gap-3"><HardDrive className="h-5 w-5 text-primary" /><div><p className="flex items-center gap-1.5 font-medium">Servidor Local / NAS de Arquivos<InfoTip label="Servidor Local / NAS de Arquivos" text="Computador central ou aparelho de armazenamento que fica na rede da sua empresa, guardando os sistemas (prontuário, ERP, banco de dados) e os arquivos compartilhados. Monitoramos discos, memória, permissões e temperatura." /></p><p className="text-xs text-muted-foreground">+ {formatBRL(SERVER_PRICE)}/mês</p></div></div>
                <Switch checked={hasServer} onCheckedChange={setHasServer} />
              </label>
              <label
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('[role="switch"]')) return;
                  setHasCloudBackup((v) => !v);
                }}
                className={cn(
                  "flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-border p-4",
                  hasCloudBackup && "border-primary",
                )}
              >
                <div className="flex gap-3"><Cloud className="h-5 w-5 text-primary" /><div><p className="flex items-center gap-1.5 font-medium">Backup em Nuvem redundante<InfoTip label="Backup em Nuvem redundante" text="Cópias diárias e criptografadas dos seus dados guardadas em servidores seguros fora da empresa, em mais de um lugar ao mesmo tempo. Se o computador queimar, for roubado ou sofrer ransomware, você restaura tudo rapidamente." /></p><p className="text-xs text-muted-foreground">+ {formatBRL(CLOUD_BACKUP_PRICE)}/mês</p></div></div>
                <Switch checked={hasCloudBackup} onCheckedChange={setHasCloudBackup} />
              </label>
            </div>
            <form onSubmit={submit} className="grid gap-4 border-t border-border pt-6 sm:grid-cols-2" noValidate>
              <Field label="Seu nome" error={errors.contact_name}>
                <Input value={form.contact_name} maxLength={120} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
              </Field>
              <Field label="Empresa" error={errors.company_name}>
                <Input value={form.company_name} maxLength={150} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
              </Field>
              <Field label="WhatsApp" error={errors.whatsapp}>
                <Input inputMode="tel" placeholder="(31) 99999-9999" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: maskPhone(e.target.value) })} />
              </Field>
              <Field label="Segmento" error={errors.business_type}>
                <Select value={form.business_type} onValueChange={(v) => setForm({ ...form, business_type: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{BUSINESS_TYPES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Button type="submit" size="lg" disabled={loading} className="bg-success text-success-foreground hover:bg-success/90 sm:col-span-2">
                <MessageCircle className="mr-2 h-4 w-4" />
                {loading ? "Enviando..." : "Agendar avaliação gratuita no WhatsApp"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="bg-navy text-navy-foreground shadow-elegant lg:col-span-2">
          <CardContent className="flex h-full flex-col p-6 md:p-8">
            <p className="text-sm text-navy-foreground/60">Plano sugerido</p>
            <p className="mt-1 font-display text-4xl font-extrabold">PrevTI <span className="text-success">{plan}</span></p>
            <p className="mt-6 text-sm text-navy-foreground/60">Investimento mensal</p>
            <p className="font-display text-5xl font-bold">{formatBRL(total)}</p>
            <ul className="mt-8 space-y-3 text-sm">
              {items.map((i) => (
                <li key={i} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-success" />{i}</li>
              ))}
            </ul>
            <p className="mt-auto pt-8 text-xs text-navy-foreground/50">Diagnóstico inicial gratuito e sem fidelidade.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/** Discreet help icon that explains a simulator option in a tooltip (hover, focus or tap). */
function InfoTip({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`O que é ${label}?`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8} className="max-w-64 rounded-lg p-3 text-left leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

function Trust() {
  const t = [
    { n: "Dra. Mariana Lopes", r: "Clínica Odonto Sorriso", q: "Desde que a PrevTI assumiu, não perdemos mais nenhum dia de agenda por problema no computador." },
    { n: "Ricardo Almeida", r: "Almeida Contabilidade", q: "O backup testado todo mês me deu tranquilidade na época de declarações." },
    { n: "Dr. Paulo Viana", r: "Viana Advogados", q: "Atendimento rápido e preço fixo. Finalmente TI deixou de ser dor de cabeça." },
  ];
  return (
    <section className="border-y border-border bg-card py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-10 lg:grid-cols-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Garantia de Uptime</p>
            <h2 className="mt-2 text-3xl font-bold">99,5% de disponibilidade garantida em contrato.</h2>
            <p className="mt-3 text-muted-foreground">Se não cumprirmos, você recebe desconto proporcional na próxima mensalidade.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:col-span-2">
            {t.map((x) => (
              <Card key={x.n}><CardContent className="p-5">
                <div className="flex gap-0.5 text-warning">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                <p className="mt-3 text-sm">"{x.q}"</p>
                <p className="mt-4 text-sm font-semibold">{x.n}</p>
                <p className="text-xs text-muted-foreground">{x.r}</p>
              </CardContent></Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const qs = [
    ["Existe fidelidade ou multa?", "Não. Você pode cancelar com 30 dias de aviso, sem multa."],
    ["O diagnóstico inicial é realmente gratuito?", "Sim. Avaliamos sua estrutura e entregamos um relatório de riscos sem custo."],
    ["Vocês atendem presencialmente?", "Sim. O suporte remoto é ilimitado e os planos Pro e Corporate incluem visitas preventivas mensais."],
    ["Como funciona o backup em nuvem?", "Seus dados são copiados diariamente, criptografados, para dois datacenters distintos, e testamos a restauração mensalmente."],
    ['O que é "Servidor Local / NAS de Arquivos"?', "É um computador central ou um aparelho de armazenamento dedicado que fica na rede da sua empresa. Nele ficam os sistemas que você usa no dia a dia (prontuário, ERP, banco de dados) ou é lá que os funcionários salvam e compartilham arquivos em rede. Quando você tem esse equipamento, o PrevTI acompanha a integridade dos discos, o uso de memória, as permissões de acesso e a temperatura dele, para que uma falha simples não derrube o trabalho de toda a equipe."],
    ['O que é "Backup em Nuvem redundante"?', "É uma rotina automática que envia todos os dias cópias criptografadas dos seus dados importantes para servidores seguros fora da empresa (na nuvem). Redundante significa que essas cópias ficam guardadas em mais de um lugar ao mesmo tempo. Assim, se o computador principal queimar, for roubado ou sofrer um ataque de vírus (ransomware), você não perde o histórico de clientes nem os dados fiscais e consegue restaurar tudo rapidamente."],
    ["Atende às exigências da LGPD?", "Sim. Aplicamos boas práticas de segurança, controle de acesso e backup alinhadas à LGPD."],
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20">
      <p className="text-center text-sm font-semibold uppercase tracking-widest text-primary">Perguntas Frequentes</p>
      <h2 className="mt-2 text-center text-3xl font-bold">Tire suas dúvidas</h2>
      <Accordion type="single" collapsible className="mt-8">
        {qs.map(([q = "", a = ""]) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger className="text-left">{q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
