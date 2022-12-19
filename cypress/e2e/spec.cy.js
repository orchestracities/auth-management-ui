describe('Test page access', () => {
  it('Admin can access admin pages', () => {
    cy.login('admin@mail.com', 'admin');
    cy.waitForReact();
    cy.visit('http://localhost:3000');
    cy.wait(500).contains('Security');
    cy.wait(500).contains('Data Management');
    cy.wait(500).contains('Administration');
    cy.wait(500).contains('Tenants');
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/Tenant');
    cy.visit('http://localhost:3000/Tenant');
    // TODO
    /* ==== End Cypress Studio ==== */
  });
  it('User1 cannot access Tenant page', () => {
    cy.login('user1@mail.com', 'user1');
    /* ==== Generated with Cypress Studio ==== */
    cy.waitForReact();
    cy.visit('http://localhost:3000');
    // cy.wait(500).contains('Security');
    // cy.wait(500).contains('Data Management');
    // cy.wait(500).contains('Administration');
    // cy.wait(500).contains('Tenants');
    // cy.visit('http://localhost:3000/Entity');
    // cy.visit('http://localhost:3000/Policy');

    // TODO
  });
});

describe('Test Services', () => {
  //TODO
});

describe('Test Policies', () => {
  //TODO
});

describe('Test Resource Type', () => {
  //TODO
});

describe('Test Toolbar', () => {
  it('Change Tenant', () => {
    cy.login('admin@mail.com', 'admin');
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000');
    cy.waitForReact();
    //TODO
    /* ==== End Cypress Studio ==== */
  });
  it('Change Language', () => {
    cy.login('user1@mail.com', 'user1');
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000');
    cy.waitForReact();
    //TODO
    /* ==== End Cypress Studio ==== */
  });
});
