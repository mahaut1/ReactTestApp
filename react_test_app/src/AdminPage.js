import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserList from './UserList';

const AdminPage = () => {
  const [usersCount, setUsersCount] = useState(0);
  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(`${url}/users`);
        setUsersCount(response.data.utilisateurs.length);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    }

    fetchUsers();
  }, [url]);

  return (
    <div>
      <h2>Page Admin</h2>
      <p>{usersCount} utilisateur(s) enregistrés</p>
      <UserList />
    </div>
  );
};

export default AdminPage;
