import React, { use } from 'react';
import RegistrationForm from './RegistrationForm';
import './App.css'
import axios from 'axios';
import { useState, useEffect } from 'react';
function App() {
  console.log(process.env);
  const url =process.env.REACT_APP_API_URL;

  let [usersCount, setUsersCount] = useState(0);
  useEffect(() => {
    async function countUsers() {
      try {
        const api= axios.create({
          baseURL: `${url}`,
        });
        const response = await api.get('/users');
        console.log(response.data);
        setUsersCount(response.data.utilisateurs.length);
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre d\'utilisateurs:', error);
      }
    }
    countUsers();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Users manager</h1>
        <p>{usersCount} user(s) already registered</p>
        </header>
        <h1>Formulaire d'Enregistrement</h1>
        <RegistrationForm />
    </div>

  );
}

export default App;
