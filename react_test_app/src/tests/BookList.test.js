import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BookList from '../BookList';

// Mock global fetch
global.fetch = jest.fn();

// Mock the CSS import
jest.mock('../BookList.css', () => ({}));

describe('BookList', () => {
  const mockBooks = [
    {
      _id: '1',
      title: 'Le Petit Prince',
      author: 'Antoine de Saint-Exupéry',
      year: '1943'
    },
    {
      _id: '2',
      title: '1984',
      author: 'George Orwell',
      year: '1949'
    },
    {
      _id: '3',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      year: '1813'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('affiche le message de chargement initialement', () => {
    // Mock fetch to not resolve immediately
    fetch.mockImplementation(() => new Promise(() => {}));

    render(<BookList />);

    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('affiche la liste des livres après chargement réussi', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBooks
    });

    render(<BookList />);

    expect(screen.getByText('Chargement...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Liste des livres')).toBeInTheDocument();
    });

    // Vérifier que les en-têtes du tableau sont présents
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Titre')).toBeInTheDocument();
    expect(screen.getByText('Auteur')).toBeInTheDocument();
    expect(screen.getByText('Année de publication')).toBeInTheDocument();

    // Vérifier que les livres sont affichés
    expect(screen.getByText('Le Petit Prince')).toBeInTheDocument();
    expect(screen.getByText('Antoine de Saint-Exupéry')).toBeInTheDocument();
    expect(screen.getByText('1943')).toBeInTheDocument();

    expect(screen.getByText('1984')).toBeInTheDocument();
    expect(screen.getByText('George Orwell')).toBeInTheDocument();
    expect(screen.getByText('1949')).toBeInTheDocument();

    expect(screen.getByText('Pride and Prejudice')).toBeInTheDocument();
    expect(screen.getByText('Jane Austen')).toBeInTheDocument();
    expect(screen.getByText('1813')).toBeInTheDocument();
  });

  it('affiche le message "Aucun livre trouvé" quand la liste est vide', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<BookList />);

    await waitFor(() => {
      expect(screen.getByText('Aucun livre trouvé')).toBeInTheDocument();
    });

    expect(screen.getByText('Liste des livres')).toBeInTheDocument();
  });

  it('gère les erreurs de fetch sans planter l\'application', async () => {
    // Mock console.error pour éviter l'affichage des erreurs dans les tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    fetch.mockRejectedValueOnce(new Error('Erreur réseau'));

    render(<BookList />);

    expect(screen.getByText('Chargement...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument();
    });

    // Vérifier que l'erreur a été loggée
    expect(consoleSpy).toHaveBeenCalledWith(
      'Erreur fetch books:',
      expect.any(Error)
    );

    // L'application ne devrait pas planter et devrait afficher le message d'aucun livre
    expect(screen.getByText('Aucun livre trouvé')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('affiche la structure correcte du tableau', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBooks
    });

    render(<BookList />);

    await waitFor(() => {
      expect(screen.getByText('Liste des livres')).toBeInTheDocument();
    });

    // Vérifier la structure du tableau
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Vérifier que chaque livre a ses données dans les bonnes colonnes
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4); // 1 en-tête + 3 livres

    // Vérifier les IDs sont affichés
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('fait l\'appel fetch vers la bonne URL', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBooks
    });

    render(<BookList />);

    expect(fetch).toHaveBeenCalledWith('https://cicd-node-iota.vercel.app/books');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
