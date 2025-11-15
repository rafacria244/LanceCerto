# 🚀 Como Executar as Migrations do Supabase

## ⚠️ Erro Atual

```
Could not find the table 'public.project_plans' in the schema cache
```

Isso significa que as tabelas Premium ainda não foram criadas no seu banco de dados.

## ✅ Solução Rápida (2 minutos)

### Passo 1: Acessar o Supabase Dashboard

1. Acesse: https://app.supabase.com
2. Faça login na sua conta
3. Selecione o projeto do LanceCerto

### Passo 2: Abrir o SQL Editor

1. No menu lateral esquerdo, clique em **SQL Editor**
2. Clique no botão **New Query** (ou use o atalho `Ctrl+N`)

### Passo 3: Executar a Migration

1. Abra o arquivo `server/migrations-premium-tables.sql` no seu editor
2. **Copie TODO o conteúdo** do arquivo
3. **Cole no SQL Editor** do Supabase
4. Clique no botão **Run** (ou pressione `Ctrl+Enter`)
5. Aguarde a confirmação de sucesso ✅

### Passo 4: Verificar

1. No menu lateral, clique em **Table Editor**
2. Você deve ver as novas tabelas:
   - ✅ `project_plans`
   - ✅ `client_dialogs`

## 📋 O Que Será Criado

- **project_plans**: Armazena planejamentos de projetos gerados pela IA
- **client_dialogs**: Armazena conversas com clientes geradas pela IA
- **Políticas RLS**: Garantem que cada usuário só vê seus próprios dados

## 🔒 Segurança

As políticas RLS (Row Level Security) garantem que:
- ✅ Cada usuário só vê seus próprios planejamentos
- ✅ Cada usuário só vê suas próprias conversas
- ✅ Não há risco de vazamento de dados

## ⚡ Após Executar

Reinicie o servidor:

```bash
npm run dev
```

Agora o Painel Premium deve funcionar corretamente! 🎉

