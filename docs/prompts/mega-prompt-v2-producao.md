# MEGA PROMPT v2.0: "PrevTI" - Plataforma B2B de TI Preventiva (Versão Produção)

> Produto após testes reais com usuários, auditoria de segurança RLS, resolução de bloqueios de navegadores, funil Kanban de vendas e módulo de e-mails.

## 1. VISÃO GERAL DO PRODUTO
Crie uma aplicação web moderna, responsiva, segura e corporativa chamada **PrevTI - Plataforma de Assinatura de Suporte e TI Preventiva**, voltada para clínicas odontológicas/médicas e escritórios contábeis/jurídicos.

Dois ecossistemas integrados:
1. **Área Pública** (Landing Page de Conversão + Simulador Dinâmico com Ajuda Didática + Pop-up Anti-bloqueio para WhatsApp)
2. **Área Administrativa Restrita** (/admin com Auth, Dashboard de MRR, Tabela Completa e Funil Kanban com Drag & Drop, Agenda Técnica e Configurações com Módulo de E-mails)

---

## 2. IDENTIDADE VISUAL & DESIGN SYSTEM
- **Estilo:** B2B SaaS corporativo, confiável e tecnológico.
- **Tipografia:** Sora (títulos/autoridade) e Manrope (textos e interfaces funcionais).
- **Paleta de Cores:**
  - Primária: Azul Marinho / Slate Profundo (`#0F172A` / `#1E293B`)
  - Ação / Destaque: Azul Royal Tech (`#2563EB`) e Verde Esmeralda (`#10B981`)
  - Fundo & Cards: Fundo claro neutro (`#F8FAFC`), cartões brancos (`#FFFFFF`) e bordas suaves (`#E2E8F0`)
- **UI Toolkit:** Tailwind CSS v4 com shadcn/ui acessível (Dialogs, Tabs, Sliders, Cards, Badges, Toasts e explicações inline compatíveis com toque e clique).

---

## 3. ARQUITETURA DO BANCO DE DADOS & SEGURANÇA (Lovable Cloud)

### Tabela `system_settings` (Configurações Gerais e Notificações)
- `id` (uuid, primary key)
- `key` (text, unique) — ex: `whatsapp_number`, `whatsapp_default_message`, `admin_alert_email`, `email_sender_name`, `email_alerts_enabled`, `email_client_copy_enabled`
- `value` (text)
- `updated_at` (timestamp)
- **RLS Granular:**
  - Leitura pública estritamente restrita às chaves `whatsapp_number` e `whatsapp_default_message`.
  - Leitura e escrita das chaves administrativas exclusivas para usuários com role `admin`.

### Tabela `leads` (Oportunidades, Leads e Contratos Ativos)
- `id` (uuid, primary key)
- `created_at` (timestamptz, default now())
- `company_name` (text, obrigatório)
- `contact_name` (text, obrigatório)
- `whatsapp` (text, obrigatório)
- `email` (text, obrigatório no simulador, validado)
- `business_type` (text: 'Clínica / Consultório', 'Escritório Contábil / Jurídico', 'Comércio / Serviços', 'Outro')
- `pc_count` (integer, default 5)
- `has_server` (boolean, default false)
- `has_cloud_backup` (boolean, default false)
- `suggested_plan` (text: 'Start', 'Pro', 'Corporate')
- `estimated_value` (numeric)
- `status` (text: 'Novo Lead', 'Em Contato', 'Visita Agendada', 'Contrato Ativo', 'Perdido' — default 'Novo Lead')
- `technical_notes` (text)
- **RLS:** Anônimos apenas INSERT. Administradores com SELECT, UPDATE e DELETE.

### Tabela `preventive_schedules` (Agenda Técnica Preventiva)
- `id` (uuid, primary key)
- `lead_id` (uuid, FK para `leads.id` com ON DELETE CASCADE)
- `scheduled_date` (date)
- `scheduled_time` (text)
- `service_type` (text: 'Diagnóstico Inicial Gratuito', 'Visita Preventiva Mensal', 'Auditoria de Backup')
- `status` (text: 'Pendente', 'Concluído', 'Cancelado' — default 'Pendente')
- **RLS:** Exclusivo para administradores.

