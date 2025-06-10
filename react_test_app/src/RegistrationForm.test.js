import { render, screen, fireEvent } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';
import axios from 'axios';

jest.mock('axios');

test('renders the registration form', () => {
  render(<RegistrationForm />);
  expect(screen.getByPlaceholderText('Prénom')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Nom')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Date de naissance')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Code Postal')).toBeInTheDocument();
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
  axios.post.mockResolvedValue({ data: { message: 'User created' } });

  render(<RegistrationForm />);
  
  fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
  fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean.dupont@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('mot de passe'), { target: { value: '123456' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '2000-01-01' } });
  fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '75001' } });

  fireEvent.click(screen.getByText("S'enregistrer"));

  expect(await screen.findByText(/inscription réussie/i)).toBeInTheDocument();
});


test("affiche une erreur si le code postal est invalide", async () => {
  render(<RegistrationForm />);
  
  fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
  fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean.dupont@example.com' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '2000-01-01' } });
  fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: 'abcde' } });
  fireEvent.change(screen.getByPlaceholderText('mot de passe'), { target: { value: '123456' } });

  fireEvent.click(screen.getByText("S'enregistrer"));

  expect(await screen.findByText('Code postal invalide')).toBeInTheDocument();
});

test("affiche une erreur si l'email est invalide", async () => {
  render(<RegistrationForm />);
  
  fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
  fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean.dupont@invalid' } }); // Email invalide
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '2000-01-01' } });
  fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '75001' } });
  fireEvent.change(screen.getByPlaceholderText('mot de passe'), { target: { value: '123456' } });

  fireEvent.click(screen.getByText("S'enregistrer"));

  expect(await screen.findByText('Email invalide')).toBeInTheDocument();
});
