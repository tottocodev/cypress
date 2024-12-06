// cypress/support/e2e.js
import 'cypress-shadow-dom';

Cypress.on('uncaught:exception', (err, runnable) => {
    // Ignora errores no controlados
    return false;
  });
  