import React, { useState } from "react";
import '../src/registrationForm.css'; // Assurez-vous d'avoir ce fichier CSS pour le style

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    birthDate: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateAge = (birthDate) => {
    if (!birthDate) return false;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password ||
      !formData.birthDate
    ) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (!validateAge(formData.birthDate)) {
      setError("Vous devez être majeur (18 ans minimum)");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          birth_date: formData.birthDate,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Erreur lors de l’enregistrement");
        return;
      }

      setSuccess("Enregistrement réussi !");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        birthDate: "",
      });
    } catch {
      setError("Erreur de connexion au serveur");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <label>
        Date de naissance :
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
        />
      </label>
      <button type="submit">S'enregistrer</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
};

export default RegistrationForm;
