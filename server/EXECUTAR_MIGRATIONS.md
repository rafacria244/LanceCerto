# 🗄️ Executar Migrations do Supabase

## ⚠️ Erro Encontrado

A tabela `project_plans` não existe no banco de dados. Você precisa executar as migrations.

## ✅ Solução Rápida

### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **SQL Editor** (no menu lateral)
4. Clique em **New Query**
5. Copie e cole o conteúdo completo do arquivo `server/supabase-schema.sql`
6. Clique em **Run** (ou pressione Ctrl+Enter)
7. Aguarde a confirmação de sucesso

### Opção 2: Via Supabase CLI

Se você tem o Supabase CLI instalado:

```bash
supabase db push
```

Ou execute o SQL diretamente:

```bash
psql -h seu-projeto.supabase.co -U postgres -d postgres -f server/supabase-schema.sql
```

## 📋 Tabelas que Serão Criadas

- ✅ `project_plans` - Para planejamentos de projeto (Premium)
- ✅ `client_dialogs` - Para diálogos com cliente (Premium)

## 🔍 Verificar se Funcionou

Após executar, você pode verificar no Supabase Dashboard:
1. Vá em **Table Editor**
2. Você deve ver as novas tabelas: `project_plans` e `client_dialogs`

## ⚠️ Importante

- As tabelas já existentes NÃO serão afetadas
- O script usa `CREATE TABLE IF NOT EXISTS`, então é seguro executar múltiplas vezes
- As políticas RLS (Row Level Security) serão aplicadas automaticamente


