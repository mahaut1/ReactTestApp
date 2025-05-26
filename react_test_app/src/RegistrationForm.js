import React, { useState } from 'react';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [error, setError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const validateName = (name) => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(name);
  const validatePostalCode = (code) => /^\d{5}$/.test(code);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!first_name || !last_name || !email || !password || !birthDate || !city || !postalCode) {
      setError('Veuillez remplir tous les champs');
      setFormSubmitted(false);
      return;
    }

    if (!validateName(first_name) || !validateName(last_name)) {
      setError('Nom ou prénom invalide');
      setFormSubmitted(false);
      return;
    }

    if (!validatePostalCode(postalCode)) {
      setError('Code postal invalide');
      setFormSubmitted(false);
      return;
    }

    const user = { first_name, last_name, email, password, birthDate, city, postalCode };
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    setError('');
    setFormSubmitted(true);

    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setBirthDate('');
    setCity('');
    setPostalCode('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="registration-form">
        <input
          name="first_name"
          placeholder="Prénom"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          name="last_name"
          placeholder="Nom"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          name="password"
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="birthDate">Date de naissance</label>
        <input
          id="birthDate"
          name="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
        <input
          name="city"
          placeholder="Ville"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          name="postalCode"
          placeholder="Code Postal"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
        <button type="submit">S'enregistrer</button>

        {error && (
          <p data-testid="error-message" style={{ color: 'red' }}>
            {error}
          </p>
        )}

        {formSubmitted && !error && (
          <p data-testid="success-message" style={{ color: 'green' }}>
            Formulaire soumis avec succès !
          </p>
        )}
      </form>
    </div>
  );
};

export default RegistrationForm;
