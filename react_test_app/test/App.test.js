import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from '../src/RegistrationForm';

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
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean.dupont@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('mot de passe'), { target: { value: '123456' } });
  fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '75001' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '2000-01-01' } });
  fireEvent.click(screen.getByText("S'enregistrer"));
  expect(await screen.findByText('Prénom invalide')).toBeInTheDocument();
  expect(screen.getByText('Nom invalide')).toBeInTheDocument();
});


test('submits the form successfully with valid data', async () => {
  render(<RegistrationForm />);
  
  fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
  fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean.dupont@example.com' } });
  fireEvent.click(screen.getByText("S'enregistrer"));

  await waitFor(() => expect(screen.queryByText(/Erreur/i)).not.toBeInTheDocument());
});