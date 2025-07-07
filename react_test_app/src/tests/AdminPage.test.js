import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminPage from '../AdminPage'; 
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock d'Axios
jest.mock('axios');

// Mock du composant enfant UserList
jest.mock('../UserList', () => () => <div data-testid="user-list">UserList</div>);

describe('AdminPage', () => {
  const mockUsers = {
    utilisateurs: [
      { id: 1, firstName: 'Alice' },
      { id: 2, firstName: 'Bob' }
    ]
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockUsers });
    process.env.REACT_APP_API_URL = 'http://localhost:8000'; // pour simuler l'URL
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le titre de la page', () => {
    render(<AdminPage />);
    expect(screen.getByText('Page Admin')).toBeInTheDocument();
  });

  it('appelle l’API et affiche le nombre d’utilisateurs', async () => {
    render(<AdminPage />);
    await waitFor(() => {
      expect(screen.getByText('2 utilisateur(s) enregistrés')).toBeInTheDocument();
    });
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/users');
  });

  it('rend le composant UserList', () => {
    render(<AdminPage />);
    expect(screen.getByTestId('user-list')).toBeInTheDocument();
  });

  it('gère les erreurs de l’API sans planter', async () => {
    axios.get.mockRejectedValueOnce(new Error('Erreur API'));
    render(<AdminPage />);
    await waitFor(() => {
      expect(screen.getByText('0 utilisateur(s) enregistrés')).toBeInTheDocument();
    });
  });
});
