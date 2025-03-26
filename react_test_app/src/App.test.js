import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';

test('renders the registration form', () => {
    render(<RegistrationForm />);
    expect(screen.getByPlaceholderText('Prénom')).toBeInTheDocument();
});

test('displays error for invalid email', async () => {
  render(<RegistrationForm />);
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalidEmail' } });
  fireEvent.click(screen.getByText("S'enregistrer"));
   waitFor(() => expect(screen.getByText(/Email invalide/i)).toBeInTheDocument());
  });

test('displays error for invalid name', async () => {
  render(<RegistrationForm />);
  fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean123' } });
  fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont!' } });
  fireEvent.click(screen.getByText("S'enregistrer"));
  await screen.findByText('Nom ou prénom invalide');
});

test('submits the form successfully with valid data', async () => {
  render(<RegistrationForm />);
  
  fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
  fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean.dupont@example.com' } });
  fireEvent.click(screen.getByText("S'enregistrer"));

  await waitFor(() => expect(screen.queryByText(/Erreur/i)).not.toBeInTheDocument());
});