import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from '../RegistrationForm';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

jest.mock('axios');

describe('RegistrationForm', () => {
  beforeEach(() => {
    axios.post.mockReset();
  });

  test('affiche les erreurs de validation en temps réel', () => {
    render(<RegistrationForm />);

    // Prénom invalide
    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean123' } });
    expect(screen.getByText('Prénom invalide')).toBeInTheDocument();

    // Nom invalide
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont!' } });
    expect(screen.getByText('Nom invalide')).toBeInTheDocument();

    // Email invalide
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid-email' } });
    expect(screen.getByText('Email invalide')).toBeInTheDocument();

    // Mot de passe trop court
    fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), { target: { value: '123' } });
    expect(screen.getByText('Mot de passe trop court')).toBeInTheDocument();

    // Date de naissance invalide (moins de 18 ans)
    const today = new Date();
    const under18 = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate() + 1);
    const under18Str = under18.toISOString().slice(0, 10);
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: under18Str } });
    expect(screen.getByText('Vous devez avoir au moins 18 ans')).toBeInTheDocument();

    // Code postal invalide
    fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: 'abcde' } });
    expect(screen.getByText('Code postal invalide')).toBeInTheDocument();
  });

  test('le bouton submit est désactivé tant que le formulaire est invalide', () => {
    render(<RegistrationForm />);

    const submitButton = screen.getByRole('button', { name: /s'enregistrer/i });

    // Au départ, le formulaire est vide => bouton désactivé
    expect(submitButton).toBeDisabled();

    // Remplir le formulaire avec données valides
    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean.dupont@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '75001' } });

    expect(submitButton).toBeEnabled();
  });

  test('soumet le formulaire avec succès', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Success' } });

    render(
      <>
        <RegistrationForm />
        <ToastContainer />
      </>
    );

    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean.dupont@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '75001' } });

    fireEvent.click(screen.getByRole('button', { name: /s'enregistrer/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/users', {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        password: '123456',
        birthDate: '1990-01-01',
        city: '',
        postalCode: '75001'
      });
    });

    // Vérifie la notification succès
  const toasts = await screen.findAllByText(/Inscription réussie !/i);
  expect(toasts.length).toBeGreaterThan(0);
    // Vérifie que le formulaire est réinitialisé
    expect(screen.getByPlaceholderText('Prénom').value).toBe('');
    expect(screen.getByPlaceholderText('Nom').value).toBe('');
  });

  test('affiche une erreur toast en cas d\'erreur serveur', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { detail: 'Email déjà utilisé' } }
    });

    render(
      <>
        <RegistrationForm />
        <ToastContainer />
      </>
    );

    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean.dupont@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '75001' } });

    fireEvent.click(screen.getByRole('button', { name: /s'enregistrer/i }));

    expect(await screen.findByText(/Erreur : Email déjà utilisé/i)).toBeInTheDocument();
  });

  test('affiche une erreur toast générique en cas d\'erreur inconnue', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <>
        <RegistrationForm />
        <ToastContainer />
      </>
    );

    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean.dupont@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '75001' } });

    fireEvent.click(screen.getByRole('button', { name: /s'enregistrer/i }));

    expect(await screen.findByText(/Une erreur est survenue lors de l’inscription./i)).toBeInTheDocument();
  });
});
