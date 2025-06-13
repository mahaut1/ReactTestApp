describe('Connexion administrateur échouée', () => {
  it('Affiche une erreur si les identifiants sont invalides', () => {
    cy.visit('http://localhost:3000/ReactTestApp/login');

    cy.get('input[placeholder="Email"]').type('invalide@example.com');
    cy.get('input[placeholder="Mot de passe"]').type('mauvaispass');
    cy.get('button[type="submit"]').click();

    cy.contains('Utilisateur non trouvé', { timeout: 5000 }).should('be.visible');
  });
});



describe('Connexion admin et suppression utilisateur', () => {
  it('Se connecte, est redirigé, supprime un utilisateur non-admin', () => {
    cy.intercept('GET', 'http://localhost:8000/users').as('getUsers');
    cy.intercept('DELETE', 'http://localhost:8000/users/*').as('deleteUser');

    cy.visit('/ReactTestApp/login');

    cy.get('input[name="email"]').type(Cypress.env('ADMIN_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('ADMIN_PASSWORD'));
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/ReactTestApp/admin');

    // Attend que la liste soit chargée
    cy.wait('@getUsers', { timeout: 10000 });

    cy.get('table').should('be.visible');
    cy.get('tbody tr').should('have.length.at.least', 1);

    // ATTENTION ici on attend que LES BOUTONS EXISTENT (retry implicite)
    cy.get('button[data-testid^="delete-button-"]').should('exist').and('have.length.greaterThan', 0);

    // Confirme automatiquement les popup confirm()
    cy.on('window:confirm', () => true);

    // Maintenant on récupère la liste et on agit sur le premier bouton
    cy.get('button[data-testid^="delete-button-"]').then(($btns) => {
      const initialCount = $btns.length;
      cy.log('Nombre de boutons delete avant suppression:', initialCount);

      cy.wrap($btns[0]).click();

      cy.wait('@deleteUser');

      // Si ton front fait un nouveau fetch après suppression
      cy.wait('@getUsers');

      // On vérifie que le nombre de boutons a diminué
      cy.get('button[data-testid^="delete-button-"]').should('have.length.lessThan', initialCount);
    });
  });
});
