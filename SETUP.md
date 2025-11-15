# 🚀 Guia Rápido de Setup - LanceCerto.ai

## Passo a Passo para Começar

### 1. Instalar Dependências

```bash
npm run install:all
```

Isso instalará as dependências do projeto raiz, do frontend e do backend.

### 2. Configurar API Key do Gemini

1. Acesse: https://makersuite.google.com/app/apikey
2. Crie uma conta ou faça login
3. Gere uma nova API Key
4. No diretório `server/`, crie um arquivo `.env`:

```bash
cd server
copy .env.example .env
```

5. Edite o arquivo `.env` e adicione sua chave:

```
GEMINI_API_KEY=sua_chave_aqui
PORT=3001
```

### 3. Executar o Projeto

No diretório raiz:

```bash
npm run dev
```

Isso iniciará:
- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:3001

### 4. Testar

1. Abra http://localhost:3000 no navegador
2. Preencha o formulário:
   - **Seu Perfil**: Cole sua biografia profissional
   - **Propostas Antigas** (opcional): Cole exemplos de propostas anteriores
   - **Descrição do Job**: Cole a descrição do projeto
3. Clique em "Gerar Lance"
4. Aguarde alguns segundos e veja sua proposta gerada!

## 🐛 Solução de Problemas

### Erro: "GEMINI_API_KEY is not defined"
- Verifique se o arquivo `.env` existe em `server/`
- Confirme que a variável está escrita corretamente
- Reinicie o servidor após criar/editar o `.env`

### Erro: "Cannot find module"
- Execute `npm run install:all` novamente
- Verifique se está na pasta correta

### Frontend não conecta com backend
- Certifique-se de que ambos estão rodando
- Verifique se o backend está na porta 3001
- Veja o console do navegador para erros de CORS

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia frontend e backend em modo desenvolvimento
- `npm run dev:server` - Apenas o backend
- `npm run dev:client` - Apenas o frontend
- `npm run build` - Build de produção do frontend
- `npm start` - Inicia apenas o backend em produção

## 🎯 Próximos Passos

Após testar localmente, você pode fazer deploy:
- **Frontend**: Vercel
- **Backend**: Render ou Railway

Veja o README.md para instruções detalhadas de deploy.


