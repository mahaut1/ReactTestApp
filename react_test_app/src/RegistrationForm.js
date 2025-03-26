import React, { useState } from 'react';
import { validateName, validateEmail, validateAge, validatePostalCode } from './validation';
import './registrationForm.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    city: '',
    postalCode: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError(''); // Réinitialise les erreurs à chaque soumission

    // Validation des champs
    if (!validateName(formData.firstName) || !validateName(formData.lastName)) {
      setError('Nom ou prénom invalide');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Email invalide');
      return;
    }

    if (!validateAge(formData.birthDate)) {
      setError('Vous devez avoir au moins 18 ans');
      return;
    }

    if (!validatePostalCode(formData.postalCode)) {
      setError('Code postal invalide');
      return;
    }

    // Sauvegarde dans localStorage si tout est valide
    localStorage.setItem('userData', JSON.stringify(formData));
    alert('Enregistrement réussi !');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="firstName">Prénom</label>
      <input
        id="firstName"
        name="firstName"
        placeholder="Prénom"
        value={formData.firstName}
        onChange={handleChange}
      />

      <label htmlFor="lastName">Nom</label>
      <input
        id="lastName"
        name="lastName"
        placeholder="Nom"
        value={formData.lastName}
        onChange={handleChange}
      />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />

      <label htmlFor="birthDate">Date de naissance</label>
      <input
        id="birthDate"
        type="date"
        name="birthDate"
        placeholder="Date de naissance"
        value={formData.birthDate}
        onChange={handleChange}
      />

      <label htmlFor="city">Ville</label>
      <input
        id="city"
        name="city"
        placeholder="Ville"
        value={formData.city}
        onChange={handleChange}
      />

      <label htmlFor="postalCode">Code Postal</label>
      <input
        id="postalCode"
        name="postalCode"
        placeholder="Code Postal"
        value={formData.postalCode}
        onChange={handleChange}
      />

      <button type="submit">S'enregistrer</button>

      {/* Affichage de l'erreur avec data-testid */}
      {error && (
        <p style={{ color: 'red' }} data-testid="error-message">
          {error}
        </p>
      )}
    </form>
  );
};

export default RegistrationForm;
