describe('Homepage', () => {
    it('Loads homepage and shows form', () => {
      cy.visit('http://localhost:3000');
      cy.contains('Bienvenue');
    });
  });
  