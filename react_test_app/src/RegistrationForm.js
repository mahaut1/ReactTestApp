import React, { useState } from 'react';
import { validateName, validateEmail, validateAge, validatePostalCode } from './validation';
import './registrationForm.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
    city: '',
    postalCode: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateName(formData.firstName) || !validateName(formData.lastName)) {
      setError('Nom ou prénom invalide');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Email invalide');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Mot de passe trop court (minimum 6 caractères)');
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Erreur lors de l\'inscription');
      }

      setSuccess('Enregistrement réussi !');
      localStorage.setItem('userData', JSON.stringify(formData));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="firstName">Prénom</label>
      <input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />

      <label htmlFor="lastName">Nom</label>
      <input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />

      <label htmlFor="password">Mot de passe</label>
      <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} />

      <label htmlFor="birthDate">Date de naissance</label>
      <input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />

      <label htmlFor="city">Ville</label>
      <input id="city" name="city" value={formData.city} onChange={handleChange} />

      <label htmlFor="postalCode">Code Postal</label>
      <input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} />

      <button type="submit">S'enregistrer</button>

      {error && <p style={{ color: 'red' }} data-testid="error-message">{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default RegistrationForm;
