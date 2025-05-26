import React from "react";
import RegistrationForm from "./RegistrationForm";
import UsersList from "./UsersList";

function App() {
  return (
    <div>
      <h1>Gestion des utilisateurs</h1>
      <RegistrationForm />
      <UsersList />
    </div>
  );
}

export default App;
