import React from "react";
import RegistrationForm from "./RegistrationForm";
import UserList from "./UserList";

function App() {
  return (
    <div>
      <h1>Formulaire d'enregistrement</h1>
      <RegistrationForm />
      <h1>Liste des utilisateurs</h1>
      <UserList />
    </div>
  );
}

export default App;
