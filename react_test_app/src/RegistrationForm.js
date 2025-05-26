// src/RegistrationForm.jsx
import React, { useState } from 'react'
import { validateName, validateEmail, validateAge } from './validation'
import './registrationForm.css'

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const apiUrl = process.env.REACT_APP_API_URL

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Tous les champs doivent être remplis
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.birthDate
    ) {
      setError('Veuillez remplir tous les champs')
      return
    }
    // Validation nom / prénom
    if (!validateName(formData.firstName) || !validateName(formData.lastName)) {
      setError('Nom ou prénom invalide')
      return
    }
    // Validation email
    if (!validateEmail(formData.email)) {
      setError('Email invalide')
      return
    }
    // Validation âge
    if (!validateAge(formData.birthDate)) {
      setError('Vous devez avoir au moins 18 ans')
      return
    }

    try {
      const res = await fetch(`${apiUrl}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          birth_date: formData.birthDate,
        }),
      })
      if (!res.ok) {
        const { detail } = await res.json()
        setError(detail || 'Erreur lors de l’enregistrement')
        return
      }
      setSuccess('Enregistrement réussi !')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        birthDate: '',
      })
    } catch {
      setError('Erreur de connexion au serveur')
    }
  }

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
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />

      <label htmlFor="password">Mot de passe</label>
      <input
        id="password"
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
        placeholder="Date de naissance"
        value={formData.birthDate}
        onChange={handleChange}
      />

      <button type="submit">S'enregistrer</button>

      {error && (
        <p data-testid="error-message" style={{ color: 'red' }}>
          {error}
        </p>
      )}
      {success && (
        <p data-testid="success-message" style={{ color: 'green' }}>
          {success}
        </p>
      )}
    </form>
  )
}
