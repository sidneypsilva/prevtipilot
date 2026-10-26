create type public.app_role as enum ('admin','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.admin_exists() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.user_roles where role='admin') $$;
grant execute on function public.admin_exists() to anon, authenticated;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if not exists(select 1 from public.user_roles where role='admin') then
    insert into public.user_roles(user_id, role) values (new.id,'admin');
  else
    insert into public.user_roles(user_id, role) values (new.id,'user');
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.system_settings (id uuid primary key default gen_random_uuid(), key text unique not null, value text, updated_at timestamptz default now());
grant select on public.system_settings to anon, authenticated; grant insert, update, delete on public.system_settings to authenticated; grant all on public.system_settings to service_role;
alter table public.system_settings enable row level security;
create policy "public read" on public.system_settings for select to anon, authenticated using (true);
create policy "admin insert" on public.system_settings for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update" on public.system_settings for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete" on public.system_settings for delete to authenticated using (public.has_role(auth.uid(),'admin'));
insert into public.system_settings(key,value) values
('whatsapp_number','5531999999999'),
('whatsapp_default_message','Olá! Gostaria de agendar uma avaliação preventiva gratuita para minha empresa baseada na simulação do PrevTI.');

create table public.leads (
 id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
 company_name text not null check (char_length(company_name) between 1 and 150),
 contact_name text not null check (char_length(contact_name) between 1 and 120),
 whatsapp text not null check (char_length(whatsapp) between 8 and 20),
 email text check (email is null or char_length(email) <= 255),
 business_type text check (business_type in ('Clínica / Consultório','Escritório Contábil / Jurídico','Comércio / Serviços','Outro')),
 pc_count integer default 5 check (pc_count between 0 and 1000),
 has_server boolean default false, has_cloud_backup boolean default false,
 suggested_plan text, estimated_value numeric,
 status text not null default 'Novo Lead' check (status in ('Novo Lead','Em Contato','Visita Agendada','Contrato Ativo','Perdido')),
 technical_notes text);
grant insert on public.leads to anon; grant select, insert, update, delete on public.leads to authenticated; grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "anon create lead" on public.leads for insert to anon with check (status = 'Novo Lead' and technical_notes is null);
create policy "admin all leads" on public.leads for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.preventive_schedules (
 id uuid primary key default gen_random_uuid(),
 lead_id uuid not null references public.leads(id) on delete cascade,
 scheduled_date date not null, scheduled_time text,
 service_type text check (service_type in ('Diagnóstico Inicial Gratuito','Visita Preventiva Mensal','Auditoria de Backup')),
 status text not null default 'Pendente' check (status in ('Pendente','Concluído','Cancelado')),
 created_at timestamptz default now());
grant select, insert, update, delete on public.preventive_schedules to authenticated; grant all on public.preventive_schedules to service_role;
alter table public.preventive_schedules enable row level security;
create policy "admin all schedules" on public.preventive_schedules for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));