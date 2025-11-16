# 🚀 LanceCerto.ai

**Menos tempo escrevendo, mais tempo faturando.**

Plataforma web completa que ajuda freelancers a gerar propostas comerciais personalizadas com inteligência artificial em segundos.

[![CI/CD Pipeline](https://github.com/rafacria244/LanceCerto/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/rafacria244/LanceCerto/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Sobre o Projeto

O LanceCerto é um Micro-SaaS que reduz o tempo que freelancers gastam escrevendo propostas de **30 minutos para 30 segundos** e aumenta suas taxas de conversão em **5x**.

### ✨ Funcionalidades

#### Core
- ✅ Landing page moderna e de alta conversão
- ✅ Geração de propostas personalizadas com IA (Gemini 2.5 Flash)
- ✅ Sistema de autenticação com Supabase (Google OAuth)
- ✅ Planos de assinatura (Free, Starter, Premium)
- ✅ Integração completa com Stripe para pagamentos
- ✅ Histórico de propostas salvo no Supabase
- ✅ Interface limpa, intuitiva e responsiva

#### Segurança e Performance
- 🔒 Rate limiting para prevenir abuso
- 🔒 Validação de input robusta
- 🔒 Helmet.js para headers de segurança
- 🔒 Row Level Security (RLS) no Supabase
- 📊 Sistema de logging com Winston
- 📊 Dashboard com métricas de uso

#### DevOps
- 🐳 Dockerizado (cliente e servidor)
- 🔄 CI/CD com GitHub Actions
- 🧪 Testes automatizados (Jest + Vitest)
- 📝 Documentação completa de deploy

## 🛠️ Tecnologias

### Frontend
- React 18 + Vite
- TailwindCSS
- React Router DOM
- Axios
- Supabase Auth

### Backend
- Node.js + Express
- Google Gemini 2.5 Flash
- Supabase (PostgreSQL)
- Stripe
- Winston (logging)
- Helmet (segurança)
- Express Rate Limit
- Express Validator

### DevOps
- Docker + Docker Compose
- GitHub Actions
- Jest (testes backend)
- Vitest (testes frontend)

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- Docker (opcional, mas recomendado)
- Conta no Google AI Studio (Gemini API)
- Projeto no Supabase
- Conta no Stripe

### Passos

1. **Clone o repositório**

```bash
git clone https://github.com/rafacria244/LanceCerto.git
cd LanceCerto
```

2. **Instale as dependências**

```bash
npm run install:all
```

3. **Configure as variáveis de ambiente**

```bash
# Backend
cp server/.env.example server/.env
nano server/.env

# Frontend
cp client/.env.example client/.env
nano client/.env
```

Veja [GUIA_CONFIGURACAO.md](GUIA_CONFIGURACAO.md) para detalhes sobre cada variável.

4. **Configure o Supabase**

Execute o SQL em `server/supabase-schema.sql` no SQL Editor do Supabase.

5. **Execute o projeto**

**Com Docker (recomendado):**
```bash
docker-compose up --build
```

**Sem Docker:**
```bash
npm run dev
```

Acesse:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 🧪 Testes

### Backend

```bash
cd server
npm test                # Executar testes
npm run test:watch      # Modo watch
npm run test:coverage   # Cobertura de testes
```

### Frontend

```bash
cd client
npm test                # Executar testes
npm run test:ui         # Interface visual
npm run test:coverage   # Cobertura de testes
```

## 🚀 Deploy

Veja o guia completo em [DEPLOY.md](DEPLOY.md).

### Resumo Rápido

**Frontend (Vercel):**
1. Conecte o repositório na Vercel
2. Configure variáveis de ambiente
3. Deploy automático a cada push

**Backend (Render/Railway):**
1. Conecte o repositório
2. Configure variáveis de ambiente
3. Deploy automático a cada push

## 📝 Estrutura do Projeto

```
LanceCerto/
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # Pipeline CI/CD
├── client/                      # Frontend React
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── pages/              # Páginas
│   │   ├── contexts/           # Context API
│   │   └── lib/                # Bibliotecas
│   ├── Dockerfile              # Docker do frontend
│   └── nginx.conf              # Configuração Nginx
├── server/                      # Backend Node.js
│   ├── routes/                 # Rotas da API
│   │   ├── stripe.js
│   │   ├── export.js
│   │   └── premium.js
│   ├── middleware/             # Middlewares
│   │   ├── rateLimiter.js
│   │   ├── validation.js
│   │   └── requestLogger.js
│   ├── config/                 # Configurações
│   │   └── logger.js
│   ├── __tests__/              # Testes
│   ├── Dockerfile              # Docker do backend
│   └── index.js                # Servidor principal
├── docker-compose.yml          # Orquestração Docker
├── DEPLOY.md                   # Guia de deploy
└── README.md                   # Este arquivo
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

## 🔒 Segurança

- ✅ Row Level Security (RLS) no Supabase
- ✅ Helmet.js para headers HTTP seguros
- ✅ Rate limiting em endpoints críticos
- ✅ Validação de input com express-validator
- ✅ Secrets nunca commitados (`.env` no `.gitignore`)
- ✅ CORS configurado corretamente
- ✅ Webhook do Stripe com validação de assinatura

## 📊 Monitoramento

- Logs estruturados com Winston
- Logs de erro separados
- Logs de requisições HTTP
- Métricas de uso por plano
- Health check endpoint (`/api/health`)

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Executando Testes Antes de Contribuir

```bash
# Backend
cd server && npm test

# Frontend
cd client && npm test
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- 📧 Email: suporte@lancecerto.ai
- 🐛 Issues: [GitHub Issues](https://github.com/rafacria244/LanceCerto/issues)
- 📖 Documentação: [Wiki](https://github.com/rafacria244/LanceCerto/wiki)

---

Desenvolvido com ❤️ para freelancers

**Status do Projeto:** ✅ Pronto para Produção
