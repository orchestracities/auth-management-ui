describe('Test page access', () => {
  it('Admin can access Tenant page', () => {
    cy.login('admin@mail.com','admin');
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/Tenant');
    cy.waitForReact();
    // TODO 
    /* ==== End Cypress Studio ==== */
  });
  it('User1 cannot access Tenant page', () => {
    // TODO
  });
  it('User1 can access Policy page', () => {
    // TODO
  });
})

describe('Test Tenants', () => {
  it('Create NewTenant with no configuration', () => {
    cy.login('admin@mail.com','admin');
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/Tenant');
    cy.waitForReact();

    // TODO there is an unhandle exception the first time a user login: > Expected Iterable, but did not find one for field "Query.getUserPreferences".

    cy.contains('Tenant1');
    cy.contains('Tenant2');
    cy.get('[data-testid="AddIcon"]').click({ force: true });
    cy.get('#Name').clear('NewTenant');
    cy.get('#Name').type('NewTenant');
    cy.get('.MuiToolbar-root > .MuiButton-root').click();
    cy.wait(500).contains('NewTenant');

    //TODO: css identifier like '.css-1jq2n4l' are not very useful to support automated testing.
    //it is almost impossible to identify the correct item for a tenant.
    //it would be much easier if you could inject or the tenant name or the id as css class
    cy.get(
      '[style="opacity: 1; transform: none; transform-origin: 0px 0px 0px; transition: opacity 0ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 0ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;"] > .css-1jq2n4l > .MuiCardHeader-root > .MuiCardHeader-action > .MuiBox-root > .MuiSpeedDial-root > #SpeedDialbasicexample-actions > [style="transition-delay: 30ms;"] > [data-testid="DeleteIcon"]'
    ).click({ force: true });

    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();
    /* ==== End Cypress Studio ==== */
  });
  it('Create NewTenant with configuration', () => {
    cy.login('admin@mail.com','admin');
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/Tenant');
    cy.waitForReact();
    // TODO 
    /* ==== End Cypress Studio ==== */
  });
  it('Modify Tenant1 configuration', () => {
    cy.login('admin@mail.com','admin');
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/Tenant');
    cy.waitForReact();
    // TODO 
    /* ==== End Cypress Studio ==== */
  });
})

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
    cy.login('admin@mail.com','admin');
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000');
    cy.waitForReact();
    //TODO
    /* ==== End Cypress Studio ==== */
  });
  it('Change Language', () => {
    cy.login('admin@mail.com','admin');
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000');
    cy.waitForReact();
    //TODO
    /* ==== End Cypress Studio ==== */
  });
})
