# Estágio de build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Instalar dependências
RUN npm

# Copiar o resto do código fonte
COPY . .

# Construir a aplicação
RUN npm run build -- --configuration production

# Estágio de produção
FROM nginx:alpine

# Copiar a configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos compilados do estágio de build
COPY --from=build /app/dist/cuidar-plus/browser /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]