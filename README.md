# 🚀 LanceCerto.ai

**Menos tempo escrevendo, mais tempo faturando.**

Plataforma web completa que ajuda freelancers a gerar propostas comerciais personalizadas com inteligência artificial em segundos.

## 📋 Sobre o Projeto

O LanceCerto é um Micro-SaaS que reduz o tempo que freelancers gastam escrevendo propostas de **30 minutos para 30 segundos** e aumenta suas taxas de conversão em **5x**.

### Funcionalidades

- ✅ Landing page moderna e de alta conversão
- ✅ Geração de propostas personalizadas com IA (Gemini 2.5 Flash)
- ✅ Sistema de autenticação com Supabase (Google OAuth)
- ✅ Planos de assinatura (Free, Starter, Premium)
- ✅ Integração completa com Stripe para pagamentos
- ✅ Histórico de propostas salvo no Supabase
- ✅ Limites de uso baseados no plano
- ✅ Interface limpa, intuitiva e responsiva

## 🛠️ Tecnologias

- **Frontend**: React + Vite + TailwindCSS + React Router
- **Backend**: Node.js + Express
- **IA**: Google Gemini 2.5 Flash
- **Autenticação**: Supabase Auth
- **Banco de Dados**: Supabase (PostgreSQL)
- **Pagamentos**: Stripe
- **Deploy**: Vercel (frontend) + Render/Railway (backend)

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Google AI Studio (Gemini API)
- Projeto no Supabase
- Conta no Stripe

### Passos

1. **Clone o repositório** (ou baixe os arquivos)

2. **Instale as dependências**:
   ```bash
   npm run install:all
   ```

3. **Configure o Supabase**:
   
   - Crie um projeto em https://app.supabase.com
   - Execute o SQL em `server/supabase-schema.sql` no SQL Editor do Supabase
   - Configure Google OAuth em Authentication > Providers
   - Copie a URL e Anon Key

4. **Configure as variáveis de ambiente**:

   **Frontend (`client/.env`)**:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave
   VITE_STRIPE_PRICE_STARTER=price_starter_id
   VITE_STRIPE_PRICE_PREMIUM=price_premium_id
   ```

   **Backend (`server/.env`)**:
   ```env
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   GEMINI_API_KEY=sua_chave_gemini
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
   STRIPE_SECRET_KEY=sk_test_sua_chave_secreta
   STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret
   STRIPE_PRICE_STARTER=price_starter_id
   STRIPE_PRICE_PREMIUM=price_premium_id
   ```

5. **Configure o Stripe**:
   
   - Crie produtos no Stripe Dashboard
   - Crie preços recorrentes (mensais) para Starter e Premium
   - Configure webhook em Developers > Webhooks
   - URL do webhook: `https://seu-backend.com/api/webhook`
   - Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

6. **Execute o projeto**:
   ```bash
   npm run dev
   ```
   
   Isso iniciará:
   - Frontend em `http://localhost:3000`
   - Backend em `http://localhost:3001`

## 🚀 Deploy

### Frontend (Vercel)

1. Conecte seu repositório na Vercel
2. Configure as variáveis de ambiente
3. Build Command: `cd client && npm install && npm run build`
4. Output Directory: `client/dist`

### Backend (Render/Railway)

1. Conecte seu repositório
2. Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
3. Adicione todas as variáveis de ambiente
4. Configure o webhook do Stripe apontando para sua URL

## 📝 Estrutura do Projeto

```
LanceCerto/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/          # Páginas (Home, Generate, Login)
│   │   ├── contexts/       # Context API (Auth)
│   │   └── lib/            # Bibliotecas (Supabase)
│   └── package.json
├── server/                 # Backend Node.js
│   ├── routes/             # Rotas (Stripe)
│   ├── index.js            # Servidor principal
│   └── supabase-schema.sql # Schema do banco
└── package.json
```

## 🎨 Planos

### 🆓 Free
- 1 proposta gerada
- Personalização básica
- Histórico de propostas

### 🚀 Starter - R$ 49,99/mês
- 30 propostas/mês
- Personalização avançada
- Exportação em múltiplos formatos
- Templates personalizáveis

### 💎 Premium - R$ 99,99/mês
- Propostas ilimitadas
- Planejador de Projetos com IA
- Geração automática de cronogramas
- Suporte prioritário

## 📄 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

Desenvolvido com ❤️ para freelancers

## 📦 Publicando no GitHub (guia rápido)

1. Crie um repositório no GitHub com o nome `Rafael` no usuário `Faelzin09663` (ou use `gh`):

```powershell
gh repo create Faelzin09663/Rafael --public --source=. --remote=origin --push
```

2. Se preferir criar pelo site, crie o repo e use `git remote add origin` como no passo abaixo.

3. Alternativamente, use o script de ajuda incluído para configurar remote e fazer o primeiro push:

```powershell
cd \path\to\repo
.\scripts\publish-to-github.ps1 -RepoOwner "Faelzin09663" -RepoName "Rafael"
```

4. O repositório é criado e o `main` receberá o código; o workflow de CI (`.github/workflows/node-ci.yml`) fará build do client e instalará dependências nas PRs.

> Observação: para autenticar, você pode usar um Personal Access Token (PAT) ou SSH. Veja `CORRIGIR_GIT_AUTH.md` e `configurar-git.ps1` para instruções detalhadas.
