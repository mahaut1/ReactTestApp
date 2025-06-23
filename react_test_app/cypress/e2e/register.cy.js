import { faker } from '@faker-js/faker';

let createdEmail = null;

describe('Inscription employé', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("S'inscrit avec succès et est redirigé", () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const uniqueSuffix = Date.now();
    const email = `user_${uniqueSuffix}@example.com`;
    const city = faker.location.city();
    const postalCode = faker.location.zipCode('#####');

    createdEmail = email; // <-- 👈 On le garde pour le afterEach

    cy.visit('http://localhost:3000/ReactTestApp/register');

    cy.get('input[placeholder="Prénom"]').type(firstName);
    cy.get('input[placeholder="Nom"]').type(lastName);
    cy.get('input[placeholder="Email"]').type(email);
    cy.get('input[placeholder="mot de passe"]').type('password123');
    cy.get('input#birthDate').type('1990-01-01');
    cy.get('input[placeholder="Ville"]').type(city);
    cy.get('input[placeholder="Code Postal"]').type(postalCode);

    cy.get('button[type="submit"]').click();

    cy.get('.Toastify__toast', { timeout: 10000 }).should('contain', 'Inscription réussie');
  });

});
