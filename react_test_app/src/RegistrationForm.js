import React, { useState } from 'react';
import { validateName, validateEmail, validateAge, validatePostalCode } from './validation';
import './registrationForm.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
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

    const { first_name, last_name, email, password, birthDate, city, postalCode } = formData;
    // Empty fields check
    if (!first_name || !last_name || !email || !password || !birthDate || !city || !postalCode) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    // Name validation
    if (!validateName(first_name) || !validateName(last_name)) {
      setError('Nom ou prénom invalide');
      return;
    }
    // Email validation
    if (!validateEmail(email)) {
      setError('Email invalide');
      return;
    }
    // Age validation
    if (!validateAge(birthDate)) {
      setError('Vous devez avoir au moins 18 ans');
      return;
    }
    // Postal code validation
    if (!validatePostalCode(postalCode)) {
      setError('Code postal invalide');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
          birth_date: birthDate,
          city,
          postal_code: postalCode
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Erreur lors de l'enregistrement");
        return;
      }
      setSuccess('Enregistrement réussi !');
      setFormData({
        first_name: '', last_name: '', email: '', password: '', birthDate: '', city: '', postalCode: ''
      });
    } catch {
      setError('Erreur de connexion au serveur');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="registration-form">
      <input
        name="first_name"
        placeholder="Prénom"
        value={formData.first_name}
        onChange={handleChange}
      />
      <input
        name="last_name"
        placeholder="Nom"
        value={formData.last_name}
        onChange={handleChange}
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Mot de passe"
        value={formData.password}
        onChange={handleChange}
      />
      <label htmlFor="birthDate">Date de naissance</label>
      <input
        id="birthDate"
        name="birthDate"
        type="date"
        value={formData.birthDate}
        onChange={handleChange}
      />
      <input
        name="city"
        placeholder="Ville"
        value={formData.city}
        onChange={handleChange}
      />
      <input
        name="postalCode"
        placeholder="Code Postal"
        value={formData.postalCode}
        onChange={handleChange}
      />
      <button type="submit">S'enregistrer</button>
      {error && <p style={{ color: 'red' }} data-testid="error-message">{error}</p>}
      {success && <p style={{ color: 'green' }} data-testid="success-message">{success}</p>}
    </form>
  );
};

export default RegistrationForm;
