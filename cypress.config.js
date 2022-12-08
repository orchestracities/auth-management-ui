const { defineConfig } = require('cypress')

module.exports = defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  env: {
    'cypress-react-selector': {
      root: '#root',
    },
  },
  e2e: {
    experimentalStudio: true,
    baseUrl: "http://localhost:3000",
    chromeWebSecurity: false,
    experimentalSessionAndOrigin: true
  }
})