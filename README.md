# Prevtipilot

Crie uma aplicação web moderna, responsiva e segura chamada PrevTI - Plataforma de Assinatura de Suporte e TI Preventiva voltada para consultórios odontológicos, clínicas médicas e escritórios contábeis/advocacia.

A aplicação possui dois ecossistemas integrados:
1. Área Pública (Landing Page + Simulador Dinâmico + Conversão WhatsApp)
2. Área Administrativa Restrita (/admin com Auth, CRUD completo, Gestão de Clientes/Leads, Agenda Técnica e Configurações)

### Identidade Visual & Design System:
- Estilo: B2B SaaS corporativo, confiável, tecnológico e limpo.
- Paleta de Cores:
  - Primária: Azul Marinho / Slate Profundo (#0F172A / #1E293B)
  - Ação / Destaque: Azul Royal Tech (#2563EB) e Verde Esmeralda (#10B981) para chamadas e conversão
  - Fundo & Cards: Fundo claro neutro (#F8FAFC), cartões brancos (#FFFFFF) e bordas suaves (#E2E8F0)
- UI: Tailwind CSS com componentes shadcn/ui (Cards, Dialog, Tabs, Table com paginação/busca, Inputs com máscaras, Sliders, Badges e Toasts).

### Banco de Dados & Segurança (Lovable Cloud / Supabase com RLS):
1. Tabela `system_settings`:
   - `id` (uuid, primary key, default gen_random_uuid())
   - `key` (text, unique)
   - `value` (text)
   - `updated_at` (timestamp with time zone, default now())
   - Registros iniciais padrão:
     - `whatsapp_number`: '5531999999999'
     - `whatsapp_default_message`: 'Olá! Gostaria de agendar uma avaliação preventiva gratuita para minha empresa baseada na simulação do PrevTI.'
   - Regras RLS: Leitura pública (`SELECT` permitido para anônimos), Escrita/Edição restrita a usuários autenticados (`UPDATE`, `INSERT`, `DELETE`).

2. Tabela `leads`:
   - `id` (uuid, primary key, default gen_random_uuid())
   - `created_at` (timestamp with time zone, default now())
   - `company_name` (text, obrigatório)
   - `contact_name` (text, obrigatório)
   - `whatsapp` (text, obrigatório)
   - `email` (text)
   - `business_type` (text: 'Clínica / Consultório', 'Escritório Contábil / Jurídico', 'Comércio / Serviços', 'Outro')
   - `pc_count` (integer, default 5)
   - `has_server` (boolean, default false)
   - `has_cloud_backup` (boolean, default false)
   - `suggested_plan` (text)
   - `estimated_value` (numeric)
   - `status` (text default 'Novo Lead': 'Novo Lead', 'Em Contato', 'Visita Agendada', 'Contrato Ativo', 'Perdido')
   - `technical_notes` (text)
   - Regras RLS: Visitantes anônimos podem apenas criar registros (`INSERT`), usuários autenticados têm permissão completa (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).

3. Tabela `preventive_schedules`:
   - `id` (uuid, primary key, default gen_random_uuid())
   - `lead_id` (uuid, foreign key referenciando leads.id com on delete cascade)
   - `scheduled_date` (date)
   - `scheduled_time` (text)
   - `service_type` (text: 'Diagnóstico Inicial Gratuito', 'Visita Preventiva Mensal', 'Auditoria de Backup')
   - `status` (text default 'Pendente': 'Pendente', 'Concluído', 'Cancelado')
   - Regras RLS: Exclusivo para usuários autenticados.

### Área Pública:
- Header com logo PrevTI (escudo/tecnologia), navegação por âncoras ("Por que Prevenir?", "Como Funciona", "Simulador", "Perguntas Frequentes") e botão "Acesso Técnico" para `/login`.
- Hero section com autoridade sobre perigo de computadores parados e perda de dados, comparativo visual Reativo vs. Preventivo.
- Simulador Interativo:
  - Slider/contador de computadores (1 a 30 máquinas, R$ 50/máquina/mês).
  - Switches para Servidor Local/NAS (+ R$ 150/mês) e Backup em Nuvem redundante (+ R$ 90/mês).
  - Feedback em tempo real com plano sugerido (Start, Pro ou Corporate), valor total e itens inclusos.
  - Formulário com Nome, Empresa, WhatsApp e Segmento.
  - Ação: Salva no Supabase na tabela `leads`, busca telefone e mensagem em `system_settings`, abre WhatsApp (`wa.me`) com texto pré-preenchido e exibe Toast de sucesso.
- Seções de Como Funciona, Depoimentos/Garantia de Uptime e FAQ com acordeão.

### Autenticação & Gestão de Acesso:
- Telas de `/login` e `/reset-password` com Supabase Auth.
- Para o primeiro acesso de administrador, incluir opção ou instrução de criação de conta inicial segura, redirecionando para `/admin` após login.
- Proteção de rotas em `/admin/*` para usuários autenticados.

### Painel Administrativo (/admin):
- Sidebar com navegação: Dashboard, Clientes & Leads, Agenda Preventiva, Configurações, e botão de Sair (Logout).
- Dashboard: Cards de métricas (Total de Leads, Novos Contatos, Contratos Ativos, MRR Estimado) e próximas visitas técnicas.
- Gestão de Clientes e Leads:
  - Alternância entre visualização em Tabela (busca, filtros, ordenação) e Funil/Kanban por status ('Novo Lead' -> 'Em Contato' -> 'Visita Agendada' -> 'Contrato Ativo' -> 'Perdido').
  - Modal para criar novo lead manualmente.
  - Edição completa e exclusão com confirmação.
  - Botão de ação rápida para conversar no WhatsApp direto (`wa.me`) e botão para agendar visita técnica.
- Agenda de Visitas:
  - Lista/agrupamento por data, filtro por status, botão de concluir visita e formulário de novo agendamento vinculado a um cliente.
- Configurações do Sistema (/admin/configuracoes):
  - Formulário para editar WhatsApp de atendimento e mensagem padrão da simulação, salvando diretamente na tabela `system_settings`.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://prevtipilot.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8ce6acce-0a51-402d-9cd3-aca74d32b776).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
