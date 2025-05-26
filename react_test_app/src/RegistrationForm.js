import React, { useState } from 'react';
import {
  validateName,
  validateEmail,
  validateAge,
  validatePostalCode,
} from './validation';

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { first_name, last_name, email, password, birthDate, city, postalCode } = formData;

    if (!first_name || !last_name || !email || !password || !birthDate || !city || !postalCode) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!validateName(first_name) || !validateName(last_name)) {
      setError('Nom ou prénom invalide');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email invalide');
      return;
    }

    if (!validateAge(birthDate)) {
      setError('Vous devez avoir au moins 18 ans');
      return;
    }

    if (!validatePostalCode(postalCode)) {
      setError('Code postal invalide');
      return;
    }

    setError('');
    console.log('Formulaire soumis avec succès', formData);
    // Ici, vous pouvez effectuer une requête API ou autre action
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
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
        placeholder="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="password"
        placeholder="Mot de passe"
        type="password"
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
      {error && (
        <p data-testid="error-message" style={{ color: 'red' }}>
          {error}
        </p>
      )}
    </form>
  );
};

export default RegistrationForm;
