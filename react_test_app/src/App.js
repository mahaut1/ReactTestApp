import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import LoginPage from './LoginFile';
import AdminPage from './AdminPage';
import RequireAdmin from './RequireAdmin';
import HomePage from './HomePage';
import Navbar from './NavBar';
import RegistrationBook from './RegisterBook';

function App() {
  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        <h1>User Manager</h1>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path ="/add-book" element={<RegistrationBook/>} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />
<Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </div>
  );
}

export default App;
