/**
 * Valide un nom, un prénom ou une ville en s'assurant qu'il ne contient que des lettres, des accents, des espaces, des apostrophes et des tirets.
 * @param {string} name - Le nom à valider.
 * @returns {boolean} `true` si le nom est valide, sinon `false`.
 */
export function validateName(name) {
    return /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/.test(name);
}

/**
 * Valide une adresse e-mail.
 * @param {string} email - L'email à valider.
 * @returns {boolean} `true` si l'email est valide, sinon `false`.
 */
export function validateEmail(email) {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    console.log(`Validation email pour "${email}": ${isValid}`);
    return isValid;
}

/**
 * Vérifie si l'âge de l'utilisateur est d'au moins 18 ans.
 * @param {string} dateOfBirth - La date de naissance (format YYYY-MM-DD).
 * @returns {boolean} `true` si l'utilisateur a 18 ans ou plus, sinon `false`.
 */
export function validateAge(dateOfBirth) {
    const now = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    const dayDiff = now.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        return age - 1 >= 18;
    }
    return age >= 18;
}

/**
 * Valide un code postal français (5 chiffres).
 * @param {string} postalCode - Le code postal à valider.
 * @returns {boolean} `true` si le code postal est valide, sinon `false`.
 */
export function validatePostalCode(postalCode) {
    return /^[0-9]{5}$/.test(postalCode);
}
