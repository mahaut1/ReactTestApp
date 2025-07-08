import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './RegisterBook.css';

function RegistrationBook() {
  const [formData, setFormData] = useState({
    title: '',
    author: '', 
    year: '',
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        return value.trim().length >= 2 ? '' : 'Le titre doit contenir au moins 2 caractères';
      case 'author':
        return value.trim().length >= 2 ? '' : 'L\'auteur doit contenir au moins 2 caractères';
      case 'year':
        const currentYear = new Date().getFullYear();
        const yearNum = parseInt(value);
        return yearNum >= 0 && yearNum <= currentYear ? '' : `L'année doit être entre 0 et ${currentYear}`;
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
      const response = await axios.post('https://cicd-node-iota.vercel.app/books', formData); 
      toast.success('Livre ajouté avec succès ! 📚');
      console.log(response.data);

      // Réinitialisation du formulaire
      setFormData({
        title: '',
        author: '',
        year: '',
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
      formData.title.trim().length >= 2 &&
      formData.author.trim().length >= 2 &&
      formData.year.trim().length > 0 &&
      !errors.title &&
      !errors.author &&
      !errors.year
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} data-cy="registration-form">
        <input
          type="text"
          name="title"
          placeholder="Titre du livre"
          value={formData.title}
          onChange={handleChange}
          data-cy="input-title"
        />
        {errors.title && <span id='error-title' className="error" data-cy="error-title">{errors.title}</span>}

        <input
          type="text"
          name="author"
          placeholder="Auteur"
          value={formData.author}
          onChange={handleChange}
          data-cy="input-author"
        />
        {errors.author && <span id='error-author' className="error" data-cy="error-author">{errors.author}</span>}

        <input
          type="number"
          name="year"
          placeholder="Année de publication"
          value={formData.year}
          onChange={handleChange}
          data-cy="input-year"
          min="0"
          max={new Date().getFullYear()}
        />
        {errors.year && <span id='error-year' className="error" data-cy="error-year">{errors.year}</span>}

        <button type="submit" disabled={!isFormValid()}>
          Ajouter le livre
        </button>
      </form>
      <ToastContainer />
    </>
  );
}

export default RegistrationBook;
