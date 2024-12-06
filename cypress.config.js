const path = require('path');
const fs = require('fs');
const Papa = require('papaparse');

module.exports = {
  e2e: {
    defaultCommandTimeout: 15000, // Reducido para minimizar el tiempo de espera en caso de errores
    pageLoadTimeout: 30000, // Reducido para evitar que Cypress quede esperando cargas lentas
    numTestsKeptInMemory: 1, // Ajustado para mejorar la estabilidad
    experimentalMemoryManagement: true, // Activar manejo de memoria experimental
    retries: {
      runMode: 2, // Reintentar en modo ejecución si falla
      openMode: 1, // Reintentar en modo interactivo si falla
    },
    setupNodeEvents(on, config) {
      on('task', {
        readCsvFile(filePath) {
          const absolutePath = path.resolve(filePath);
          const csvData = fs.readFileSync(absolutePath, 'utf8');
          return Papa.parse(csvData, { header: true }).data;
        },
        writeJsonFile({ path: filePath, data }) {
          return new Promise((resolve, reject) => {
            const dir = path.dirname(filePath);

            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
              if (err) return reject(err);
              resolve('Archivo guardado con éxito');
            });
          });
        }
      });

      // Configuración adicional para Chrome y Electron
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome' || browser.name === 'electron') {
          launchOptions.args.push('--disable-background-timer-throttling');
          launchOptions.args.push('--disable-renderer-backgrounding');
          launchOptions.args.push('--disable-backgrounding-occluded-windows');
          launchOptions.args.push('--incognito');

          // Configuraciones adicionales para Electron
          if (browser.name === 'electron') {
            launchOptions.args.push('--disable-gpu');
            launchOptions.args.push('--disable-software-rasterizer');
            launchOptions.args.push('--disable-accelerated-2d-canvas');
            launchOptions.args.push('--enable-features=NetworkService,NetworkServiceInProcess');
            launchOptions.args.push('--disable-web-security'); // Para reducir problemas de seguridad de red
          }
        }

        return launchOptions;
      });
    },
  },
};