import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';

describe('RegistrationForm Component', () => {
    
    test('renders the registration form', () => {
        render(<RegistrationForm />);
        expect(screen.getByPlaceholderText('Prénom')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Nom')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Date de naissance')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Code postal')).toBeInTheDocument();
    });

    test('displays error for invalid email', async () => {
        render(<RegistrationForm />);
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalidEmail' } });
        fireEvent.click(screen.getByText("S'enregistrer"));

        await waitFor(() => expect(screen.getByText(/Email invalide/i)).toBeInTheDocument());
    });

    test('displays error for invalid name', async () => {
        render(<RegistrationForm />);
        fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean123' } });
        fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont!' } });
        fireEvent.click(screen.getByText("S'enregistrer"));

        await waitFor(() => expect(screen.getByText(/Nom ou prénom invalide/i)).toBeInTheDocument());
    });

    test('displays error for under 18 users', async () => {
        render(<RegistrationForm />);
        fireEvent.change(screen.getByPlaceholderText('Date de naissance'), { target: { value: '2010-01-01' } });
        fireEvent.click(screen.getByText("S'enregistrer"));

        await waitFor(() => expect(screen.getByText(/Vous devez avoir au moins 18 ans/i)).toBeInTheDocument());
    });

    test('displays error for invalid postal code', async () => {
        render(<RegistrationForm />);
        fireEvent.change(screen.getByPlaceholderText('Code postal'), { target: { value: '123' } }); // Trop court
        fireEvent.click(screen.getByText("S'enregistrer"));

        await waitFor(() => expect(screen.getByText(/Code postal invalide/i)).toBeInTheDocument());
    });

    test('submits the form successfully with valid data', async () => {
        render(<RegistrationForm />);
        
        fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
        fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean.dupont@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Date de naissance'), { target: { value: '2000-01-01' } });
        fireEvent.change(screen.getByPlaceholderText('Code postal'), { target: { value: '75001' } });

        fireEvent.click(screen.getByText("S'enregistrer"));

        await waitFor(() => expect(screen.queryByText(/Erreur/i)).not.toBeInTheDocument());
    });

});
