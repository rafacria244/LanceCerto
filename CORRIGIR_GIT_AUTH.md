# 🔧 Como Corrigir Autenticação do Git

## ⚠️ Problema

O Git está tentando fazer push com credenciais de uma conta diferente (`rafacria244`) do que a do repositório (`Faelzin09663`).

## ✅ Solução 1: Usar Token de Acesso Pessoal (Recomendado)

### Passo 1: Criar Token no GitHub

1. Acesse: https://github.com/settings/tokens
2. Clique em **Generate new token** → **Generate new token (classic)**
3. Dê um nome: `LanceCerto-Project`
4. Selecione as permissões:
   - ✅ `repo` (acesso completo a repositórios)
5. Clique em **Generate token**
6. **COPIE O TOKEN** (você só verá uma vez!)

### Passo 2: Atualizar o Remote com Token

Execute no PowerShell:

```powershell
git remote set-url origin https://Faelzin09663:SEU_TOKEN_AQUI@github.com/Faelzin09663/Rafael.git
```

Substitua `SEU_TOKEN_AQUI` pelo token que você copiou.

### Passo 3: Fazer Push

```powershell
git push -u origin main

### Alternativa: script de ajuda

Este repositório inclui `scripts/publish-to-github.ps1` para configurar o remote e dar o primeiro push com segurança. Exemplo:

```powershell
.\scripts\publish-to-github.ps1 -RepoOwner "Faelzin09663" -RepoName "Rafael"
```
```

## ✅ Solução 2: Usar SSH (Alternativa)

### Passo 1: Gerar Chave SSH (se ainda não tiver)

```powershell
ssh-keygen -t ed25519 -C "fafaelbroficial@gmail.com"
```

Pressione Enter para aceitar o local padrão.

### Passo 2: Copiar a Chave Pública

```powershell
cat ~/.ssh/id_ed25519.pub
```

Copie todo o conteúdo.

### Passo 3: Adicionar no GitHub

1. Acesse: https://github.com/settings/keys
2. Clique em **New SSH key**
3. Cole a chave e salve

### Passo 4: Mudar Remote para SSH

```powershell
git remote set-url origin git@github.com:Faelzin09663/Rafael.git
```

### Passo 5: Fazer Push

```powershell
git push -u origin main
```

## ✅ Solução 3: Limpar Credenciais do Windows

Se as credenciais antigas estão em cache:

### Passo 1: Abrir Gerenciador de Credenciais

1. Pressione `Win + R`
2. Digite: `control /name Microsoft.CredentialManager`
3. Pressione Enter

### Passo 2: Remover Credenciais do Git

1. Vá em **Credenciais do Windows**
2. Procure por `git:https://github.com`
3. Remova todas as entradas relacionadas

### Passo 3: Tentar Push Novamente

O Windows pedirá novas credenciais. Use:
- **Usuário**: `Faelzin09663`
- **Senha**: Seu token de acesso pessoal (não sua senha do GitHub)

## 🔍 Verificar Configuração

Após configurar, verifique:

```powershell
git remote -v
git config --global user.name
git config --global user.email
```

## 📝 Nota Importante

- **NUNCA** compartilhe seu token de acesso pessoal
- Se o token for exposto, revogue-o imediatamente no GitHub
- Tokens têm permissões específicas, então são mais seguros que senhas


