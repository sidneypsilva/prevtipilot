# MEGA PROMPT v1.0: "PrevTI" - MVP Inicial (Conceito Gemini)

> Especificação inicial do produto, focada na validação rápida da ideia.

## 1. VISÃO GERAL DO PRODUTO
Crie uma aplicação web moderna, responsiva e segura chamada **PrevTI**, voltada para consultórios odontológicos, clínicas médicas e escritórios contábeis/advocacia.
A aplicação possui dois ecossistemas integrados:
1. **Área Pública (Landing Page + Simulador Dinâmico + Conversão WhatsApp)**
2. **Área Administrativa Restrita (/admin com Auth, CRUD completo, Gestão de Usuários e Configurações)**

---

## 2. IDENTIDADE VISUAL & DESIGN SYSTEM
- **Estilo:** B2B SaaS corporativo, confiável, tecnológico e limpo.
- **Paleta de Cores:**
  - Primária: Azul Marinho / Slate Profundo (`#0F172A` / `#1E293B`)
  - Ação / Destaque: Azul Royal Tech (`#2563EB`) e Verde Esmeralda (`#10B981`) para chamadas e conversão
  - Fundo & Cards: Fundo claro neutro (`#F8FAFC`), cartões brancos (`#FFFFFF`) e bordas suaves (`#E2E8F0`)
- **UI Toolkit:** Tailwind CSS com componentes shadcn/ui (Cards, Modais de Diálogo, Tabs, Tabelas com paginação/busca, Inputs com máscaras, Sliders e Toasts).

---

## 3. ARQUITETURA DO BANCO DE DADOS (Lovable Cloud / Supabase)
Estruture as seguintes tabelas e regras:

### Tabela `system_settings` (Configurações Gerais)
- `id` (uuid, primary key)
- `key` (text, unique) — Ex: 'whatsapp_number', 'whatsapp_default_message'
- `value` (text)
- `updated_at` (timestamp)
*(Criar registro inicial padrão com key='whatsapp_number' e value='5531999999999')*

### Tabela `leads` (CRUD de Oportunidades e Clientes)
- `id` (uuid, primary key)
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
- `status` (text: 'Novo Lead', 'Em Contato', 'Visita Agendada', 'Contrato Ativo', 'Perdido' - default: 'Novo Lead')
- `technical_notes` (text)

### Tabela `preventive_schedules` (Agenda Técnica)
- `id` (uuid, primary key)
- `lead_id` (uuid, foreign key referenciando leads.id com cascade)
- `scheduled_date` (date)
- `scheduled_time` (text)
- `service_type` (text: 'Diagnóstico Inicial Gratuito', 'Visita Preventiva Mensal', 'Auditoria de Backup')
- `status` (text: 'Pendente', 'Concluído', 'Cancelado' - default: 'Pendente')

---

## 4. ÁREA PÚBLICA (LANDING PAGE & SIMULADOR)

### A. Cabeçalho (Header)
- Logotipo **PrevTI** com ícone de escudo/tecnologia.
- Navegação suave por âncoras: "Por que Prevenir?", "Como Funciona", "Simulador de Planos", "Dúvidas Frequentes".
- Botão secundário no canto direito: "Acesso Técnico" (redireciona para `/login`).

### B. Hero Section & Benefícios
- Título principal com autoridade focado no prejuízo de computadores parados e dados perdidos.
- Subtítulo explicando a tranquilidade da manutenção preventiva por assinatura mensal.
- Comparativo visual rápido: "Manutenção Reativa (Chamar quando quebra)" vs. "Manutenção Preventiva PrevTI (Varreduras ativas e backups seguros)".

### C. Simulador de Planos Dinâmico
- **Controles Interativos:**
  - Slider/Contador numérico de computadores/notebooks (de 1 a 30 máquinas, calculando R$ 50/máquina/mês).
  - Switch: "Possui Servidor Local ou NAS de Arquivos?" (+ R$ 150/mês).
  - Switch: "Rotina de Backup em Nuvem redundante?" (+ R$ 90/mês).
- **Feedback em Tempo Real:** Card lateral demonstrando o plano indicado (*Start*, *Pro* ou *Corporate*), valor mensal calculado e lista de itens cobertos.
- **Formulário de Contato Integrado:**
  - Campos: Nome do Responsável, Nome da Empresa, WhatsApp e Segmento.
  - Botão de Ação: **"Agendar Avaliação Gratuita no WhatsApp"**.
  - **Lógica de Envio:**
    1. Salva o registro completo na tabela `leads`.
    2. Lê o número do WhatsApp e a mensagem cadastrados na tabela `system_settings`.
    3. Monta a URL `https://wa.me/{numero}?text={mensagem_formatada}` e abre em nova aba, passando o resumo da simulação.
    4. Dispara Toast de sucesso: *"Simulação salva! Abrindo atendimento no WhatsApp..."*

---

## 5. AUTENTICAÇÃO E CONTROLE DE ACESSO (/login e /admin)

### Fluxo de Autenticação (Supabase Auth)
- **Tela de Login (`/login`):**
  - E-mail e Senha para administradores e técnicos autorizados.
  - Link **"Esqueci minha senha"**: abre modal/tela para informar o e-mail cadastrado e receber o link de redefinição de senha (Password Recovery).
- **Tela de Redefinição (`/reset-password`):**
  - Permite digitar e confirmar a nova senha com validação de força.
- **Proteção de Rota:** Qualquer tentativa de acessar `/admin` sem sessão ativa redireciona imediatamente para `/login`.

---

## 6. PAINEL DE CONTROLE ADMINISTRATIVO (/admin)
Layout com barra lateral fixa (Sidebar) contendo as seguintes páginas e funcionalidades:

### A. Dashboard Geral
- Cards com indicadores-chave: Total de Leads, Novos Contatos, Contratos Ativos e Faturamento Mensal Recorrente (MRR Estimado).
- Tabela compacta com as próximas 5 visitas preventivas agendadas.

### B. Gestão de Clientes e Leads (CRUD Completo)
- **Create:** Botão "+ Novo Registro" que abre modal para cadastro manual de clientes (para negócios fechados fora do site).
- **Read:** Tabela completa com barra de busca por nome/empresa, filtro por status e ordenação por data.
- **Update:** Botão de edição em cada linha para atualizar dados cadastrais, quantidade de máquinas, plano, valor e observações técnicas.
- **Delete:** Botão de exclusão com modal de confirmação ("Tem certeza que deseja remover este registro?").
- **Ações Rápidas:** Botão para abrir conversa no WhatsApp direto com o cliente (`wa.me`) e botão para agendar visita preventiva.

### C. Agenda de Visitas Preventivas
- Lista de visitas técnicas com filtro por status (Pendente / Concluído).
- Formulário para registrar nova data de visita vinculada a um cliente existente.
- Ação com um clique para marcar como "Concluído".

### D. Configurações do Sistema (/admin/configuracoes)
- Tela exclusiva para administradores gerenciarem os parâmetros de contato:
  - **Campo de Input:** "Número do WhatsApp de Atendimento" (com validação de DDI + DDD + Número).
  - **Campo de Textarea:** "Modelo da Mensagem Padrão enviada pelo Simulador".
  - Botão **"Salvar Configurações"**: Atualiza os registros na tabela `system_settings` em tempo real, garantindo que o simulador da Landing Page use imediatamente os novos valores sem necessidade de novo deploy.