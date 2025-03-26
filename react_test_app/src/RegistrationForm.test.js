import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';

test('renders the registration form', () => {
    render(<RegistrationForm />);
    expect(screen.getByPlaceholderText('Prénom')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nom')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Date de naissance')).toBeInTheDocument();  // Champ date
    expect(screen.getByPlaceholderText('Code Postal')).toBeInTheDocument();
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
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '2000-01-01' } }); // Ajout du champ date
    fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '75001' } });
    fireEvent.click(screen.getByText("S'enregistrer"));

    await waitFor(() => expect(screen.queryByText(/Erreur/i)).not.toBeInTheDocument());
});

test("affiche une erreur si le code postal est invalide", async () => {
    render(<RegistrationForm />);
  
    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean.dupont@example.com' } });
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: 'abcde' } });
    
    fireEvent.click(screen.getByText("S'enregistrer"));
  
    await screen.findByText('Code postal invalide');
  });

  test("affiche une erreur si l'email est invalide", async () => {
    render(<RegistrationForm />);
  
    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean.dupont@invalid' } }); // Email invalide
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('Code Postal'), { target: { value: '75001' } });
  
    fireEvent.click(screen.getByText("S'enregistrer"));
  
    await screen.findByText('Email invalide');
  });
  