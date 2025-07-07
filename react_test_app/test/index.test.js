import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';

describe('App routing and rendering', () => {
  test('renders home page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Bienvenue/i)).toBeInTheDocument();
  });


  test('navigation to login page works', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    const loginLink = screen.getByRole('link', { name: /connexion/i });
    await userEvent.click(loginLink);

    expect(screen.getByText(/Se connecter/i)).toBeInTheDocument();
  });
});
