const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:3000',
    env: {
      ADMIN_EMAIL: process.env.CYPRESS_ADMIN_EMAIL,
      ADMIN_PASSWORD: process.env.CYPRESS_ADMIN_PASSWORD,
    },
  },
})
