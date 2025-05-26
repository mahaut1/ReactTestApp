import React, { useState } from "react";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Simple validation (à compléter selon besoin)
    if (!formData.name || !formData.email || !formData.password) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Erreur lors de l'enregistrement");
      } else {
        setSuccess("Enregistrement réussi !");
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (err) {
      setError("Erreur réseau");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nom complet</label>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nom complet"
      />

      <label>Email</label>
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />

      <label>Mot de passe</label>
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Mot de passe"
      />

      <button type="submit">S'enregistrer</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
};

export default RegistrationForm;
