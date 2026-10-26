import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type Schedule = Database["public"]["Tables"]["preventive_schedules"]["Row"];
export type ScheduleWithLead = Schedule & { leads: Pick<Lead, "company_name" | "contact_name" | "whatsapp"> | null };

export const leadsQuery = queryOptions({
  queryKey: ["leads"],
  queryFn: async () => {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const schedulesQuery = queryOptions({
  queryKey: ["schedules"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("preventive_schedules")
      .select("*, leads(company_name, contact_name, whatsapp)")
      .order("scheduled_date", { ascending: true });
    if (error) throw error;
    return data as ScheduleWithLead[];
  },
});

export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("system_settings").select("*");
    if (error) throw error;
    return data;
  },
});

export const isAdminQuery = (userId: string) =>
  queryOptions({
    queryKey: ["is-admin", userId],
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
      return data === true;
    },
  });

export const formatDate = (d: string) => {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};
