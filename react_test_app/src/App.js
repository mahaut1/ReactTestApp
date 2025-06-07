import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import LoginPage from './LoginFile';
import AdminPage from './AdminPage';
import RequireAdmin from './RequireAdmin';
import HomePage from './HomePage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>User Manager</h1>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
