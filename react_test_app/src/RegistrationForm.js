import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import {
  validateName,
  validateEmail,
  validateAge,
  validatePostalCode
} from './validation';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './registrationForm.css';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
    city: '',
    postalCode: ''
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return validateName(value) ? '' : 'Prénom invalide';
      case 'lastName':
        return validateName(value) ? '' : 'Nom invalide';
      case 'email':
        return validateEmail(value) ? '' : 'Email invalide';
      case 'password':
        return value.length >= 6 ? '' : 'Mot de passe trop court';
      case 'birthDate':
        return value && !validateAge(value) ? 'Vous devez avoir au moins 18 ans' : '';
      case 'postalCode':
        return validatePostalCode(value) ? '' : 'Code postal invalide';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Mise à jour de l'erreur liée à ce champ
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const validateAll = () => {
    const newErrors = {};
    for (const field in formData) {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (validateAll()) {
    try {
      const response = await axios.post('http://localhost:8000/users', formData); 
      toast.success('Inscription réussie ! 🎉');
      console.log(response.data);

      // Réinitialisation du formulaire
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        birthDate: '',
        city: '',
        postalCode: ''
      });
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        toast.error(`Erreur : ${error.response.data.detail}`);
      } else {
        toast.error('Une erreur est survenue lors de l’inscription.');
      }
      console.error(error);
    }
  }
};


  const isFormValid = () => {
    return (
      validateName(formData.firstName) &&
      validateName(formData.lastName) &&
      validateEmail(formData.email) &&
      formData.password.length >= 6 &&
      (!formData.birthDate || validateAge(formData.birthDate)) &&
      validatePostalCode(formData.postalCode)
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="Prénom"
          value={formData.firstName}
          onChange={handleChange}
        />
        {errors.firstName && <span className="error">{errors.firstName}</span>}

        <input
          type="text"
          name="lastName"
          placeholder="Nom"
          value={formData.lastName}
          onChange={handleChange}
        />
        {errors.lastName && <span className="error">{errors.lastName}</span>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <input
          type="password"
          name="password"
          placeholder="mot de passe"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}

        <label htmlFor="birthDate">Date de naissance</label>
        <input
          type="date"
          name="birthDate"
          id="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
        />
        {errors.birthDate && <span className="error">{errors.birthDate}</span>}

        <input
          type="text"
          name="city"
          placeholder="Ville"
          value={formData.city}
          onChange={handleChange}
        />
        {/* Pas de validation spécifique pour la ville */}

        <input
          type="text"
          name="postalCode"
          placeholder="Code Postal"
          value={formData.postalCode}
          onChange={handleChange}
        />
        {errors.postalCode && <span className="error">{errors.postalCode}</span>}

        <button type="submit" disabled={!isFormValid()}>
          S'enregistrer
        </button>
      </form>
      <ToastContainer />
    </>
  );
}

export default RegistrationForm;
