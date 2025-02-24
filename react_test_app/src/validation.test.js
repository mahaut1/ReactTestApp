import { validateName, validateEmail, validateAge, validatePostalCode } from './validation';

describe('Validation Functions', () => {
    test('validateName returns true for valid names', () => {
        expect(validateName('Jean Dupont')).toBe(true); // Exemple de nom valide
        expect(validateName('Élise Dupont')).toBe(true); // Exemple avec accent
        expect(validateName('Jean-Paul Dupont')).toBe(true); // Exemple avec tiret
    });

    test('validateName returns false for invalid names', () => {
        expect(validateName('Jean123')).toBe(false); // Numéros dans le nom
        expect(validateName('Élise123')).toBe(false); // Numéros dans le nom
        expect(validateName('Dupont!')).toBe(false); // Caractère spécial interdit
    });

    test('validateEmail returns true for valid emails', () => {
        expect(validateEmail('test@example.com')).toBe(true);
        expect(validateEmail('hello.world@domain.co')).toBe(true);
    });

    test('validateEmail returns false for invalid emails', () => {
        expect(validateEmail('invalidEmail')).toBe(false);
        expect(validateEmail('test@.com')).toBe(false);
        expect(validateEmail('test@com')).toBe(false);
    });

    test('validateAge returns true for 18+ users', () => {
        expect(validateAge('2000-01-01')).toBe(true); // Âge valide (plus de 18 ans)
    });

    test('validateAge returns false for under 18 users', () => {
        expect(validateAge('2010-01-01')).toBe(false); // Âge invalide (moins de 18 ans)
    });

    test('validatePostalCode returns true for valid postal codes', () => {
        expect(validatePostalCode('75001')).toBe(true); // Code postal valide
        expect(validatePostalCode('12345')).toBe(true); // Autre code postal valide
    });

    test('validatePostalCode returns false for invalid postal codes', () => {
        expect(validatePostalCode('123')).toBe(false); // Trop court
        expect(validatePostalCode('abcde')).toBe(false); // Contient des lettres
        expect(validatePostalCode('750012')).toBe(false); // Trop long
    });
});
