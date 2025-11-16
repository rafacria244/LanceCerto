FROM node:22-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3001

# Variável de ambiente padrão
ENV NODE_ENV=production

# Iniciar aplicação
CMD ["node", "index.js"]
