describe('Formulaire d’inscription - erreurs', () => {
  it('Affiche les erreurs et reste sur la page', () => {
    cy.visit('http://localhost:3000/ReactTestApp/register');

    // Champ vide ou invalide
    cy.get('input[placeholder="Prénom"]').type('123');
    cy.get('input[placeholder="Email"]').type('not-an-email');
    cy.get('input[placeholder="mot de passe"]').type('123');
    cy.get('input#birthDate').type('2020-01-01'); // Trop jeune
    cy.get('input[placeholder="Code Postal"]').type('ABCDE');

    cy.get('button[type="submit"]').should('be.disabled');

    // Vérifie que les messages d’erreur sont visibles
    cy.contains('Prénom invalide').should('exist');
    cy.contains('Email invalide').should('exist');
    cy.contains('Mot de passe trop court').should('exist');
    cy.contains('Vous devez avoir au moins 18 ans').should('exist');
    cy.contains('Code postal invalide').should('exist');
  });
});
