# Etapa 1: build do Angular
FROM node:20 AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Etapa 2: imagem final com Nginx
FROM nginx:stable-alpine AS production-stage

# Remove a configuração padrão do Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copia sua config customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos buildados do Angular
# Corrigindo o caminho para incluir o nome do projeto
COPY --from=build-stage /app/dist/cuidar-plus/browser /usr/share/nginx/html/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
