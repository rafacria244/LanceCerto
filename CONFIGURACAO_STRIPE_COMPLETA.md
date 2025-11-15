# 🚀 Configuração Completa do Stripe - LanceCerto

## ✅ Status Atual

Sua chave do Stripe está configurada corretamente! ✅

**O que precisa ser corrigido:**
- ❌ Os Price IDs estão usando Product IDs (`prod_`) ao invés de Price IDs (`price_`)

## 🔧 Solução Rápida

### Opção 1: Usar o Script de Verificação (Recomendado)

Execute o script que lista todos os Price IDs disponíveis:

```bash
cd server
npm run check-stripe
```

O script irá:
- ✅ Verificar se sua chave está configurada
- 📋 Listar todos os produtos e preços do Stripe
- 💡 Mostrar os Price IDs corretos para copiar

### Opção 2: Manual (5 minutos)

#### Passo 1: Acessar o Stripe Dashboard

1. Acesse: https://dashboard.stripe.com/test/products
2. Certifique-se de estar em **modo de teste**

#### Passo 2: Obter os Price IDs

Para cada produto:

1. Clique no produto (ex: "LanceCerto Starter")
2. Na página do produto, role até a seção **Pricing**
3. Você verá os preços configurados
4. **Copie o Price ID** (começa com `price_`, não `prod_`)

**Exemplo:**
- ❌ Product ID: `prod_TQPc8TGocH4MYH` (ERRADO)
- ✅ Price ID: `price_1AbCdEfGhIjKlMnO...` (CORRETO)

#### Passo 3: Atualizar `server/.env`

Substitua as linhas:

```env
# ANTES (ERRADO)
STRIPE_PRICE_STARTER=prod_TQPc8TGocH4MYH
STRIPE_PRICE_PREMIUM=prod_TQPdxDaIddDPTM

# DEPOIS (CORRETO - use os Price IDs que você copiou)
STRIPE_PRICE_STARTER=price_1AbCdEfGhIjKlMnO...
STRIPE_PRICE_PREMIUM=price_1XyZaBcDeFgHiJkL...
```

#### Passo 4: Atualizar `client/.env`

Substitua as linhas:

```env
# ANTES (ERRADO)
VITE_STRIPE_PRICE_STARTER=prod_TQPc8TGocH4MYH
VITE_STRIPE_PRICE_PREMIUM=prod_TQPdxDaIddDPTM

# DEPOIS (CORRETO - use os mesmos Price IDs)
VITE_STRIPE_PRICE_STARTER=price_1AbCdEfGhIjKlMnO...
VITE_STRIPE_PRICE_PREMIUM=price_1XyZaBcDeFgHiJkL...
```

#### Passo 5: Reiniciar o Servidor

```bash
# Pare o servidor (Ctrl+C) e execute:
npm run dev
```

## 🎯 Verificação Final

Após configurar, teste criando uma sessão de checkout. Se tudo estiver correto:

- ✅ O servidor não mostrará mais avisos sobre Stripe
- ✅ Os botões de assinatura funcionarão
- ✅ Você será redirecionado para o checkout do Stripe

## 📝 Se Você Ainda Não Criou os Produtos

Se você ainda não criou os produtos no Stripe, siga:

### Criar Produto Starter

1. Stripe Dashboard > **Products** > **Add product**
2. **Name**: `LanceCerto Starter`
3. **Price**: `49.99 BRL`
4. **Billing**: `Monthly`
5. Salve e **copie o Price ID** (não o Product ID!)

### Criar Produto Premium

1. Repita o processo
2. **Name**: `LanceCerto Premium`
3. **Price**: `99.99 BRL`
4. **Billing**: `Monthly`
5. Salve e **copie o Price ID**

## 🔍 Diferença Entre Product ID e Price ID

- **Product ID** (`prod_...`): Identifica o produto
- **Price ID** (`price_...`): Identifica o preço específico do produto
  - Um produto pode ter múltiplos preços (mensal, anual, etc.)
  - Para checkout, você precisa do **Price ID**

## ✅ Checklist de Configuração

- [x] Chave secreta do Stripe configurada (`STRIPE_SECRET_KEY`)
- [x] Chave pública do Stripe configurada (`VITE_STRIPE_PUBLISHABLE_KEY`)
- [x] Webhook secret configurado (`STRIPE_WEBHOOK_SECRET`)
- [ ] Price ID do Starter configurado (deve começar com `price_`)
- [ ] Price ID do Premium configurado (deve começar com `price_`)
- [ ] Price IDs atualizados em `server/.env`
- [ ] Price IDs atualizados em `client/.env`
- [ ] Servidor reiniciado após alterações

## 🚀 Pronto para Publicar!

Após corrigir os Price IDs, seu app estará pronto para ser publicado! 🎉

