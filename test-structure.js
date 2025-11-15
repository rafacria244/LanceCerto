#!/usr/bin/env node

/**
 * Script de Validação da Estrutura do LanceCerto
 * 
 * Este script verifica se todos os arquivos necessários existem
 * e se as configurações básicas estão corretas.
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✓ ${description}`, 'green');
    return true;
  } else {
    log(`✗ ${description}`, 'red');
    return false;
  }
}

function checkEnvVariable(filePath, variable) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasVariable = content.includes(variable);
  const isPlaceholder = content.includes(`${variable}=sua_`) || 
                        content.includes(`${variable}=seu-`) ||
                        content.includes(`${variable}=placeholder`);
  
  if (hasVariable && !isPlaceholder) {
    log(`  ✓ ${variable} configurada`, 'green');
    return true;
  } else if (hasVariable && isPlaceholder) {
    log(`  ⚠ ${variable} precisa ser configurada`, 'yellow');
    return false;
  } else {
    log(`  ✗ ${variable} não encontrada`, 'red');
    return false;
  }
}

console.log('\n' + '='.repeat(60));
log('🔍 Validação da Estrutura do LanceCerto', 'blue');
console.log('='.repeat(60) + '\n');

let totalChecks = 0;
let passedChecks = 0;

// Verificar arquivos principais
log('\n📁 Arquivos Principais:', 'blue');
const mainFiles = [
  ['README.md', 'README.md'],
  ['GUIA_CONFIGURACAO.md', 'Guia de Configuração'],
  ['CHECKLIST_LANCAMENTO.md', 'Checklist de Lançamento'],
  ['package.json', 'Package.json raiz'],
];

mainFiles.forEach(([file, desc]) => {
  totalChecks++;
  if (checkFile(file, desc)) passedChecks++;
});

// Verificar estrutura do cliente
log('\n📱 Frontend (Client):', 'blue');
const clientFiles = [
  ['client/package.json', 'Package.json do cliente'],
  ['client/vite.config.js', 'Configuração do Vite'],
  ['client/index.html', 'HTML principal'],
  ['client/src/App.jsx', 'Componente App'],
  ['client/src/main.jsx', 'Entry point'],
  ['client/.env.example', 'Exemplo de variáveis de ambiente'],
];

clientFiles.forEach(([file, desc]) => {
  totalChecks++;
  if (checkFile(file, desc)) passedChecks++;
});

// Verificar componentes do cliente
log('\n🧩 Componentes do Cliente:', 'blue');
const clientComponents = [
  ['client/src/components/Header.jsx', 'Header'],
  ['client/src/components/SubscriptionInfo.jsx', 'Informações de Assinatura'],
  ['client/src/components/ManageSubscription.jsx', 'Gerenciar Assinatura'],
  ['client/src/pages/Generate.jsx', 'Página de Geração'],
  ['client/src/pages/History.jsx', 'Página de Histórico'],
  ['client/src/contexts/AuthContext.jsx', 'Contexto de Autenticação'],
  ['client/src/lib/supabase.js', 'Cliente Supabase'],
];

clientComponents.forEach(([file, desc]) => {
  totalChecks++;
  if (checkFile(file, desc)) passedChecks++;
});

// Verificar estrutura do servidor
log('\n🖥️  Backend (Server):', 'blue');
const serverFiles = [
  ['server/package.json', 'Package.json do servidor'],
  ['server/index.js', 'Servidor principal'],
  ['server/routes/stripe.js', 'Rotas do Stripe'],
  ['server/supabase-schema.sql', 'Schema do banco de dados'],
  ['server/.env.example', 'Exemplo de variáveis de ambiente'],
];

serverFiles.forEach(([file, desc]) => {
  totalChecks++;
  if (checkFile(file, desc)) passedChecks++;
});

// Verificar variáveis de ambiente do cliente
log('\n🔐 Variáveis de Ambiente (Client):', 'blue');
const clientEnvFile = 'client/.env';
if (fs.existsSync(clientEnvFile)) {
  const clientEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_STRIPE_PUBLISHABLE_KEY',
    'VITE_STRIPE_PRICE_STARTER',
    'VITE_STRIPE_PRICE_PREMIUM',
  ];
  
  clientEnvVars.forEach(variable => {
    totalChecks++;
    if (checkEnvVariable(clientEnvFile, variable)) passedChecks++;
  });
} else {
  log('⚠ Arquivo client/.env não encontrado', 'yellow');
  log('  Execute: cp client/.env.example client/.env', 'yellow');
}

// Verificar variáveis de ambiente do servidor
log('\n🔐 Variáveis de Ambiente (Server):', 'blue');
const serverEnvFile = 'server/.env';
if (fs.existsSync(serverEnvFile)) {
  const serverEnvVars = [
    'GEMINI_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PRICE_STARTER',
    'STRIPE_PRICE_PREMIUM',
  ];
  
  serverEnvVars.forEach(variable => {
    totalChecks++;
    if (checkEnvVariable(serverEnvFile, variable)) passedChecks++;
  });
} else {
  log('⚠ Arquivo server/.env não encontrado', 'yellow');
  log('  Execute: cp server/.env.example server/.env', 'yellow');
}

// Resumo
console.log('\n' + '='.repeat(60));
log('📊 Resumo da Validação:', 'blue');
console.log('='.repeat(60));

const percentage = Math.round((passedChecks / totalChecks) * 100);
const status = percentage === 100 ? '✓ PRONTO' : 
               percentage >= 80 ? '⚠ QUASE PRONTO' : 
               '✗ REQUER ATENÇÃO';

log(`\nTotal de verificações: ${totalChecks}`, 'blue');
log(`Aprovadas: ${passedChecks}`, 'green');
log(`Pendentes: ${totalChecks - passedChecks}`, 'yellow');
log(`Porcentagem: ${percentage}%`, percentage === 100 ? 'green' : 'yellow');
log(`\nStatus: ${status}\n`, percentage === 100 ? 'green' : 'yellow');

if (percentage < 100) {
  log('📝 Próximos passos:', 'blue');
  log('1. Configure as variáveis de ambiente nos arquivos .env', 'yellow');
  log('2. Siga o GUIA_CONFIGURACAO.md para obter as credenciais', 'yellow');
  log('3. Execute este script novamente para validar\n', 'yellow');
} else {
  log('🎉 Estrutura validada com sucesso!', 'green');
  log('Você pode executar: npm run dev\n', 'green');
}

process.exit(percentage === 100 ? 0 : 1);
