import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../src/NavBar';
import { BrowserRouter } from 'react-router-dom';

// Mock du useNavigate
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Wrapper pour le BrowserRouter
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Navbar', () => {
  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('affiche "Non connecté" si aucun utilisateur', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText('Non connecté')).toBeInTheDocument();
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByText('Inscription')).toBeInTheDocument();
  });

  test('affiche "Admin" si admin connecté', () => {
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('userEmail', 'admin@test.com');
    renderWithRouter(<Navbar />);
    expect(screen.getByText(/Connecté en tant que :/)).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Déconnexion')).toBeInTheDocument();
  });

  test('affiche l\'email si utilisateur non admin connecté', () => {
    localStorage.setItem('isAdmin', 'false');
    localStorage.setItem('userEmail', 'user@test.com');
    renderWithRouter(<Navbar />);
    expect(screen.getByText(/Connecté en tant que :/)).toBeInTheDocument();
    expect(screen.getByText('user@test.com')).toBeInTheDocument();
  });

  test('clique sur "Déconnexion" redirige vers /login', () => {
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('userEmail', 'admin@test.com');
    localStorage.setItem('userId', '1');
    renderWithRouter(<Navbar />);
    fireEvent.click(screen.getByText('Déconnexion'));
    expect(localStorage.getItem('isAdmin')).toBe(null);
    expect(localStorage.getItem('userEmail')).toBe(null);
    expect(localStorage.getItem('userId')).toBe(null);
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  test('clique sur "Connexion" redirige vers /login', () => {
    renderWithRouter(<Navbar />);
    fireEvent.click(screen.getByText('Connexion'));
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  test('clique sur "Inscription" redirige vers /register', () => {
    renderWithRouter(<Navbar />);
    fireEvent.click(screen.getByText('Inscription'));
    expect(mockedNavigate).toHaveBeenCalledWith('/register');
  });
});
