import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const userEmail = localStorage.getItem('userEmail');


  //deconnexion
  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Affichage de la barre de navigation
  // Si l'utilisateur est connecté, on affiche son email et un bouton de déconnexion
  return (
    <nav style={styles.nav}>
      <div>
        {userEmail ? (
          <span>
            Connecté en tant que : <strong>{isAdmin ? 'Admin' : userEmail}</strong>
          </span>
        ) : (
          <span>Non connecté</span>
        )}
      </div>

      <div>
        {userEmail ? (
          <button onClick={handleLogout} style={styles.button}>
            Déconnexion
          </button>
        ) : (
          <>
            <button onClick={() => navigate('/login')} style={styles.button}>
              Connexion
            </button>
            <button onClick={() => navigate('/register')} style={{ ...styles.button, marginLeft: '10px' }}>
              Inscription
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    width: '40%', // <-- modifié pour occuper toute la largeur
    backgroundColor: '#282c34',
    padding: '1rem',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
  },
  button: {
    backgroundColor: '#cf0202',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
};

export default Navbar;
