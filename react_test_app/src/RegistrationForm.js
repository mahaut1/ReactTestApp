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
  const [success, setSuccess] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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

    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Erreur lors de l'enregistrement");
        return;
      }

      setSuccess('Enregistrement réussi !');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        city: '',
        postalCode: '',
      });
    } catch {
      setError("Erreur de connexion au serveur");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="registration-form">
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

      {error && <p className="error-message" data-testid="error-message">{error}</p>}
      {success && <p className="success-message" data-testid="success-message">{success}</p>}
    </form>
  );
};

export default RegistrationForm;
