-- ============================================
-- MIGRATION: Tabelas Premium
-- Execute este SQL no Supabase Dashboard
-- ============================================

-- Tabela de planejamentos de projeto (Premium)
CREATE TABLE IF NOT EXISTS project_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  plan_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de diálogos com cliente (Premium)
CREATE TABLE IF NOT EXISTS client_dialogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  message_from_client TEXT NOT NULL,
  message_from_ia TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para novas tabelas
ALTER TABLE project_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_dialogs ENABLE ROW LEVEL SECURITY;

-- Políticas para project_plans
CREATE POLICY IF NOT EXISTS "Users can view own project plans" ON project_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own project plans" ON project_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own project plans" ON project_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own project plans" ON project_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para client_dialogs
CREATE POLICY IF NOT EXISTS "Users can view own client dialogs" ON client_dialogs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own client dialogs" ON client_dialogs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

