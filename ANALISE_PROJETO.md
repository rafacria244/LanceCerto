# 📊 Análise do Projeto LanceCerto

## Visão Geral

O **LanceCerto** é um SaaS (Software as a Service) desenvolvido para ajudar freelancers a gerar propostas comerciais personalizadas usando inteligência artificial. O projeto já possui uma estrutura bem definida com frontend React, backend Node.js/Express, e integrações parciais com Supabase e Stripe.

## Estrutura Atual do Projeto

### Frontend (Client)
- **Framework**: React 18 + Vite
- **Estilização**: TailwindCSS
- **Roteamento**: React Router DOM
- **Autenticação**: Supabase Auth (Google OAuth)
- **Estado**: Context API (AuthContext)
- **HTTP Client**: Axios

### Backend (Server)
- **Framework**: Express.js
- **IA**: Google Gemini 2.5 Flash
- **Banco de Dados**: Supabase (PostgreSQL)
- **Pagamentos**: Stripe
- **Autenticação**: Supabase Service Role

### Banco de Dados (Supabase)
- **Tabelas**:
  - `profiles` - Perfis de usuários
  - `proposal_samples` - Amostras de propostas antigas
  - `jobs` - Jobs e propostas geradas
  - `subscriptions` - Assinaturas e planos dos usuários

## Status das Integrações

### ✅ Implementado

1. **Autenticação com Supabase**
   - Login com Google OAuth configurado
   - Context API para gerenciar estado de autenticação
   - Proteção de rotas implementada
   - Schema do banco de dados criado com RLS (Row Level Security)

2. **Geração de Propostas com IA**
   - Integração com Google Gemini 2.5 Flash
   - Prompt engineering para propostas personalizadas
   - Salvamento de propostas no banco de dados

3. **Sistema de Planos**
   - Free (1 proposta)
   - Starter (30 propostas/mês) - R$ 49,99
   - Premium (ilimitado) - R$ 99,99
   - Verificação de limites no backend

4. **Integração Stripe (Parcial)**
   - Criação de sessões de checkout
   - Webhook para eventos do Stripe
   - Atualização de assinaturas no banco

### ⚠️ Necessita Ajustes

1. **Configuração de Variáveis de Ambiente**
   - Faltam arquivos `.env` no cliente e servidor
   - Necessário configurar chaves de API

2. **Integração Stripe no Frontend**
   - Falta carregar o Stripe.js corretamente
   - Necessário adicionar script do Stripe no HTML

3. **Webhook do Stripe**
   - Necessita configuração especial para raw body
   - Conflito potencial com `express.json()`

4. **Criação Automática de Subscription**
   - Usuários novos precisam ter registro na tabela `subscriptions`
   - Falta trigger ou função para criar subscription no plano Free

5. **Verificação de Plano no Frontend**
   - Falta exibir plano atual do usuário
   - Falta mostrar contador de propostas restantes

## Pontos de Atenção

### Segurança
- ✅ RLS (Row Level Security) configurado
- ✅ Service Role Key usado apenas no backend
- ✅ Anon Key usado no frontend
- ⚠️ Webhook do Stripe precisa validar assinatura

### Performance
- ✅ Gemini 2.5 Flash é rápido
- ⚠️ Falta tratamento de rate limiting
- ⚠️ Falta cache de propostas

### UX/UI
- ✅ Interface limpa e responsiva
- ✅ Loading states implementados
- ⚠️ Falta feedback visual do plano atual
- ⚠️ Falta histórico de propostas na interface

## Próximos Passos

1. **Configurar Variáveis de Ambiente**
   - Criar arquivos `.env` com todas as chaves necessárias
   - Documentar processo de obtenção das chaves

2. **Corrigir Integração Stripe**
   - Adicionar Stripe.js ao HTML
   - Corrigir webhook com raw body parser
   - Testar fluxo completo de pagamento

3. **Implementar Criação Automática de Subscription**
   - Adicionar trigger no Supabase
   - Garantir que novos usuários tenham plano Free

4. **Melhorar Interface do Usuário**
   - Exibir plano atual e limites
   - Adicionar página de histórico
   - Implementar dashboard

5. **Testes e Validação**
   - Testar fluxo completo de autenticação
   - Testar geração de propostas
   - Testar upgrade de planos
   - Testar webhooks do Stripe

## Arquivos que Precisam ser Criados/Modificados

### Criar:
- `client/.env` - Variáveis de ambiente do frontend
- `server/.env` - Variáveis de ambiente do backend
- `client/index.html` - Adicionar script do Stripe.js

### Modificar:
- `server/index.js` - Corrigir webhook com raw body
- `server/supabase-schema.sql` - Adicionar trigger para subscription
- `client/src/pages/Generate.jsx` - Exibir plano e limites
- `client/src/components/landing/PlansSection.jsx` - Corrigir carregamento do Stripe

## Estimativa de Tempo

- ⏱️ Configuração de variáveis: 15 minutos
- ⏱️ Correções Stripe: 30 minutos
- ⏱️ Melhorias no banco: 20 minutos
- ⏱️ Melhorias na interface: 30 minutos
- ⏱️ Testes: 30 minutos

**Total estimado**: ~2 horas para deixar pronto para lançamento
