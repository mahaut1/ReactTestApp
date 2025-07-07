import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../LoginFile';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock de useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Mock de localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value),
    clear: () => (store = {}),
    removeItem: (key) => delete store[key],
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('LoginPage', () => {
  const apiUrl = 'http://localhost:8000';
  beforeEach(() => {
    process.env.REACT_APP_API_URL = apiUrl;
    window.localStorage.clear();
    mockedNavigate.mockClear();
  });

  const setup = () => {
    return render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  };

  it('affiche les champs email et mot de passe', () => {
    setup();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('effectue une connexion réussie et redirige vers /admin pour un admin', async () => {
    const user = {
      user_id: 1,
      is_admin: true,
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(user),
      })
    );

    setup();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'admin@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'adminpass' },
    });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${apiUrl}/users/login`, expect.anything());
      expect(localStorage.getItem('userId')).toBe('1');
      expect(localStorage.getItem('isAdmin')).toBe('true');
      expect(mockedNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  it('redirige vers / pour un utilisateur non admin', async () => {
    const user = {
      user_id: 2,
      is_admin: false,
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(user),
      })
    );

    setup();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'userpass' },
    });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('affiche un message d’erreur si la connexion échoue', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ detail: 'Identifiants incorrects' }),
      })
    );

    setup();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/identifiants incorrects/i)).toBeInTheDocument();
    });
  });
});
