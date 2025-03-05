# Use a imagem oficial do Node.js como base
FROM node:18-alpine as build

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos de dependência e instalar as dependências
COPY package.json package-lock.json ./
RUN npm install

# Instalar o Angular CLI globalmente
RUN npm install -g @angular/cli

# Copiar o restante dos arquivos do projeto
COPY . .

# Construir o projeto Angular
RUN ng build cuidar-plus --configuration production

# Use uma imagem leve do Nginx para servir a aplicação
FROM nginx:alpine

# Copiar o arquivo de configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos construídos (da subpasta browser) para o diretório raiz do Nginx
COPY --from=build /app/dist/cuidar-plus/browser /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]