import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookList from './BookList';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.utilisateurs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des utilisateurs :", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Confirmer la suppression de cet utilisateur ?");
    if (!confirmDelete) return;

    try {
      setDeletingUserId(id);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Erreur :", error);
      alert("La suppression a échoué.");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleAddBook = () => {
    navigate('/add-book');
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des utilisateurs</h1>
       
      </div>
    
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Prénom</th>
            <th className="border p-2">Nom</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Date de naissance</th>
            <th className="border p-2">Ville</th>
            <th className="border p-2">Code postal</th>
            <th className="border p-2">Admin</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.id}</td>
              <td className="border p-2">{u.firstName}</td>
              <td className="border p-2">{u.lastName}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.birthDate}</td>
              <td className="border p-2">{u.city}</td>
              <td className="border p-2">{u.postalCode}</td>
              <td className="border p-2">{u.isAdmin ? "✅" : "❌"}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => deleteUser(u.id)}
                  disabled={deletingUserId === u.id}
                  className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ${
                    deletingUserId === u.id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  data-testid={`delete-button-${u.id}`}
                >
                  {deletingUserId === u.id ? "Suppression..." : "Supprimer"}
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="9" className="border p-2 text-center">
                Aucun utilisateur trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>

<hr />


  <button
        onClick={handleAddBook}
         
      >
        formulaire d'ajout de livre
      </button>

      <BookList />
  
     </div>
  );
};

export default UserList;
