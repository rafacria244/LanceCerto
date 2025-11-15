# 🔧 Guia de Configuração Completo - LanceCerto

Este guia detalha todos os passos necessários para configurar e lançar o LanceCerto com autenticação Supabase e pagamentos Stripe.

## 📋 Pré-requisitos

Antes de começar, você precisará criar contas e obter chaves de API dos seguintes serviços:

1. **Supabase** (https://supabase.com) - Banco de dados e autenticação
2. **Stripe** (https://stripe.com) - Processamento de pagamentos
3. **Google AI Studio** (https://makersuite.google.com) - API do Gemini

## 1️⃣ Configuração do Supabase

### Passo 1: Criar Projeto no Supabase

1. Acesse https://app.supabase.com
2. Clique em "New Project"
3. Preencha os dados:
   - **Name**: LanceCerto (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte e guarde-a
   - **Region**: Escolha a região mais próxima (ex: South America - São Paulo)
4. Clique em "Create new project" e aguarde a criação (leva alguns minutos)

### Passo 2: Executar o Schema do Banco de Dados

1. No painel do Supabase, vá em **SQL Editor** (menu lateral)
2. Clique em "New Query"
3. Copie todo o conteúdo do arquivo `server/supabase-schema.sql`
4. Cole no editor SQL
5. Clique em "Run" para executar o script
6. Verifique se todas as tabelas foram criadas com sucesso

### Passo 3: Configurar Google OAuth

1. No painel do Supabase, vá em **Authentication** > **Providers**
2. Localize "Google" na lista de provedores
3. Ative o toggle "Enable Sign in with Google"
4. Siga as instruções para criar credenciais OAuth no Google Cloud Console:
   - Acesse https://console.cloud.google.com
   - Crie um novo projeto ou selecione um existente
   - Vá em "APIs & Services" > "Credentials"
   - Clique em "Create Credentials" > "OAuth 2.0 Client ID"
   - Configure a tela de consentimento se necessário
   - Tipo de aplicativo: "Web application"
   - Adicione as URLs de redirecionamento fornecidas pelo Supabase
   - Copie o **Client ID** e **Client Secret**
5. Cole as credenciais no Supabase e salve

### Passo 4: Obter Chaves da API

1. No painel do Supabase, vá em **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon public** key (começa com "eyJ...")
   - **service_role** key (começa com "eyJ..." - **NUNCA exponha esta chave no frontend!**)

## 2️⃣ Configuração do Stripe

### Passo 1: Criar Conta e Ativar Modo de Teste

1. Acesse https://dashboard.stripe.com
2. Crie uma conta ou faça login
3. Certifique-se de que está em **modo de teste** (toggle no canto superior direito)

### Passo 2: Criar Produtos e Preços

1. No dashboard do Stripe, vá em **Products** > **Add product**
2. Crie o primeiro produto:
   - **Name**: LanceCerto Starter
   - **Description**: 30 propostas por mês com personalização avançada
   - **Pricing model**: Standard pricing
   - **Price**: R$ 49,99 (ou 49.99 BRL)
   - **Billing period**: Monthly
   - **Payment type**: Recurring
3. Clique em "Save product"
4. Copie o **Price ID** (começa com "price_...")
5. Repita o processo para o segundo produto:
   - **Name**: LanceCerto Premium
   - **Description**: Propostas ilimitadas com planejador de projetos
   - **Price**: R$ 99,99 (ou 99.99 BRL)
   - **Billing period**: Monthly
6. Copie o **Price ID** do Premium

### Passo 3: Obter Chaves da API

1. No dashboard do Stripe, vá em **Developers** > **API keys**
2. Copie as seguintes chaves:
   - **Publishable key** (começa com "pk_test_...") - para o frontend
   - **Secret key** (começa com "sk_test_...") - para o backend

### Passo 4: Configurar Webhook

O webhook permite que o Stripe notifique seu backend sobre eventos de pagamento.

**Para desenvolvimento local (usando Stripe CLI):**

1. Instale o Stripe CLI: https://stripe.com/docs/stripe-cli
2. Execute `stripe login` para autenticar
3. Execute `stripe listen --forward-to http://localhost:3001/api/webhook`
4. Copie o **webhook signing secret** (começa com "whsec_...")

**Para produção:**

1. No dashboard do Stripe, vá em **Developers** > **Webhooks**
2. Clique em "Add endpoint"
3. **Endpoint URL**: `https://seu-backend.com/api/webhook`
4. Selecione os eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Clique em "Add endpoint"
6. Copie o **Signing secret** (começa com "whsec_...")

## 3️⃣ Configuração do Google Gemini

### Passo 1: Obter API Key

1. Acesse https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Selecione um projeto do Google Cloud ou crie um novo
5. Copie a **API Key** gerada

## 4️⃣ Configurar Variáveis de Ambiente

### Frontend (client/.env)

Crie o arquivo `client/.env` com o seguinte conteúdo:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_STRIPE_PRICE_STARTER=price_xxxxx
VITE_STRIPE_PRICE_PREMIUM=price_xxxxx

# API Configuration (opcional para desenvolvimento)
VITE_API_URL=http://localhost:3001
```

**Substitua:**
- `VITE_SUPABASE_URL` pela URL do seu projeto Supabase
- `VITE_SUPABASE_ANON_KEY` pela chave anon public do Supabase
- `VITE_STRIPE_PUBLISHABLE_KEY` pela chave publishable do Stripe
- `VITE_STRIPE_PRICE_STARTER` pelo Price ID do plano Starter
- `VITE_STRIPE_PRICE_PREMIUM` pelo Price ID do plano Premium

### Backend (server/.env)

Crie o arquivo `server/.env` com o seguinte conteúdo:

```env
# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# Gemini AI Configuration
GEMINI_API_KEY=AIzaSyxxxxx

# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_STARTER=price_xxxxx
STRIPE_PRICE_PREMIUM=price_xxxxx
```

**Substitua:**
- `GEMINI_API_KEY` pela sua API Key do Google Gemini
- `SUPABASE_URL` pela URL do seu projeto Supabase
- `SUPABASE_SERVICE_ROLE_KEY` pela chave service_role do Supabase
- `STRIPE_SECRET_KEY` pela chave secret do Stripe
- `STRIPE_WEBHOOK_SECRET` pelo signing secret do webhook
- `STRIPE_PRICE_STARTER` pelo Price ID do plano Starter
- `STRIPE_PRICE_PREMIUM` pelo Price ID do plano Premium

## 5️⃣ Instalar Dependências e Executar

### Instalação

No diretório raiz do projeto, execute:

```bash
npm run install:all
```

Este comando instalará as dependências do frontend e backend.

### Execução em Desenvolvimento

No diretório raiz, execute:

```bash
npm run dev
```

Isso iniciará:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

### Testar a Aplicação

1. Abra http://localhost:3000 no navegador
2. Clique em "Entrar" e faça login com Google
3. Após o login, você será redirecionado para a página de geração
4. Preencha o formulário e gere uma proposta
5. Teste os planos pagos usando cartões de teste do Stripe:
   - Número: `4242 4242 4242 4242`
   - Data: Qualquer data futura
   - CVC: Qualquer 3 dígitos
   - CEP: Qualquer CEP válido

## 6️⃣ Deploy em Produção

### Frontend (Vercel)

1. Crie uma conta em https://vercel.com
2. Conecte seu repositório GitHub
3. Configure o projeto:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
   - `VITE_STRIPE_PRICE_STARTER`
   - `VITE_STRIPE_PRICE_PREMIUM`
   - `VITE_API_URL` (URL do seu backend em produção)
5. Faça o deploy

### Backend (Render ou Railway)

**Usando Render:**

1. Crie uma conta em https://render.com
2. Clique em "New +" > "Web Service"
3. Conecte seu repositório
4. Configure:
   - **Name**: lancecerto-api
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Adicione todas as variáveis de ambiente do `server/.env`
6. Atualize `FRONTEND_URL` com a URL do seu frontend na Vercel
7. Faça o deploy

**Usando Railway:**

1. Crie uma conta em https://railway.app
2. Clique em "New Project" > "Deploy from GitHub repo"
3. Selecione seu repositório
4. Configure:
   - **Root Directory**: `server`
   - **Start Command**: `npm start`
5. Adicione todas as variáveis de ambiente
6. Faça o deploy

### Atualizar Webhook do Stripe

Após o deploy do backend:

1. Vá em **Developers** > **Webhooks** no Stripe
2. Adicione um novo endpoint com a URL do seu backend em produção
3. Exemplo: `https://lancecerto-api.onrender.com/api/webhook`
4. Copie o novo signing secret e atualize a variável `STRIPE_WEBHOOK_SECRET` no backend

### Atualizar URLs de Redirecionamento do Supabase

1. No painel do Supabase, vá em **Authentication** > **URL Configuration**
2. Adicione a URL do seu frontend em produção em **Site URL**
3. Adicione as URLs de redirecionamento:
   - `https://seu-dominio.vercel.app/**`
   - `https://seu-dominio.vercel.app/gerar`

## 7️⃣ Checklist Final

Antes de lançar, verifique:

- [ ] Todas as variáveis de ambiente estão configuradas
- [ ] Schema do Supabase foi executado com sucesso
- [ ] Google OAuth está funcionando
- [ ] Produtos e preços do Stripe foram criados
- [ ] Webhook do Stripe está configurado e funcionando
- [ ] Gemini API Key está válida e funcionando
- [ ] Frontend e backend estão se comunicando corretamente
- [ ] Fluxo de pagamento está funcionando (teste com cartão de teste)
- [ ] Limites de propostas estão sendo respeitados
- [ ] Histórico de propostas está sendo salvo
- [ ] URLs de produção foram atualizadas no Supabase e Stripe

## 🆘 Solução de Problemas

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env` existe no diretório `client/`
- Confirme que as variáveis começam com `VITE_`
- Reinicie o servidor de desenvolvimento

### Erro: "GEMINI_API_KEY is not defined"
- Verifique se o arquivo `.env` existe no diretório `server/`
- Confirme que a API Key está correta
- Reinicie o servidor backend

### Erro no webhook do Stripe
- Verifique se o signing secret está correto
- Confirme que a URL do webhook está acessível
- Use o Stripe CLI para testar localmente

### Erro de autenticação do Supabase
- Verifique se o Google OAuth está configurado corretamente
- Confirme que as URLs de redirecionamento estão corretas
- Verifique se o schema do banco foi executado

### Limite de propostas não está funcionando
- Verifique se a tabela `subscriptions` foi criada
- Confirme que o trigger `on_auth_user_created` está ativo
- Verifique se novos usuários têm registro na tabela `subscriptions`

## 📞 Suporte

Se encontrar problemas não listados aqui, verifique:
- Logs do console do navegador (F12)
- Logs do servidor backend
- Logs do Supabase (SQL Editor > Logs)
- Dashboard do Stripe (Developers > Logs)

---

**Parabéns!** Seu SaaS está pronto para ser lançado! 🚀
