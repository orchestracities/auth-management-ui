describe('Test page access', () => {
  it('Admin can access admin pages', () => {
    cy.login('admin@mail.com', 'admin');
    cy.visit('http://localhost:3000');
    cy.waitForReact(2000, '#test');
    /* ==== End Cypress Studio ==== */
  });
  it('User1 cannot access Admin pages', () => {
    cy.login('user1@mail.com', 'user1');
    cy.visit('http://localhost:3000');
    cy.waitForReact(2000, '#test');
    cy.wait(500).contains('Data Management');
    cy.visit('http://localhost:3000/Tenant');
    cy.wait(500).contains('403');
    cy.visit('http://localhost:3000/Service');
    cy.wait(500).contains('403');
    cy.visit('http://localhost:3000/ResourceType');
    cy.wait(500).contains('403');
  });
  it('Not existing pages causes 404', () => {
    cy.login('admin@mail.com', 'admin');
    cy.waitForReact(2000, '#test');
    cy.visit('http://localhost:3000/myPage');
    cy.wait(500).contains('404');
    /* ==== End Cypress Studio ==== */
  });
});

describe('Test Tenants', () => {
  //TODO
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
    cy.waitForReact(2000, '#test');
    //TODO
    /* ==== End Cypress Studio ==== */
  });
  it('Change Language', () => {
    cy.login('user1@mail.com', 'user1');
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000');
    cy.waitForReact(2000, '#test');
    //TODO
    /* ==== End Cypress Studio ==== */
  });
});
