# 🚀 Início Rápido - Resolver Erro do Stripe

## ⚠️ Você está vendo o erro de autenticação do Stripe?

Se você está recebendo o erro `StripeAuthenticationError: You did not provide an API key`, siga este guia rápido para resolver.

## 📝 O Que Você Precisa Fazer

O projeto está **quase pronto**, mas precisa que você configure suas credenciais do Stripe. Atualmente, os arquivos `.env` contêm valores de exemplo (placeholders) que precisam ser substituídos pelas suas chaves reais.

## ⚡ Solução Rápida (5 minutos)

### 1. Obter Chaves do Stripe

1. Acesse: https://dashboard.stripe.com/test/apikeys
2. Faça login (ou crie uma conta gratuita)
3. Certifique-se de estar em **modo de teste** (toggle no topo)
4. Copie as duas chaves:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...) - clique em "Reveal test key"

### 2. Configurar Backend

Abra o arquivo `server/.env` e substitua:

```env
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz...
```

Cole sua **Secret key** real do Stripe.

### 3. Configurar Frontend

Abra o arquivo `client/.env` e substitua:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz...
```

Cole sua **Publishable key** real do Stripe.

### 4. Criar Produtos no Stripe

1. No Dashboard do Stripe, vá em **Products** > **Add product**
2. Crie dois produtos:
   
   **Produto 1:**
   - Name: LanceCerto Starter
   - Price: 49.99 BRL
   - Billing: Monthly
   - Copie o **Price ID** (price_...)

   **Produto 2:**
   - Name: LanceCerto Premium
   - Price: 99.99 BRL
   - Billing: Monthly
   - Copie o **Price ID** (price_...)

3. Atualize os Price IDs em **ambos** os arquivos `.env`:

**server/.env:**
```env
STRIPE_PRICE_STARTER=price_1AbCdEfGhIjKlMnO
STRIPE_PRICE_PREMIUM=price_1XyZaBcDeFgHiJkL
```

**client/.env:**
```env
VITE_STRIPE_PRICE_STARTER=price_1AbCdEfGhIjKlMnO
VITE_STRIPE_PRICE_PREMIUM=price_1XyZaBcDeFgHiJkL
```

### 5. Configurar Webhook (Desenvolvimento Local)

Para testes locais, você tem duas opções:

**Opção A: Stripe CLI (Recomendado)**
```bash
# Instalar: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to http://localhost:3001/api/webhook
```

Copie o **signing secret** (whsec_...) e cole em `server/.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef
```

**Opção B: Temporariamente desabilitar webhook**

Se você só quer testar rapidamente, pode usar um placeholder:
```env
STRIPE_WEBHOOK_SECRET=whsec_placeholder_for_testing
```

⚠️ Nota: Sem webhook configurado, as assinaturas não serão atualizadas automaticamente no banco.

### 6. Reiniciar o Servidor

```bash
# Parar o servidor (Ctrl+C)
# Depois executar:
npm run dev
```

## ✅ Testar

1. Acesse http://localhost:3000
2. Faça login com Google
3. Tente fazer upgrade para um plano pago
4. Use o cartão de teste do Stripe:
   - Número: `4242 4242 4242 4242`
   - Data: qualquer data futura (ex: 12/25)
   - CVC: qualquer 3 dígitos (ex: 123)
   - CEP: qualquer CEP válido

Se o checkout abrir sem erros, está funcionando! 🎉

## 📚 Precisa de Mais Ajuda?

- **Erro específico do Stripe?** → Veja `SOLUCAO_ERRO_STRIPE.md`
- **Configuração completa?** → Veja `GUIA_CONFIGURACAO.md`
- **Checklist de lançamento?** → Veja `CHECKLIST_LANCAMENTO.md`

## 🔍 Validar Configuração

Execute o script de validação para verificar se tudo está configurado:

```bash
node test-structure.js
```

Você deve ver 100% de aprovação quando todas as credenciais estiverem configuradas.

## 📌 Resumo Visual

```
┌─────────────────────────────────────────────────────────┐
│  1. Stripe Dashboard → API Keys                         │
│     ↓                                                    │
│  2. Copiar Secret Key → server/.env                     │
│     ↓                                                    │
│  3. Copiar Publishable Key → client/.env                │
│     ↓                                                    │
│  4. Criar Produtos → Copiar Price IDs → .env            │
│     ↓                                                    │
│  5. Configurar Webhook → Copiar Secret → server/.env    │
│     ↓                                                    │
│  6. Reiniciar servidor (npm run dev)                    │
│     ↓                                                    │
│  7. Testar com cartão 4242 4242 4242 4242               │
│     ↓                                                    │
│  ✅ Funcionando!                                         │
└─────────────────────────────────────────────────────────┘
```

## ⏱️ Tempo Estimado

- Obter chaves: 2 minutos
- Criar produtos: 2 minutos
- Configurar arquivos: 1 minuto
- **Total: ~5 minutos**

---

**Dica:** Mantenha o Dashboard do Stripe aberto em uma aba enquanto configura. Isso facilita copiar e colar as chaves.
