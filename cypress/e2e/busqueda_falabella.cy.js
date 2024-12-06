const fs = require('fs'); // Para guardar los reportes en un archivo

describe('Validación de precios en Falabella con manejo optimizado', () => {
  let productos; // Variable para almacenar los datos del CSV
  let fallos = []; // Array para almacenar los fallos

  before(() => {
    const csvFilePath = process.env.CYPRESS_CSV_PATH || 'cypress/fixtures/productos.csv'; // Path dinámico
    cy.task('readCsvFile', csvFilePath).then((data) => {
      productos = data; // Asignar los datos
    });
  });

  after(() => {
    // Guardar los fallos en un archivo JSON después de que terminen todas las pruebas
    if (fallos.length > 0) {
      const reportPath = 'cypress/reports/fallos.json';
      cy.log(`Guardando el reporte de fallos en ${reportPath}`);
      cy.task('writeJsonFile', { path: reportPath, data: fallos });
    }
  });

  it('Procesa y valida productos', () => {
    // Visitar Falabella solo una vez
    cy.visit('https://www.falabella.com.co/falabella-co');

    // Bucle para validar productos
    cy.wrap(productos).each((producto) => {
      cy.log(`Procesando producto: ${producto['id de producto']}`);
      if (producto['id de producto'] && producto.precio) {
        // Buscar el producto
        cy.get('input#testId-SearchBar-Input')
          .should('be.visible')
          .clear() // Limpiar la barra de búsqueda antes de la nueva búsqueda
          .type(`${producto['id de producto']}{enter}`);

        // Esperar un momento para que se carguen los resultados
        cy.wait(3000); // Ajusta este tiempo si es necesario

        // Verificar si hay un mensaje de "no encontramos resultados"
        cy.get('body').then(($body) => {
          if ($body.find('span[class*="jsx-"]').text().includes('no encontramos resultados')) {
            cy.log(`No se encontraron resultados para el producto ${producto['id de producto']}`);
            fallos.push({
              id: producto['id de producto'],
              error: 'Producto no encontrado',
            });
          } else {
            // Buscar el precio solo si hay resultados
            cy.get('span.copy12.primary.senary.bold.line-height-29', { timeout: 10000 })
              .should('be.visible')
              .invoke('text')
              .then((precioCapturado) => {
                const precioNumerico = parseFloat(precioCapturado.replace(/[^\d]/g, ''));
                cy.log(`Precio capturado: ${precioNumerico}`);
                cy.log(`Precio esperado: ${producto.precio}`);

                if (precioNumerico !== parseFloat(producto.precio)) {
                  fallos.push({
                    id: producto['id de producto'],
                    error: 'Precio incorrecto',
                    esperado: producto.precio,
                    capturado: precioNumerico,
                  });
                  // Tomar captura solo para errores críticos
                  if (Math.abs(precioNumerico - parseFloat(producto.precio)) > 1000) {
                    cy.screenshot(`Error_${producto['id de producto']}`);
                  }
                }
              });
          }
        });
      } else {
        cy.log('Producto o precio faltante en el archivo CSV.');
      }
    });
  });

  after(() => {
    // Limpieza del navegador después de que terminen todas las pruebas
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.log('Cookies y almacenamiento local limpiados al finalizar todas las pruebas.');
  });
});