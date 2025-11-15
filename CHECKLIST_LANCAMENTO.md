# ✅ Checklist de Lançamento - LanceCerto

Use este checklist para garantir que tudo está configurado corretamente antes do lançamento.

## 🔐 Configuração de Credenciais

### Supabase
- [ ] Projeto criado no Supabase
- [ ] Schema do banco de dados executado (`server/supabase-schema.sql`)
- [ ] Tabelas criadas: `profiles`, `proposal_samples`, `jobs`, `subscriptions`
- [ ] Trigger `on_auth_user_created` está ativo
- [ ] Google OAuth configurado em Authentication > Providers
- [ ] URLs de redirecionamento configuradas
- [ ] `SUPABASE_URL` copiada para os arquivos `.env`
- [ ] `SUPABASE_ANON_KEY` copiada para `client/.env`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` copiada para `server/.env`

### Stripe
- [ ] Conta criada no Stripe
- [ ] Modo de teste ativado (para desenvolvimento)
- [ ] Produto "LanceCerto Starter" criado (R$ 49,99/mês)
- [ ] Produto "LanceCerto Premium" criado (R$ 99,99/mês)
- [ ] Price IDs copiados para os arquivos `.env`
- [ ] `STRIPE_PUBLISHABLE_KEY` copiada para `client/.env`
- [ ] `STRIPE_SECRET_KEY` copiada para `server/.env`
- [ ] Webhook configurado (local com Stripe CLI ou produção)
- [ ] `STRIPE_WEBHOOK_SECRET` copiada para `server/.env`
- [ ] Eventos do webhook selecionados:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`

### Google Gemini
- [ ] API Key obtida em https://makersuite.google.com
- [ ] `GEMINI_API_KEY` copiada para `server/.env`

## 📦 Instalação e Configuração

- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (`npm run install:all`)
- [ ] Arquivo `client/.env` criado e configurado
- [ ] Arquivo `server/.env` criado e configurado
- [ ] Variáveis de ambiente validadas (sem placeholders)

## 🧪 Testes Funcionais

### Autenticação
- [ ] Login com Google funciona
- [ ] Usuário é redirecionado para `/gerar` após login
- [ ] Perfil é criado automaticamente na tabela `profiles`
- [ ] Subscription é criada automaticamente no plano Free
- [ ] Logout funciona corretamente
- [ ] Rotas protegidas redirecionam para login quando não autenticado

### Geração de Propostas
- [ ] Formulário de geração aceita inputs
- [ ] Proposta é gerada com sucesso usando Gemini
- [ ] Proposta é salva na tabela `jobs`
- [ ] Contador de propostas é incrementado
- [ ] Limite do plano Free (1 proposta) é respeitado
- [ ] Mensagem de erro aparece ao atingir o limite

### Sistema de Planos
- [ ] Informações do plano atual são exibidas
- [ ] Contador de propostas usadas é exibido
- [ ] Barra de progresso funciona corretamente
- [ ] Link "Fazer Upgrade" aparece para usuários Free
- [ ] Botões de assinatura redirecionam para Stripe Checkout
- [ ] Página de planos na landing page funciona

### Pagamentos com Stripe
- [ ] Checkout do Stripe abre corretamente
- [ ] Teste com cartão `4242 4242 4242 4242` funciona
- [ ] Após pagamento, usuário é redirecionado para `/gerar?success=true`
- [ ] Webhook recebe evento `checkout.session.completed`
- [ ] Subscription é atualizada no banco de dados
- [ ] Plano do usuário muda de Free para Starter/Premium
- [ ] Contador de propostas é resetado
- [ ] Limite de propostas é atualizado conforme o novo plano

### Histórico
- [ ] Página de histórico exibe propostas anteriores
- [ ] Propostas são ordenadas por data (mais recente primeiro)
- [ ] Detalhes da proposta são exibidos ao clicar
- [ ] Botão "Copiar" funciona
- [ ] Mensagem aparece quando não há propostas

### Interface
- [ ] Header exibe links corretos (autenticado vs não autenticado)
- [ ] Navegação entre páginas funciona
- [ ] Loading states são exibidos durante operações
- [ ] Mensagens de erro são claras e úteis
- [ ] Design é responsivo (mobile, tablet, desktop)

## 🚀 Deploy (Produção)

### Frontend (Vercel)
- [ ] Repositório conectado à Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] `VITE_API_URL` aponta para o backend em produção
- [ ] Build executado com sucesso
- [ ] Site acessível e funcionando

### Backend (Render/Railway)
- [ ] Repositório conectado ao serviço de hosting
- [ ] Variáveis de ambiente configuradas
- [ ] `FRONTEND_URL` aponta para o frontend em produção
- [ ] Servidor iniciado com sucesso
- [ ] API acessível e respondendo

### Integrações em Produção
- [ ] URLs de redirecionamento do Supabase atualizadas
- [ ] Webhook do Stripe configurado com URL de produção
- [ ] Novo signing secret do webhook copiado para `server/.env`
- [ ] CORS configurado corretamente no backend
- [ ] Teste completo do fluxo de pagamento em produção

## 🔒 Segurança

- [ ] Arquivo `.env` está no `.gitignore`
- [ ] Service Role Key do Supabase está APENAS no backend
- [ ] Secret Key do Stripe está APENAS no backend
- [ ] RLS (Row Level Security) está ativo no Supabase
- [ ] Políticas de acesso estão configuradas corretamente
- [ ] Webhook do Stripe valida assinatura

## 📊 Monitoramento

- [ ] Logs do backend estão sendo gerados
- [ ] Erros são capturados e logados
- [ ] Dashboard do Stripe está sendo monitorado
- [ ] Logs do Supabase estão acessíveis
- [ ] Métricas de uso estão sendo coletadas (opcional)

## 📝 Documentação

- [ ] README.md atualizado
- [ ] GUIA_CONFIGURACAO.md revisado
- [ ] Comentários no código estão claros
- [ ] Variáveis de ambiente documentadas

## 🎉 Lançamento Final

- [ ] Todos os itens acima foram verificados
- [ ] Teste completo end-to-end realizado
- [ ] Backup do banco de dados criado
- [ ] Plano de rollback definido
- [ ] Equipe de suporte preparada (se aplicável)
- [ ] Comunicação de lançamento preparada

---

**Data do Lançamento**: ___/___/______

**Responsável**: _________________

**Status**: [ ] Em Desenvolvimento | [ ] Em Teste | [ ] Pronto para Lançamento | [ ] Lançado
