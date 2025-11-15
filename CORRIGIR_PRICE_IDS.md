# 🔧 Como Corrigir os Price IDs do Stripe

## ⚠️ Problema Identificado

Você está usando **Product IDs** (`prod_...`) ao invés de **Price IDs** (`price_...`). O Stripe precisa de Price IDs para criar sessões de checkout.

## ✅ Solução Rápida (5 minutos)

### Passo 1: Acessar o Stripe Dashboard

1. Acesse: https://dashboard.stripe.com/test/products
2. Certifique-se de estar em **modo de teste** (toggle no canto superior direito)

### Passo 2: Obter os Price IDs Corretos

Para cada produto (Starter e Premium):

1. Clique no produto que você criou
2. Na seção **Pricing**, você verá os preços configurados
3. **Copie o Price ID** (começa com `price_`, não `prod_`)
   - Exemplo: `price_1AbCdEfGhIjKlMnO...`

### Passo 3: Atualizar o Arquivo `server/.env`

Abra `server/.env` e substitua:

```env
# ❌ ERRADO (Product IDs)
STRIPE_PRICE_STARTER=prod_TQPc8TGocH4MYH
STRIPE_PRICE_PREMIUM=prod_TQPdxDaIddDPTM

# ✅ CORRETO (Price IDs)
STRIPE_PRICE_STARTER=price_1AbCdEfGhIjKlMnO...
STRIPE_PRICE_PREMIUM=price_1XyZaBcDeFgHiJkL...
```

### Passo 4: Atualizar o Arquivo `client/.env`

Abra `client/.env` e substitua:

```env
# ❌ ERRADO (Product IDs)
VITE_STRIPE_PRICE_STARTER=prod_TQPc8TGocH4MYH
VITE_STRIPE_PRICE_PREMIUM=prod_TQPdxDaIddDPTM

# ✅ CORRETO (Price IDs)
VITE_STRIPE_PRICE_STARTER=price_1AbCdEfGhIjKlMnO...
VITE_STRIPE_PRICE_PREMIUM=price_1XyZaBcDeFgHiJkL...
```

### Passo 5: Reiniciar o Servidor

Após atualizar os arquivos `.env`, reinicie o servidor:

```bash
# Pare o servidor (Ctrl+C) e execute novamente:
npm run dev
```

## 📝 Se Você Ainda Não Criou os Produtos

Se você ainda não criou os produtos no Stripe, siga estes passos:

### Criar Produto Starter

1. No Stripe Dashboard, vá em **Products** > **Add product**
2. Preencha:
   - **Name**: `LanceCerto Starter`
   - **Description**: `Plano Starter - Propostas Ilimitadas`
3. Na seção **Pricing**:
   - **Price**: `49.99`
   - **Currency**: `BRL` (Real Brasileiro)
   - **Billing period**: `Monthly` (Mensal)
4. Clique em **Save product**
5. **Copie o Price ID** (não o Product ID!)

### Criar Produto Premium

1. Repita o processo acima
2. **Name**: `LanceCerto Premium`
3. **Price**: `99.99 BRL`
4. **Billing period**: `Monthly`
5. **Copie o Price ID**

## 🔍 Como Identificar se Está Correto

- ✅ **Price ID correto**: Começa com `price_` e tem cerca de 20-30 caracteres
- ❌ **Product ID incorreto**: Começa com `prod_` e tem cerca de 15-20 caracteres

## 🚀 Após Corrigir

Após atualizar os Price IDs corretos, o sistema de pagamentos funcionará normalmente!

