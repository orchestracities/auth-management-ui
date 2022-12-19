import 'cypress-react-selector';

// Always preserve session related cookies.
Cypress.Cookies.defaults({
  preserve: isSessionCookie
});

Cypress.Commands.add('login', (username, password) => {
  //cy.session([username, password], () => {
  cy.visit('http://localhost:3000');
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.wait(100).get('form').contains('Sign In').click();
  //})
});

Cypress.on('uncaught:exception', (err, runnable) => {
  //TODO: this is required because the exception is not handled by the ui.
  if (err.message.includes('Expected Iterable, but did not find one for field "Query.getUserPreferences"')) {
    return false;
  }
  // we still want to ensure there are no other unexpected
  // errors, so we let them fail the test
});

function isSessionCookie(name) {
  return name.startsWith('KEYCLOAK_') || name.startsWith('AUTH_SESSION_');
}
