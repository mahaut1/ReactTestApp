import React, { useEffect, useState } from "react";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.utilisateurs);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      <ul>
        {users.map(({ id, name, email, created_at }) => (
          <li key={id}>
            <strong>{name}</strong> — {email} — inscrit le{" "}
            {new Date(created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
