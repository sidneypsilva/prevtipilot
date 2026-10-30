# 🧠 Engenharia de Prompts — PrevTI

Esta pasta registra a evolução da especificação do PrevTI: do MVP conceitual à versão em produção.

- [Mega Prompt v1.0 — MVP Inicial (Conceito Gemini)](./mega-prompt-v1-mvp.md)
- [Mega Prompt v2.0 — Versão Produção (PrevTI Atual)](./mega-prompt-v2-producao.md)

## 📊 Resumo das Diferenças

| Área | Versão 1.0 (MVP Gemini) | Versão 2.0 (PrevTI Produção) |
| :--- | :--- | :--- |
| **Pipeline Comercial** | Apenas tabela de listagem simples | **Visão dupla: Tabela + Kanban com Drag-and-Drop e MRR por etapa** |
| **Conversão WhatsApp** | `window.open` direto (bloqueado por navegadores) | **Modal de confirmação anti-bloqueio com botão de abertura segura** |
| **Captura de Dados** | Nome, Empresa, Telefone e Segmento | **Inclusão do campo E-mail profissional com validação RFC/Zod** |
| **Configurações Admin** | Apenas número do WhatsApp | **WhatsApp + Módulo de Alertas por E-mail + Régua de ativação de domínio** |
| **Segurança RLS** | Leitura aberta de `system_settings` | **RLS Granular dividindo dados públicos e dados sensíveis do admin** |
| **UX Educativa** | Nenhuma explicação no simulador | **Explicações didáticas inline nos switches + FAQ detalhado para leigos** |
