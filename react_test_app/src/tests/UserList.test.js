import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserList from '../UserList';

// Mock BookList component since it makes its own fetch calls
jest.mock('../BookList', () => {
  return function MockBookList() {
    return <div data-testid="book-list">Mocked BookList</div>;
  };
});

// Helper function to render UserList with Router context
const renderWithRouter = (ui) => {
  return render(
    <MemoryRouter>
      {ui}
    </MemoryRouter>
  );
};

// Mock global fetch
global.fetch = jest.fn();

// Mock environment variable
const originalEnv = process.env;

describe('UserList', () => {
  const mockUsers = {
    utilisateurs: [
      {
        id: 1,
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        birthDate: '1985-06-15',
        city: 'Paris',
        postalCode: '75000',
        isAdmin: true
      },
      {
        id: 2,
        firstName: 'Marie',
        lastName: 'Curie',
        email: 'marie.curie@example.com',
        birthDate: '1867-11-07',
        city: 'Suresnes',
        postalCode: '92150',
        isAdmin: false
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the environment variable
    process.env = {
      ...originalEnv,
      REACT_APP_API_URL: 'http://localhost:3001'
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('affiche le message de chargement puis la liste des utilisateurs', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers
    });

    renderWithRouter(<UserList />);

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Jean')).toBeInTheDocument();
    });
    expect(screen.getByText('Curie')).toBeInTheDocument();
  });

  it('affiche une erreur si le fetch échoue', async () => {
    console.error = jest.fn(); // éviter affichage console dans les tests
    fetch.mockRejectedValueOnce(new Error('Erreur API'));

    renderWithRouter(<UserList />);

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Erreur lors du chargement des utilisateurs :',
        expect.any(Error)
      );
    });
  });

  it('supprime un utilisateur après confirmation', async () => {
    // Mock fetch initial (GET)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers
    });

    // Mock window.confirm
    window.confirm = jest.fn().mockReturnValue(true);

    renderWithRouter(<UserList />);

    await screen.findByText('Jean');

    // Mock delete fetch after the component is rendered
    fetch.mockResolvedValueOnce({ ok: true });

    const deleteButtons = screen.getAllByText(/supprimer/i);
    fireEvent.click(deleteButtons[0]); // supprime "Jean Dupont"

    await waitFor(() => {
      expect(screen.queryByText('Jean')).not.toBeInTheDocument();
    });
    expect(window.confirm).toHaveBeenCalled();
  });

  it('ne supprime pas si annulation de la confirmation', async () => {
    // Mock fetch initial (GET)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers
    });

    window.confirm = jest.fn().mockReturnValue(false);

    renderWithRouter(<UserList />);

    await screen.findByText('Jean');

    const deleteButtons = screen.getAllByText(/supprimer/i);
    fireEvent.click(deleteButtons[0]);

    // Wait a bit to ensure no deletion happens
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(screen.getByText('Jean')).toBeInTheDocument();
    expect(window.confirm).toHaveBeenCalled();
    // Verify no DELETE request was made
    expect(fetch).toHaveBeenCalledTimes(1); // Only the initial GET request
  });
});

test('affiche une alerte si la suppression échoue', async () => {
  // Mock environment variable
  process.env.REACT_APP_API_URL = 'http://localhost:3001';
  
  // Mock window.confirm pour accepter la suppression
  jest.spyOn(window, 'confirm').mockReturnValue(true);
  // Mock window.alert pour vérifier l'alerte
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  // Mock fetch pour GET users (retour valide)
  fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ 
      utilisateurs: [{ 
        id: 1, 
        firstName: 'Jean', 
        lastName: 'Dupont', 
        email: 'jean@example.com', 
        birthDate: '1990-01-01', 
        city: 'Paris', 
        postalCode: '75000', 
        isAdmin: false 
      }] 
    }),
  });

  renderWithRouter(<UserList />);

  // Attendre que le nom de l'utilisateur s'affiche
  await screen.findByText('Jean');

  // Mock fetch pour DELETE user (retour KO) après le rendu
  fetch.mockResolvedValueOnce({
    ok: false,
  });

  // Cliquer sur le bouton supprimer
  const deleteButton = screen.getByRole('button', { name: /supprimer/i });
  fireEvent.click(deleteButton);

  // Attendre que l'alerte soit appelée
  await waitFor(() => {
    expect(alertSpy).toHaveBeenCalledWith('La suppression a échoué.');
  });

  // Cleanup
  alertSpy.mockRestore();
});