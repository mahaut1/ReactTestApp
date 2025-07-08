import React, { useEffect, useState } from "react";
import "./BookList.css";

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://cicd-node-iota.vercel.app/books") 
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur fetch books:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-message">Chargement...</div>;

  return (
    <div className="book-list-container">
      <h2 className="book-list-title">Liste des livres</h2>
      <table className="book-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Auteur</th>
            <th>Année de publication</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td className="book-id">{book._id}</td>
              <td className="book-title">{book.title}</td>
              <td>{book.author}</td>
              <td>{book.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {books.length === 0 && (
        <p className="no-books-message">
          Aucun livre trouvé
        </p>
      )}
    </div>
  );
}

export default BookList;
