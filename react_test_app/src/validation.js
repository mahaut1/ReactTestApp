export function validateName(name) {
    return /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/.test(name);
}

export function validateEmail(email) {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    console.log(`Validation email pour "${email}": ${isValid}`);
    return isValid;
}


export function validateAge(dateOfBirth) {
    const now = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    const dayDiff = now.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        return age - 1;
    }
    return age >= 18;
}

export function validatePostalCode(postalCode) {
    return /^[0-9]{5}$/.test(postalCode);
}
