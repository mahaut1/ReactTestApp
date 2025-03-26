import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import App from './App';
import * as reportWebVitalsModule from './reportWebVitals'; // Importer le module entier

test('renders App component', () => {
  render(<App />);
  expect(screen.getByText(/Formulaire d'Enregistrement/i)).toBeInTheDocument();
});

