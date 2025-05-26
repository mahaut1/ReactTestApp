// src/RegistrationForm.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegistrationForm from './RegistrationForm'

describe('RegistrationForm', () => {
  it('affiche tous les champs', () => {
    render(<RegistrationForm />)
    expect(screen.getByPlaceholderText('Prénom')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nom')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Mot de passe')).toBeInTheDocument()
    expect(screen.getByLabelText('Date de naissance')).toBeInTheDocument()
  })

  it('erreur si champs vides', async () => {
    render(<RegistrationForm />)
    fireEvent.click(screen.getByText("S'enregistrer"))
    await waitFor(() =>
      expect(screen.getByTestId('error-message')).toHaveTextContent(/Veuillez remplir tous les champs/i)
    )
  })

  it('erreur nom/prénom invalide', async () => {
    render(<RegistrationForm />)
    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean123' } })
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont!' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'pwd' } })
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1990-01-01' } })
    fireEvent.click(screen.getByText("S'enregistrer"))

    await waitFor(() =>
      expect(screen.getByTestId('error-message')).toHaveTextContent(/Nom ou prénom invalide/i)
    )
  })

  it('erreur email invalide', async () => {
    render(<RegistrationForm />)
    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } })
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalidEmail' } })
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'pwd' } })
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1990-01-01' } })
    fireEvent.click(screen.getByText("S'enregistrer"))

    await waitFor(() =>
      expect(screen.getByTestId('error-message')).toHaveTextContent(/Email invalide/i)
    )
  })

  it('erreur utilisateur mineur', async () => {
    render(<RegistrationForm />)
    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } })
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean@ex.com' } })
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'pwd' } })
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '2020-01-01' } })
    fireEvent.click(screen.getByText("S'enregistrer"))

    await waitFor(() =>
      expect(screen.getByTestId('error-message')).toHaveTextContent(/Vous devez avoir au moins 18 ans/i)
    )
  })

  it('soumission réussie affiche succès', async () => {
    render(<RegistrationForm />)
    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'Jean' } })
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Dupont' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jean@ex.com' } })
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'pwd' } })
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1990-01-01' } })
    fireEvent.click(screen.getByText("S'enregistrer"))

    await waitFor(() => expect(screen.queryByTestId('error-message')).not.toBeInTheDocument())
    await waitFor(() => expect(screen.getByTestId('success-message')).toBeInTheDocument())
  })
})
