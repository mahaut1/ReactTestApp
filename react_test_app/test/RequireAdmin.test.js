import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RequireAdmin from '../src/RequireAdmin';

// Mock de Navigate de react-router-dom
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    Navigate: ({ to }) => <div>Redirection vers {to}</div>,
  };
});

describe('RequireAdmin', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('affiche les enfants si isAdmin est true', () => {
    localStorage.setItem('isAdmin', 'true');

    render(
      <MemoryRouter>
        <RequireAdmin>
          <div>Contenu admin</div>
        </RequireAdmin>
      </MemoryRouter>
    );

    expect(screen.getByText('Contenu admin')).toBeInTheDocument();
  });

  it('redirige vers /login si isAdmin est false', () => {
    localStorage.setItem('isAdmin', 'false');

    render(
      <MemoryRouter>
        <RequireAdmin>
          <div>Contenu admin</div>
        </RequireAdmin>
      </MemoryRouter>
    );

    expect(screen.getByText('Redirection vers /login')).toBeInTheDocument();
  });

  it('redirige vers /login si isAdmin est manquant', () => {
    render(
      <MemoryRouter>
        <RequireAdmin>
          <div>Contenu admin</div>
        </RequireAdmin>
      </MemoryRouter>
    );

    expect(screen.getByText('Redirection vers /login')).toBeInTheDocument();
  });
});
