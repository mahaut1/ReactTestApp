import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h2>Bienvenue</h2>
      <p>Utilisez les liens ci-dessous pour vous inscrire, vous connecter ou accéder à la page admin si vous êtes autorisé.</p>
      <ul>
        <li><Link to="/register">Inscription</Link></li>
        <li><Link to="/login">Connexion</Link></li>
        <li><Link to="/admin">Page Admin</Link></li>
      </ul>
    </div>
  );
};

export default HomePage;
