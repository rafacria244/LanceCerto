-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de amostras de propostas antigas
CREATE TABLE IF NOT EXISTS proposal_samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de jobs e propostas geradas
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  profile TEXT,
  old_proposals TEXT,
  job_description TEXT NOT NULL,
  generated_proposal TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de assinaturas
CREATE TABLE IF NOT EXISTS subscriptions (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free', -- free, starter, premium
  status TEXT NOT NULL DEFAULT 'active', -- active, canceled, past_due
  proposals_count INTEGER DEFAULT 0,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para proposal_samples
CREATE POLICY "Users can view own samples" ON proposal_samples
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own samples" ON proposal_samples
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own samples" ON proposal_samples
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para jobs
CREATE POLICY "Users can view own jobs" ON jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs" ON jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para subscriptions
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Função para criar perfil e subscription automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Criar perfil
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Criar subscription no plano Free
  INSERT INTO public.subscriptions (user_id, plan, status, proposals_count)
  VALUES (NEW.id, 'free', 'active', 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil e subscription quando usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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
CREATE POLICY "Users can view own project plans" ON project_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own project plans" ON project_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own project plans" ON project_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own project plans" ON project_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para client_dialogs
CREATE POLICY "Users can view own client dialogs" ON client_dialogs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own client dialogs" ON client_dialogs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

