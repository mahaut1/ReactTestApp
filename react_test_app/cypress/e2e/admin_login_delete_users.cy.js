describe('Connexion admin et suppression utilisateur', () => {
  it('Se connecte, est redirigé, supprime un utilisateur non-admin', () => {
    // Interceptions
    cy.intercept('GET', '**/users').as('getUsers');
    cy.intercept('DELETE', '**/users/*').as('deleteUser');

    cy.visit('/ReactTestApp/login');

    cy.get('input[name="email"]').type(Cypress.env('ADMIN_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('ADMIN_PASSWORD'));
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/ReactTestApp/admin');

    cy.wait('@getUsers', { timeout: 10000 });

    cy.get('table').should('be.visible');
    cy.get('tbody tr').should('have.length.at.least', 1);

    cy.get('button[data-testid^="delete-button-"]').should('have.length.greaterThan', 0);

    cy.on('window:confirm', () => true);

    cy.get('tbody tr').filter((index, row) => {
      const isAdminText = row.cells[7].innerText.trim();
      return isAdminText === "❌"; // On filtre que les non-admin
    }).first().within(() => {
      cy.get('button[data-testid^="delete-button-"]').scrollIntoView().should('be.visible').click();
    });

    cy.wait('@deleteUser');

    cy.wait(1000);

    cy.get('button[data-testid^="delete-button-"]').should('have.length.lessThan', 40);
  });
});
