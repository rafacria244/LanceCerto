/**
 * Script para verificar a configuração do Stripe e listar Price IDs disponíveis
 * 
 * Uso: node scripts/check-stripe-config.js
 */

import Stripe from 'stripe';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: join(__dirname, '..', '.env') });

async function checkStripeConfig() {
  console.log('🔍 Verificando configuração do Stripe...\n');

  // Verificar se a chave está configurada
  const secretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!secretKey || secretKey === 'sk_test_sua_chave_secreta' || secretKey === 'sk_test_placeholder') {
    console.error('❌ STRIPE_SECRET_KEY não está configurada no arquivo server/.env');
    console.log('\n📝 Configure a chave no arquivo server/.env:');
    console.log('   STRIPE_SECRET_KEY=sk_test_sua_chave_aqui\n');
    return;
  }

  if (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
    console.error('❌ STRIPE_SECRET_KEY parece estar em formato inválido');
    console.log('   A chave deve começar com sk_test_ ou sk_live_\n');
    return;
  }

  console.log('✅ STRIPE_SECRET_KEY configurada\n');

  // Verificar Price IDs configurados
  const priceStarter = process.env.STRIPE_PRICE_STARTER;
  const pricePremium = process.env.STRIPE_PRICE_PREMIUM;

  console.log('📋 Price IDs configurados:');
  console.log(`   STRIPE_PRICE_STARTER: ${priceStarter || 'NÃO CONFIGURADO'}`);
  console.log(`   STRIPE_PRICE_PREMIUM: ${pricePremium || 'NÃO CONFIGURADO'}\n`);

  // Verificar se são Product IDs ao invés de Price IDs
  if (priceStarter && priceStarter.startsWith('prod_')) {
    console.error('⚠️  ATENÇÃO: STRIPE_PRICE_STARTER está usando um Product ID (prod_) ao invés de Price ID (price_)');
    console.log('   Você precisa copiar o Price ID do produto no Stripe Dashboard\n');
  }

  if (pricePremium && pricePremium.startsWith('prod_')) {
    console.error('⚠️  ATENÇÃO: STRIPE_PRICE_PREMIUM está usando um Product ID (prod_) ao invés de Price ID (price_)');
    console.log('   Você precisa copiar o Price ID do produto no Stripe Dashboard\n');
  }

  // Tentar conectar ao Stripe e listar produtos
  try {
    const stripe = new Stripe(secretKey);
    console.log('🔌 Conectando ao Stripe...\n');

    // Listar produtos
    const products = await stripe.products.list({ limit: 10 });
    
    if (products.data.length === 0) {
      console.log('⚠️  Nenhum produto encontrado na sua conta Stripe');
      console.log('   Crie produtos no Stripe Dashboard: https://dashboard.stripe.com/test/products\n');
      return;
    }

    console.log('📦 Produtos encontrados:\n');
    
    for (const product of products.data) {
      console.log(`   ${product.name} (ID: ${product.id})`);
      
      // Listar preços do produto
      const prices = await stripe.prices.list({ product: product.id, limit: 10 });
      
      if (prices.data.length === 0) {
        console.log('      ⚠️  Nenhum preço configurado para este produto');
      } else {
        console.log('      💰 Preços disponíveis:');
        for (const price of prices.data) {
          const amount = (price.unit_amount / 100).toFixed(2);
          const currency = price.currency.toUpperCase();
          const interval = price.recurring?.interval || 'one-time';
          const mode = price.livemode ? 'LIVE' : 'TEST';
          
          console.log(`         ✅ Price ID: ${price.id}`);
          console.log(`            Valor: ${currency} ${amount} / ${interval}`);
          console.log(`            Modo: ${mode}`);
          
          // Verificar se este Price ID está configurado
          if (price.id === priceStarter) {
            console.log(`            ⭐ Configurado como STRIPE_PRICE_STARTER`);
          }
          if (price.id === pricePremium) {
            console.log(`            ⭐ Configurado como STRIPE_PRICE_PREMIUM`);
          }
          console.log('');
        }
      }
      console.log('');
    }

    console.log('📝 Para atualizar os Price IDs, edite o arquivo server/.env com os Price IDs acima\n');

  } catch (error) {
    console.error('❌ Erro ao conectar ao Stripe:', error.message);
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('\n💡 A chave do Stripe está inválida ou expirada.');
      console.log('   Obtenha uma nova chave em: https://dashboard.stripe.com/test/apikeys\n');
    }
  }
}

checkStripeConfig().catch(console.error);

