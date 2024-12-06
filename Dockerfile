FROM cypress/included:13.16.0

# Crear un directorio de trabajo dentro del contenedor
WORKDIR /e2e-test

# Copiar solo los archivos necesarios primero para aprovechar la caché de Docker
COPY package.json package-lock.json /e2e-test/

# Instalar las dependencias
RUN npm install

# Instlar cypress
RUN npx cypress install

# Instalar las dependencias necesarias para X11
RUN apt-get update && apt-get install -y \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Copiar el resto del proyecto
COPY . /e2e-test

# Asegúrate de que los directorios necesarios existen
RUN mkdir -p cypress/videos cypress/screenshots

# Exponer el puerto 8080 para Cypress GUI (si lo necesitas)
EXPOSE 8080

# Comando por defecto: abre la GUI de Cypress
CMD ["npx", "cypress", "open", "--project", "/e2e-test"]