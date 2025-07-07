import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UserList from '../src/UserList';
import userEvent from '@testing-library/user-event';


// Mock global fetch
global.fetch = jest.fn();

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
  });

  it('affiche le message de chargement puis la liste des utilisateurs', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers
    });

    render(<UserList />);

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Jean')).toBeInTheDocument();
      expect(screen.getByText('Curie')).toBeInTheDocument();
    });
  });

  it('affiche une erreur si le fetch échoue', async () => {
    console.error = jest.fn(); // éviter affichage console dans les tests
    fetch.mockRejectedValueOnce(new Error('Erreur API'));

    render(<UserList />);

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

    // Mock delete fetch
    fetch.mockResolvedValueOnce({ ok: true });

    // Mock window.confirm
    window.confirm = jest.fn().mockReturnValue(true);

    render(<UserList />);

    await waitFor(() => screen.getByText('Jean'));

    const deleteButtons = screen.getAllByText(/supprimer/i);
    fireEvent.click(deleteButtons[0]); // supprime "Jean Dupont"

    await waitFor(() => {
      expect(screen.queryByText('Jean')).not.toBeInTheDocument();
      expect(window.confirm).toHaveBeenCalled();
    });
  });

  it('ne supprime pas si annulation de la confirmation', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers
    });

    window.confirm = jest.fn().mockReturnValue(false);

    render(<UserList />);

    await waitFor(() => screen.getByText('Jean'));

    const deleteButtons = screen.getAllByText(/supprimer/i);
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText('Jean')).toBeInTheDocument();
    expect(window.confirm).toHaveBeenCalled();
  });
});

test('affiche une alerte si la suppression échoue', async () => {
  // Mock window.confirm pour accepter la suppression
  jest.spyOn(window, 'confirm').mockReturnValue(true);
  // Mock window.alert pour vérifier l'alerte
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  // Mock fetch pour GET users (retour valide)
  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ utilisateurs: [{ id: 1, firstName: 'Jean', lastName: 'Dupont', email: 'jean@example.com', birthDate: '1990-01-01', city: 'Paris', postalCode: '75000', isAdmin: false }] }),
    })
  );

  // Mock fetch pour DELETE user (retour KO)
  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: false,
    })
  );

  render(<UserList />);

  // Attendre que le nom de l'utilisateur s'affiche
  await screen.findByText('Jean');

  // Cliquer sur le bouton supprimer
  userEvent.click(screen.getByRole('button', { name: /supprimer/i }));

  // Attendre que l'alerte soit appelée
  await waitFor(() => {
    expect(alertSpy).toHaveBeenCalledWith('La suppression a échoué.');
  });
})