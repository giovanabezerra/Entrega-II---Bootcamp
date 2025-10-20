# Usa a imagem oficial do Node.js 20 baseada em Debian Bullseye
FROM node:20-bullseye

# Instala as dependências de sistema necessárias para o Chromium (navegador usado pelo Playwright)
# Usa os mesmos pacotes que o Playwright recomenda para estabilidade
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libnss3 \
    libfontconfig \
    libgconf-2-4 \
    libasound2 \
    libxtst6 \
    libgtk-3-0 \
    libxss1 \
    libgbm1 \
    libcurl4-openssl-dev \
    libssl-dev \
    git \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Instala as dependências, incluindo o Playwright e os browsers
# A flag --unsafe-perm é necessária em alguns ambientes Docker
RUN npm install --unsafe-perm

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta 9323 (para o relatório HTML, se necessário)
EXPOSE 9323

# Define o comando padrão: Rodar o build e depois os testes
# O Playwright já está instalado na pasta node_modules
CMD ["npm", "run", "test:ci"]
