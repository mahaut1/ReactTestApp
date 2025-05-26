import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';

test('renders the registration form', () => {
  render(<RegistrationForm />);
  expect(screen.getByPlaceholderText('Prénom')).toBeInTheDocument();
});

test('displays error for invalid email', async () => {
  render(<RegistrationForm />);

  fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
  fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalidEmail' } });
  fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'password123' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1990-01-01' } });
  fireEvent.change(screen.getByPlaceholderText('Ville'), { target: { value: 'Paris' } });
  fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '75001' } });

  fireEvent.click(screen.getByText("S'enregistrer"));

  await waitFor(() => expect(screen.getByText(/Email invalide/i)).toBeInTheDocument());
});

test('displays error for invalid name', async () => {
  render(<RegistrationForm />);

  fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean123' } });
  fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont!' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean.dupont@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'password123' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1990-01-01' } });
  fireEvent.change(screen.getByPlaceholderText('Ville'), { target: { value: 'Paris' } });
  fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '75001' } });

  fireEvent.click(screen.getByText("S'enregistrer"));

  await waitFor(() => expect(screen.getByText('Nom ou prénom invalide')).toBeInTheDocument());
});

test('submits the form successfully with valid data', async () => {
  render(<RegistrationForm />);

  fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
  fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean.dupont@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'password123' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1990-01-01' } });
  fireEvent.change(screen.getByPlaceholderText('Ville'), { target: { value: 'Paris' } });
  fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '75001' } });

  fireEvent.click(screen.getByText("S'enregistrer"));

  await waitFor(() =>
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument()
  );

  await waitFor(() =>
    expect(screen.getByTestId('success-message')).toBeInTheDocument()
  );
});
