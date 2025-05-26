const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // Indique le dossier où se trouvent tes tests end-to-end
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

    baseUrl: 'http://localhost:3000', // adapte selon ton app React
  },
})
