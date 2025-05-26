import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';

describe('RegistrationForm', () => {
  test('renders the registration form', () => {
    render(<RegistrationForm />);
    expect(screen.getByPlaceholderText('Prénom')).toBeInTheDocument();
  });

  test('displays error when required fields are empty', async () => {
    render(<RegistrationForm />);
    fireEvent.click(screen.getByText("S'enregistrer"));

    await waitFor(() =>
      expect(screen.getByTestId('error-message')).toHaveTextContent(/Veuillez remplir tous les champs/i)
    );
  });

  test('displays error for invalid name', async () => {
    render(<RegistrationForm />);
    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean123' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont!' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('Ville'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '75000' } });

    fireEvent.click(screen.getByText("S'enregistrer"));

    await waitFor(() =>
      expect(screen.getByTestId('error-message')).toHaveTextContent(/Nom ou prénom invalide/i)
    );
  });

  test('displays error for invalid email', async () => {
    render(<RegistrationForm />);
    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalidEmail' } });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('Ville'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '75000' } });

    fireEvent.click(screen.getByText("S'enregistrer"));

    await waitFor(() =>
      expect(screen.getByTestId('error-message')).toHaveTextContent(/Email invalide/i)
    );
  });

  test('displays error for underage user', async () => {
    render(<RegistrationForm />);
    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '2020-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('Ville'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '75000' } });

    fireEvent.click(screen.getByText("S'enregistrer"));

    await waitFor(() =>
      expect(screen.getByTestId('error-message')).toHaveTextContent(/Vous devez avoir au moins 18 ans/i)
    );
  });

  test('displays error for invalid postal code', async () => {
    render(<RegistrationForm />);
    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('Ville'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '123' } });

    fireEvent.click(screen.getByText("S'enregistrer"));

    await waitFor(() =>
      expect(screen.getByTestId('error-message')).toHaveTextContent(/Code postal invalide/i)
    );
  });

  test('submits the form successfully with valid data', async () => {
    render(<RegistrationForm />);
    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('Ville'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '75000' } });

    fireEvent.click(screen.getByText("S'enregistrer"));

    await waitFor(() =>
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument()
    );
  });
});
