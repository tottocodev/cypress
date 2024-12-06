// Importar librerías necesarias
/*const Papa = require('papaparse');
const fs = require('fs');

describe('Búsqueda en Falabella utilizando CSV', () => {
  let productos; // Variable para almacenar los datos del CSV

  before(() => {
    // Leer el archivo CSV y convertirlo en un array de objetos
    const csvFilePath = 'cypress/fixtures/productos.csv'; // Ruta del CSV
    const csvData = fs.readFileSync(csvFilePath, 'utf8'); // Leer archivo
    productos = Papa.parse(csvData, { header: true }).data; // Convertir a JSON
  });

  it('Debería buscar los productos especificados en el CSV', () => {
    productos.forEach((producto) => {
      // Visitar la página principal de Falabella
      cy.visit('https://www.falabella.com.co/falabella-co');

      // Escribir el término de búsqueda y presionar Enter
      cy.get('input#testId-SearchBar-Input')
        .should('be.visible') // Asegurarse de que el buscador sea visible
        .type(`${producto.Producto}{enter}`); // Escribir el término y presionar Enter

      // Validar que la URL contiene el término buscado
      cy.url().should('include', producto.Producto);

      // Validar que al menos un resultado es visible
      cy.get('.pod-details')
        .should('have.length.greaterThan', 0); // Asegurar que hay resultados
    });
  });
});*/
