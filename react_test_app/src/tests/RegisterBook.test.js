import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationBook from '../RegisterBook';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';

// Mock d'axios
jest.mock('axios');

describe('RegistrationBook', () => {
  const setup = () => {
    render(
      <>
        <RegistrationBook />
        <ToastContainer />
      </>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le formulaire avec les champs nécessaires', () => {
    setup();
    expect(screen.getByPlaceholderText('Titre du livre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Auteur')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Année de publication')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ajouter le livre/i })).toBeInTheDocument();
  });

  it('affiche une erreur si les champs sont invalides', () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Titre du livre'), { target: { value: 'A' } });
    fireEvent.change(screen.getByPlaceholderText('Auteur'), { target: { value: 'B' } });
    fireEvent.change(screen.getByPlaceholderText('Année de publication'), { target: { value: '4000' } });

    expect(screen.getByText('Le titre doit contenir au moins 2 caractères')).toBeInTheDocument();
    expect(screen.getByText('L\'auteur doit contenir au moins 2 caractères')).toBeInTheDocument();
    expect(screen.getByText("L'année doit être entre 0 et 2025")).toBeInTheDocument();
  });



  it('affiche un message d’erreur si l’API renvoie une erreur', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: { detail: 'Erreur côté serveur' },
      },
    });
    setup();

    fireEvent.change(screen.getByPlaceholderText('Titre du livre'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Auteur'), { target: { value: 'Auteur' } });
    fireEvent.change(screen.getByPlaceholderText('Année de publication'), { target: { value: '2020' } });

    fireEvent.click(screen.getByRole('button', { name: /ajouter le livre/i }));

    await waitFor(() => {
      expect(screen.getByText(/erreur : erreur côté serveur/i)).toBeInTheDocument();
    });
  });

  it('désactive le bouton si le formulaire est invalide', () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Titre du livre'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Auteur'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Année de publication'), { target: { value: '' } });

    expect(screen.getByRole('button', { name: /ajouter le livre/i })).toBeDisabled();
  });
});