### Tabela `user_roles` e Autorização por Papéis
- Controle de acesso via função `has_role(auth.uid(), 'admin')`.
- Trigger que concede papel de administrador ao primeiro usuário cadastrado.

---

## 4. ÁREA PÚBLICA (LANDING PAGE & SIMULADOR)

### A. Header & Navegação
- Logo PrevTI com escudo tecnológico.
- Navegação por âncoras e botão "Acesso Técnico" para `/login`.

### B. Hero Section & Comparativo
- Headline focada em blindagem operacional e fim dos chamados de urgência.
- Comparativo visual: "Manutenção Reativa Tradicional" vs. "TI Preventiva PrevTI".

### C. Simulador Dinâmico com Ajuda Didática
- **Controles:**
  - Slider de 1 a 30 computadores (R$ 50/máquina/mês).
  - Switch "Servidor Local ou NAS de Arquivos" (+ R$ 150/mês).
  - Switch "Backup em Nuvem redundante" (+ R$ 90/mês).
  - **Ajuda inline:** ícone (i) que abre explicação simples dentro do próprio card, sem sobrepor controles (funciona no toque e no clique).
- **Feedback em tempo real:** plano sugerido (Start ≤5 PCs; Pro 6–15 PCs ou com servidor; Corporate >15 PCs), valor mensal e itens inclusos.
- **Formulário:** Nome, Empresa, WhatsApp (com máscara), E-mail profissional (validado com Zod) e Segmento.
- **Fluxo de conversão anti-bloqueio:**
  1. Salva o registro na tabela `leads`.
  2. Limpa o telefone para o formato universal `https://wa.me/55...?text=...` com `encodeURIComponent`.
  3. Exibe modal centralizado: *"Recebemos sua simulação! Em breve entraremos em contato pelo WhatsApp..."*
  4. Dois botões: **"Falar agora no WhatsApp"** (verde, abre a conversa) e **"Continuar no site"** (fecha o modal).

### D. FAQ Expandido
- Perguntas explicando para leigos o que é um Servidor/NAS e o que é Backup em Nuvem redundante.

---

## 5. AUTENTICAÇÃO E SEGURANÇA (/login e /reset-password)
- Login com e-mail/usuário e senha, com ícone de olho para mostrar/ocultar a senha.
- Recuperação de senha por e-mail e redefinição em `/reset-password`.
- Rotas `/admin/*` protegidas, redirecionando para `/login` sem sessão.

---

## 6. PAINEL ADMINISTRATIVO (/admin)

### A. Dashboard
- Cards: Total de Leads, Novos Contatos, Contratos Ativos e MRR Estimado.
- Próximas visitas preventivas agendadas.

### B. Clientes e Leads (Visão Dupla)
- **Aba Tabela:** busca, filtros por status, ordenação, paginação; WhatsApp e e-mail visíveis; ações rápidas (WhatsApp, agendar visita, editar, excluir com confirmação); botão "+ Novo Registro".
- **Aba Funil (Kanban):**
  - Colunas: Novo Lead → Em Contato → Visita Agendada → Contrato Ativo → Perdido.
  - Drag-and-drop atualizando o status no banco.
  - Contador de leads e total R$/mês no topo de cada coluna.
  - Colunas de largura fixa (~280px) com rolagem horizontal, sem sobreposição em tablets.

### C. Agenda de Visitas Preventivas
- Lista agrupada por data com filtro por status.
- Modal de nova visita vinculada a cliente; conclusão com um clique.

### D. Configurações (/admin/configuracoes)
- **WhatsApp:** número de atendimento e mensagem padrão do simulador.
- **Notificações por E-mail:** e-mail de alerta do admin, nome do remetente, toggles "Avisar-me a cada nova simulação" e "Enviar cópia da proposta para o cliente".
- **Caminho para ligar os e-mails:** régua de progresso em 4 etapas até o disparo automático com domínio próprio.
