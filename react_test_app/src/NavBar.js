import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    navigate('/login');
  };

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
      {userEmail && <button onClick={handleLogout} style={styles.button}>Déconnexion</button>}
    </nav>
  );
};

const styles = {
nav: {
  position: 'fixed',
  top: 0,
  width: '100%',
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
  }
};

export default Navbar;
