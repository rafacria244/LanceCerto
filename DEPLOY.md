# 🚀 Guia de Deploy - LanceCerto

Este documento fornece instruções detalhadas para fazer o deploy do LanceCerto em produção.

## Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Deploy com Docker](#deploy-com-docker)
3. [Deploy na Vercel (Frontend)](#deploy-na-vercel-frontend)
4. [Deploy no Render/Railway (Backend)](#deploy-no-renderrailway-backend)
5. [Configuração de Variáveis de Ambiente](#configuração-de-variáveis-de-ambiente)
6. [Configuração de Serviços Externos](#configuração-de-serviços-externos)
7. [Monitoramento e Logs](#monitoramento-e-logs)
8. [Troubleshooting](#troubleshooting)

## Pré-requisitos

Antes de fazer o deploy, certifique-se de ter:

- [ ] Conta no Supabase com projeto configurado
- [ ] Conta no Stripe com produtos criados
- [ ] API Key do Google Gemini
- [ ] Conta na Vercel (para frontend)
- [ ] Conta no Render ou Railway (para backend)
- [ ] Git instalado e repositório no GitHub

## Deploy com Docker

### Desenvolvimento Local

Para testar o ambiente completo com Docker:

```bash
# Copiar arquivo de exemplo
cp server/.env.example server/.env

# Editar variáveis de ambiente
nano server/.env

# Build e iniciar containers
docker-compose up --build
```

Acesse:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Produção com Docker

Para deploy em servidor próprio:

```bash
# Build das imagens
docker build -t lancecerto-server:latest ./server
docker build -t lancecerto-client:latest ./client

# Executar containers
docker run -d \
  --name lancecerto-server \
  --env-file server/.env \
  -p 3001:3001 \
  lancecerto-server:latest

docker run -d \
  --name lancecerto-client \
  -p 80:80 \
  lancecerto-client:latest
```

## Deploy na Vercel (Frontend)

### 1. Conectar Repositório

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe seu repositório do GitHub
4. Selecione o repositório `LanceCerto`

### 2. Configurar Build

- **Framework Preset:** Vite
- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 3. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis em "Environment Variables":

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave_aqui
VITE_STRIPE_PRICE_STARTER=price_starter_id
VITE_STRIPE_PRICE_PREMIUM=price_premium_id
VITE_API_URL=https://seu-backend.onrender.com
```

### 4. Deploy

Clique em "Deploy" e aguarde o build completar.

## Deploy no Render/Railway (Backend)

### Render

#### 1. Criar Web Service

1. Acesse [render.com](https://render.com)
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Selecione o repositório `LanceCerto`

#### 2. Configurar Service

- **Name:** lancecerto-api
- **Root Directory:** `server`
- **Environment:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** Free (para testes) ou Starter (produção)

#### 3. Adicionar Variáveis de Ambiente

```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-frontend.vercel.app
LOG_LEVEL=info

GEMINI_API_KEY=sua_chave_gemini
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

STRIPE_SECRET_KEY=sk_live_sua_chave_secreta
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret
STRIPE_PRICE_STARTER=price_starter_id
STRIPE_PRICE_PREMIUM=price_premium_id
```

#### 4. Deploy

Clique em "Create Web Service" e aguarde o deploy.

### Railway

Processo similar ao Render:

1. Acesse [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Configure as mesmas variáveis de ambiente
4. Railway detectará automaticamente o Node.js

## Configuração de Variáveis de Ambiente

### Frontend (client/.env)

```bash
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave
VITE_STRIPE_PRICE_STARTER=price_id_starter
VITE_STRIPE_PRICE_PREMIUM=price_id_premium

# API
VITE_API_URL=https://seu-backend.onrender.com
```

### Backend (server/.env)

```bash
# Server
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-frontend.vercel.app
LOG_LEVEL=info

# Gemini AI
GEMINI_API_KEY=sua_chave_gemini

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_live_sua_chave_secreta
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret
STRIPE_PRICE_STARTER=price_id_starter
STRIPE_PRICE_PREMIUM=price_id_premium
```

## Configuração de Serviços Externos

### Supabase

1. **Executar Schema SQL**
   - Acesse SQL Editor no Supabase
   - Execute o conteúdo de `server/supabase-schema.sql`

2. **Configurar Google OAuth**
   - Authentication → Providers → Google
   - Adicione Client ID e Secret
   - Configure URLs de redirecionamento:
     - `https://seu-projeto.supabase.co/auth/v1/callback`
     - `https://seu-frontend.vercel.app/gerar`

3. **Verificar RLS**
   - Certifique-se de que Row Level Security está ativo
   - Verifique as políticas de acesso

### Stripe

1. **Mudar para Modo Live**
   - Ative sua conta Stripe
   - Mude para modo "Live" (não "Test")

2. **Criar Produtos**
   - Products → Add Product
   - Criar "LanceCerto Starter" - R$ 49,99/mês
   - Criar "LanceCerto Premium" - R$ 99,99/mês
   - Copiar os Price IDs (começam com `price_`)

3. **Configurar Webhook**
   - Developers → Webhooks → Add endpoint
   - URL: `https://seu-backend.onrender.com/api/webhook`
   - Eventos:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copiar o Signing Secret

### Google Gemini

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma API Key
3. Copie a chave para `GEMINI_API_KEY`

## Monitoramento e Logs

### Logs do Backend

Os logs são salvos em:
- `server/logs/error.log` - Apenas erros
- `server/logs/combined.log` - Todos os logs

Para visualizar logs em produção:
- **Render:** Dashboard → Logs
- **Railway:** Project → Deployments → View Logs

### Métricas

Monitore:
- Taxa de erro de requisições
- Tempo de resposta da API
- Uso de propostas por plano
- Taxa de conversão de checkout

### Alertas

Configure alertas para:
- Erros 500 frequentes
- Webhook do Stripe falhando
- API do Gemini retornando erros
- Banco de dados indisponível

## Troubleshooting

### Frontend não conecta ao Backend

**Problema:** CORS error ou Network error

**Solução:**
1. Verifique se `VITE_API_URL` está correto
2. Verifique se CORS está habilitado no backend
3. Certifique-se de que o backend está rodando

### Webhook do Stripe não funciona

**Problema:** Webhook retorna erro 400

**Solução:**
1. Verifique se `STRIPE_WEBHOOK_SECRET` está correto
2. Certifique-se de que a URL do webhook está correta
3. Verifique os logs do Stripe Dashboard

### Erro ao gerar proposta

**Problema:** "API Key do Gemini não configurada"

**Solução:**
1. Verifique se `GEMINI_API_KEY` está configurada
2. Certifique-se de que a chave é válida
3. Verifique se há créditos disponíveis

### Usuário não consegue fazer login

**Problema:** Redirect loop ou erro de autenticação

**Solução:**
1. Verifique URLs de redirecionamento no Supabase
2. Certifique-se de que Google OAuth está configurado
3. Verifique se `SUPABASE_URL` e `SUPABASE_ANON_KEY` estão corretos

## Checklist Pós-Deploy

- [ ] Frontend está acessível e responsivo
- [ ] Backend está respondendo em `/api/health`
- [ ] Login com Google funciona
- [ ] Geração de proposta funciona
- [ ] Checkout do Stripe funciona
- [ ] Webhook do Stripe está recebendo eventos
- [ ] Logs estão sendo gerados
- [ ] Certificado SSL está ativo (HTTPS)
- [ ] Domínio customizado configurado (opcional)
- [ ] Backup do banco de dados configurado

## Suporte

Para problemas ou dúvidas:
- Abra uma issue no GitHub
- Consulte a documentação do Supabase, Stripe e Gemini
- Verifique os logs de erro

---

**Última atualização:** 15 de novembro de 2025
