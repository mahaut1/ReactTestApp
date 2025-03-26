import React, { useState } from 'react';
import { validateName, validateEmail, validateAge, validatePostalCode } from './validation';
import './registrationForm.css'

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

        // Sauvegarde dans localStorage
        localStorage.setItem('userData', JSON.stringify(formData));
        setError('');
        alert('Enregistrement réussi !');
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <input name="firstName" placeholder="Prénom" value={formData.firstName} onChange={handleChange} />
            <input name="lastName" placeholder="Nom" value={formData.lastName} onChange={handleChange} />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input type="date" placeholder="Date de naissance" name="birthDate" value={formData.birthDate} onChange={handleChange} />
            <input name="city" placeholder="Ville" value={formData.city} onChange={handleChange} />
            <input name="postalCode" placeholder="Code postal" value={formData.postalCode} onChange={handleChange} />
            <button type="submit">S'enregistrer</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default RegistrationForm;

