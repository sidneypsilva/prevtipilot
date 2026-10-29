DROP POLICY IF EXISTS "public read" ON public.system_settings;
CREATE POLICY "public read whatsapp" ON public.system_settings FOR SELECT TO anon, authenticated USING (key IN ('whatsapp_number','whatsapp_default_message'));
CREATE POLICY "admin read all" ON public.system_settings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));