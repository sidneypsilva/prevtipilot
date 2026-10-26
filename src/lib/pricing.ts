export const PRICE_PER_PC = 50;
export const SERVER_PRICE = 150;
export const CLOUD_BACKUP_PRICE = 90;
export const MIN_PCS = 1;
export const MAX_PCS = 30;

export type PlanName = "Start" | "Pro" | "Corporate";

export interface SimulationInput {
  pcCount: number;
  hasServer: boolean;
  hasCloudBackup: boolean;
}

export function suggestPlan({ pcCount, hasServer }: SimulationInput): PlanName {
  if (pcCount > 15) return "Corporate";
  if (pcCount > 5 || hasServer) return "Pro";
  return "Start";
}

export function calculateTotal({ pcCount, hasServer, hasCloudBackup }: SimulationInput): number {
  const pcs = Math.min(MAX_PCS, Math.max(MIN_PCS, Math.round(pcCount)));
  return pcs * PRICE_PER_PC + (hasServer ? SERVER_PRICE : 0) + (hasCloudBackup ? CLOUD_BACKUP_PRICE : 0);
}

export function planItems(input: SimulationInput): string[] {
  const plan = suggestPlan(input);
  const items = [
    `Monitoramento preventivo de ${input.pcCount} computador(es)`,
    "Suporte remoto ilimitado em horário comercial",
    "Atualizações de segurança e antivírus gerenciado",
  ];
  if (plan !== "Start") items.push("Visita técnica preventiva mensal");
  if (plan === "Corporate") items.push("Gerente técnico dedicado e SLA prioritário de 2h");
  if (input.hasServer) items.push("Gestão de Servidor Local / NAS");
  if (input.hasCloudBackup) items.push("Backup em nuvem redundante com teste de restauração");
  return items;
}

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function maskPhone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function waLink(number: string, message: string) {
  const n = number.replace(/\D/g, "");
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

/** Converts a Brazilian phone typed by the user into a wa.me number (adds 55 when missing). */
export function toWaNumber(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.startsWith("55") && d.length > 11 ? d : `55${d}`;
}

export const BUSINESS_TYPES = [
  "Clínica / Consultório",
  "Escritório Contábil / Jurídico",
  "Comércio / Serviços",
  "Outro",
] as const;

export const LEAD_STATUSES = [
  "Novo Lead",
  "Em Contato",
  "Visita Agendada",
  "Contrato Ativo",
  "Perdido",
] as const;

export const SERVICE_TYPES = [
  "Diagnóstico Inicial Gratuito",
  "Visita Preventiva Mensal",
  "Auditoria de Backup",
] as const;

export const SCHEDULE_STATUSES = ["Pendente", "Concluído", "Cancelado"] as const;
