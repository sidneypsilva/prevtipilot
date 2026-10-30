# 🛡️ PrevTI - Plataforma de Suporte e TI Preventiva por Assinatura

> **MVP B2B SaaS** desenvolvido para o Desafio de Projeto da **DIO (Digital Innovation One)**: construção de produto digital mínimo utilizando IA como co-founder e Lovable para prototipação, arquitetura e deploy rápido.

[![Status](https://img.shields.io/badge/Status-Online-10b981?style=for-the-badge)](https://prevtipilot.lovable.app)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TanStack Start](https://img.shields.io/badge/TanStack%20Start%20v1-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/start)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Lovable Cloud](https://img.shields.io/badge/Lovable%20Cloud-PostgreSQL%20RLS-3ECF8E?style=for-the-badge&logo=postgresql&logoColor=white)](https://lovable.dev)
[![Vitest](https://img.shields.io/badge/Testes-Vitest-FCC72B?style=for-the-badge&logo=vitest&logoColor=black)](https://vitest.dev/)

---

## 📌 Sumário
1. [Sobre o Projeto](#-sobre-o-projeto)
2. [A Dor de Negócio & Oportunidade](#️-a-dor-de-negócio--oportunidade)
3. [Tese do MVP & Validação](#-tese-do-mvp--validação)
4. [Tamanho de Mercado (TAM, SAM e SOM)](#-tamanho-de-mercado-tam-sam-e-som)
5. [Business Model Canvas](#-business-model-canvas)
6. [O que é Automático vs. O que é Manual](#️-o-que-é-automático-vs-o-que-é-manual)
7. [Arquitetura & Stack Tecnológica](#️-arquitetura--stack-tecnológica)
8. [Segurança e Políticas de Banco (RLS)](#-segurança-e-políticas-de-banco-rls)
9. [Mega Prompt & Iterações com IA](#-mega-prompt--iterações-com-ia)
10. [Demonstração & Telas do Sistema](#-demonstração--telas-do-sistema)
11. [Acesso à Aplicação & Execução Local](#-acesso-à-aplicação--execução-local)
12. [Roadmap de Evolução](#-roadmap-de-evolução)
13. [Autor & Créditos](#-autor--créditos)

---

## 💡 Sobre o Projeto

O **PrevTI** é uma plataforma digital voltada para consultórios odontológicos, clínicas médicas, escritórios contábeis e bancas de advocacia contratarem **planos recorrentes de suporte e manutenção preventiva de TI**.

Em vez do modelo tradicional reativo ("quebrou, chama o técnico"), que gera horas de paralisação e custos imprevisíveis, o PrevTI propõe previsibilidade orçamentária, rotinas ativas de auditoria de backup e equipamentos operando em alta performance contínua.

A aplicação conta com dois ecossistemas integrados:
1. **Área Pública:** Landing Page de alta conversão, simulador interativo de planos com cálculo instantâneo e modal de confirmação com conexão direta ao WhatsApp.
2. **Área Administrativa Restrita (`/admin`):** Dashboard com MRR estimado, Funil de Vendas (Kanban com faturamento por etapa), Agenda Técnica de Visitas Preventivas e Configurações/Notificações.

---

## ⚠️ A Dor de Negócio & Oportunidade

* **A Dor Real:** Clínicas e escritórios dependem integralmente de prontuários eletrônicos, certificados digitais A1/A3, servidores locais e impressoras de rede. Quando uma estação falha ou um backup se corrompe, a operação para imediatamente — consultas canceladas, prazos perdidos e prejuízo financeiro.
* **A Falha dos Modelos Existentes:**
  * *Técnico Autônomo ("Break-Fix"):* cobra por chamado avulso emergencial, atua só depois do problema e não possui SLA formal.
  * *Grandes MSPs (Outsourcing Corporativo):* exigem contratos de alto valor mínimo, inviáveis para estruturas de 3 a 20 computadores.
* **A Oportunidade do PrevTI:** plano modular transparente por estação (R$ 50/PC/mês), adicionais claros para Servidor/NAS e Backup em Nuvem redundante, contratação sem atrito e diagnóstico gratuito inicial.

---

## 🎯 Tese do MVP & Validação

> **Tese Principal:** pequenas clínicas e escritórios contratam planos recorrentes de TI preventiva se tiverem clareza dos custos em tempo real e puderem iniciar o relacionamento sem atrito com uma avaliação gratuita no WhatsApp.

### O que o MVP valida
1. **Interesse de conversão:** se os visitantes usam o simulador para descobrir o plano adequado (Start, Pro ou Corporate).
2. **Captação de leads qualificados:** nome, empresa, e-mail, WhatsApp, segmento e infraestrutura (quantidade de PCs, servidor e backup).
3. **Engajamento no fechamento:** se os contatos convertem na visita diagnóstica para assinatura do plano mensal.

---

## 📊 Tamanho de Mercado (TAM, SAM e SOM)

| Métrica | Escopo | Dimensão Estimada |
| :--- | :--- | :--- |
| **TAM** *(Total Addressable Market)* | Micro e pequenas empresas de serviços, consultorias e clínicas do Brasil dependentes de TI. | **~3,8 milhões** de empresas |
| **SAM** *(Serviceable Available Market)* | Clínicas, consultórios e escritórios nos principais polos urbanos da região de atuação direta. | **~50.000** estabelecimentos |
| **SOM** *(Serviceable Obtainable Market)* | Negócios com 3 a 15 estações em bairros comerciais estratégicos no primeiro ciclo do MVP. | Meta inicial: **15 a 20 contratos ativos** (Ticket Médio: R$ 350 – R$ 750/mês) |

---

## 📋 Business Model Canvas

| Bloco | Definição para o PrevTI |
| :--- | :--- |
| **Proposta de Valor** | Manutenção preventiva ativa, backups monitorados e zero inatividade por valor fixo mensal. |
| **Segmento de Clientes** | Clínicas médicas, consultórios odontológicos, escritórios contábeis e bancas de advocacia (3 a 20 máquinas). |
| **Canais** | Landing Page responsiva, simulação interativa, prospecção direta B2B e WhatsApp. |
| **Relacionamento** | Consultivo, preventivo e próximo, com relatórios periódicos de saúde dos equipamentos. |
| **Fontes de Receita** | Assinatura mensal (R$ 50/máquina + R$ 150 Servidor/NAS + R$ 90 Backup Nuvem) + onboarding opcional. |
| **Recursos-Chave** | Ferramentas de monitoramento/acesso remoto, checklist preventivo e painel administrativo. |
| **Atividades-Chave** | Manutenções programadas, auditoria periódica de backups e suporte ágil de primeiro nível. |
| **Parcerias-Chave** | Fornecedores de hardware, provedores de backup em nuvem e administradoras de condomínios comerciais. |
| **Estrutura de Custos** | Deslocamento técnico, licenças de ferramentas e hospedagem da aplicação. |

---

## ⚙️ O que é Automático vs. O que é Manual

### No Sistema (Automatizado)
- [x] Landing Page responsiva com comparativo Reativo vs. Preventivo.
- [x] Cálculo dinâmico do plano e valor no simulador, com explicações didáticas para Servidor/NAS e Backup em Nuvem.
- [x] Gravação instantânea do lead com validação de dados (Zod).
- [x] Modal de confirmação com link universal do WhatsApp (`wa.me`, DDI 55 automático).
- [x] Painel administrativo com login seguro, métricas de MRR, Kanban com arrastar e soltar e agenda técnica.
- [x] Configuração do WhatsApp de atendimento e base pronta para e-mails transacionais.

### Na Operação (Manual de Propósito)
- [ ] Atendimento humano consultivo no WhatsApp e alinhamento de horários.
- [ ] Envio do link de pagamento (PIX, boleto ou cartão).
- [ ] Execução da primeira auditoria de diagnóstico gratuito.
- [ ] Assinatura do termo de prestação de serviços e onboarding.

---

## 🛠️ Arquitetura & Stack Tecnológica

```text
┌─────────────────────────────────────────────────────────────┐
│                 Navegador do Usuário / Client               │
│   Landing Page • Simulador Interativo • Painel /admin       │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼──────────────────────────────┐
│      TanStack Start v1 (React 19 + Vite 7 + Tailwind v4)    │
│   • Roteamento tipado por arquivos   • shadcn/ui            │
│   • Regras de preço centralizadas    • Testes Vitest        │
└──────────────────────────────┬──────────────────────────────┘
                               │ Auth JWT + Políticas RLS
┌──────────────────────────────▼──────────────────────────────┐
│           Lovable Cloud (PostgreSQL Gerenciado)             │
│   • leads                   • preventive_schedules          │
│   • system_settings         • user_roles (has_role admin)   │
└─────────────────────────────────────────────────────────────┘
```

* **Front-end & Framework:** [TanStack Start v1](https://tanstack.com/start) com **React 19** e **Vite 7**.
* **Design System:** **Tailwind CSS v4** + **shadcn/ui**, tipografia **Manrope** + **Sora**, ícones **Lucide**.
* **Backend & Banco de Dados:** **Lovable Cloud** (PostgreSQL com Row Level Security).
* **Autenticação:** e-mail/senha com recuperação de senha, visualização de senha e proteção das rotas `/admin/*`.
* **Testes:** **Vitest** cobrindo precificação, sugestão de plano e sanitização do link do WhatsApp (`src/lib/pricing.test.ts`).

### Estrutura principal

```text
src/
├── components/          # Logo, diálogos do admin e UI (shadcn)
├── lib/
│   ├── pricing.ts       # Regras de preço, planos e WhatsApp
│   ├── pricing.test.ts  # Testes unitários das regras
│   └── admin-data.ts    # Consultas do painel
└── routes/
    ├── index.tsx        # Landing Page + Simulador
    ├── login.tsx        # Login / recuperação
    ├── reset-password.tsx
    └── _authenticated/  # Painel /admin (dashboard, leads, agenda, configurações)
```

---

## 🔒 Segurança e Políticas de Banco (RLS)

* **`leads`:** visitantes anônimos só podem **inserir** simulações; leitura, edição e exclusão são exclusivas de administradores.
* **`preventive_schedules`:** acesso exclusivo de administradores autenticados.
* **`system_settings`:** visitantes leem apenas `whatsapp_number` e `whatsapp_default_message`; chaves privadas (ex.: `admin_alert_email`) são visíveis só para administradores.
* **`has_role()`:** função `SECURITY DEFINER` que valida o papel administrativo na tabela protegida `user_roles`.

---

## 🤖 Mega Prompt & Iterações com IA

### Prompt Principal Inicial

```markdown
Crie uma aplicação web moderna, responsiva e segura chamada PrevTI - Plataforma de Assinatura de Suporte e TI Preventiva voltada para consultórios odontológicos, clínicas médicas e escritórios contábeis/advocacia.

A aplicação possui dois ecossistemas integrados:
1. Área Pública (Landing Page + Simulador Dinâmico + Conversão WhatsApp)
2. Área Administrativa Restrita (/admin com Auth, CRUD completo, Gestão de Clientes/Leads, Agenda Técnica e Configurações)

### Identidade Visual & Design System:
- Estilo: B2B SaaS corporativo, confiável, tecnológico e limpo.
- Paleta: Azul Marinho (#0F172A / #1E293B), Azul Royal (#2563EB), Verde Esmeralda (#10B981), fundo #F8FAFC, cartões #FFFFFF, bordas #E2E8F0.
- UI: Tailwind CSS com componentes shadcn/ui.

### Banco de Dados (com RLS):
1. system_settings (id, key, value, updated_at)
2. leads (id, created_at, company_name, contact_name, whatsapp, email, business_type, pc_count, has_server, has_cloud_backup, suggested_plan, estimated_value, status, technical_notes)
3. preventive_schedules (id, lead_id FK, scheduled_date, scheduled_time, service_type, status)

### Área Pública:
- Header com logo (escudo), navegação por âncoras e botão "Acesso Técnico" para /login.
- Hero com comparativo Reativo vs. Preventivo.
- Simulador: slider de PCs (1-30, R$50/PC/mês), Servidor (+R$150) e Backup Nuvem (+R$90), plano Start/Pro/Corporate em tempo real, formulário que salva em leads e abre wa.me.
- Como Funciona, Depoimentos e FAQ em acordeão.

### Painel Administrativo (/admin):
- Sidebar: Dashboard, Clientes & Leads, Agenda Preventiva, Configurações, Sair.
- Dashboard: Total Leads, Novos Contatos, Contratos Ativos, MRR Estimado e próximas visitas.
- Clientes & Leads: Tabela e Funil/Kanban por status, criação, edição, exclusão e agendamento.
- Agenda: agrupada por data, filtro por status e conclusão de visitas.
- Configurações: edição do WhatsApp e mensagem padrão.
```

### Iterações e Melhorias Desenvolvidas
1. **Login aprimorado:** ícone de mostrar/ocultar senha e conta de administrador configurada.
2. **Linguagem acessível:** explicações por clique (funcionam no celular) sobre Servidor/NAS e Backup em Nuvem no simulador e no FAQ.
3. **Link do WhatsApp robusto:** limpeza do telefone com DDI 55 automático e `encodeURIComponent` na mensagem.
4. **Pop-up de confirmação:** modal "Recebemos sua simulação!" sem abrir abas automaticamente (evita bloqueadores).
5. **Campo de e-mail:** coleta e validação no simulador, exibido na gestão de leads.
6. **Notificações em Configurações:** e-mail de alerta do gestor e checklist para ativar e-mails transacionais.
7. **Funil responsivo:** colunas de largura fixa com rolagem horizontal e total de R$/mês por etapa.
8. **Blindagem RLS:** separação entre configurações públicas (WhatsApp) e privadas (e-mail do administrador).

---

## 📸 Demonstração & Telas do Sistema

| Área | Descrição |
| :--- | :--- |
| **Landing Page** | Proposta de valor, comparativo Reativo vs. Preventivo e depoimentos. |
| **Simulador Interativo** | Quantidade de PCs, adicionais de servidor/backup e cálculo em tempo real. |
| **Modal de Confirmação** | Confirmação da simulação e atalho para o WhatsApp. |
| **Funil de Leads (Kanban)** | Etapas de venda com soma de R$/mês e arrastar e soltar. |
| **Agenda Técnica** | Visitas diagnósticas e preventivas vinculadas a clientes. |
| **Configurações** | Número de atendimento e canais de notificação. |

<!-- Adicione os prints em docs/prints/ e descomente:-->
#### Landing Page
![Landing Page](https://github.com/user-attachments/assets/86754171-8286-4345-8480-a120c8137fe6/)
#### Simulador de Planos
![Simulador](https://github.com/user-attachments/assets/4a545b0c-b742-412a-a47c-80a28d54e9b8)
#### Funil de Leads (Kanban)
![Funil de Leads](https://github.com/user-attachments/assets/f502b59c-8406-406f-9929-a1fcc9cbca71)
#### Configurações do Sistema
![Configurações](https://github.com/user-attachments/assets/be94bcf4-dab2-41f2-a13b-dd7e49d39d5f)


---

## 🔗 Acesso à Aplicação & Execução Local

### Aplicação Online
* **URL Pública:** [https://prevtipilot.lovable.app](https://prevtipilot.lovable.app)
* **Acesso Administrativo:** `/login` (redireciona para `/admin` após autenticar)

### Executando Localmente

Requisitos: [Node.js](https://nodejs.org/) 18+ ou [Bun](https://bun.sh/).

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd prevti

# 2. Instale as dependências
bun install   # ou npm install

# 3. Inicie o servidor de desenvolvimento
bun dev       # ou npm run dev

# 4. Execute os testes
bunx vitest run
```

---

## 🚀 Roadmap de Evolução

- [ ] Domínio próprio (`prevti.com.br`) e ativação dos e-mails automáticos (proposta ao cliente e alerta ao gestor).
- [ ] Alerta instantâneo ao gestor via Telegram ou webhook (n8n / Evolution API).
- [ ] Gateway de pagamentos (Asaas / Stripe) para cobrança recorrente.
- [ ] Portal do Cliente com abertura de chamados e relatórios de saúde de TI.
- [ ] Termos de Uso e Política de Privacidade (LGPD).

---

## 👤 Autor & Créditos

Projeto concebido e desenvolvido por **Sidney Pereira da Silva** como parte do Desafio de Produto Digital da **Digital Innovation One (DIO)**, com apoio de IA (Gemini e Lovable).
