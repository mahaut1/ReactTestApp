# Formulaire d'Inscription React

## Description
Ce projet est une application React permettant à un utilisateur de s'enregistrer via un formulaire comprenant :
- Nom
- Prénom
- Email
- Date de naissance
- Ville
- Code postal

L'application inclut une validation des champs avec affichage des erreurs et empêche la soumission tant que les données ne sont pas valides. Une fois l'inscription réussie, un message de succès s'affiche et le formulaire est réinitialisé. 

## Prérequis
- [Node.js](https://nodejs.org/) (version 20.x recommandée)
- [npm](https://www.npmjs.com/) (installé avec Node.js)

## Installation
Clonez le dépôt et installez les dépendances :

```sh
git clone https://github.com/mahaut1/ReactTestApp
cd ReactTestApp/react_test_app
npm install
```

## Exécution de l'application
Pour démarrer l'application en mode développement :

```sh
npm start
```

Puis ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Exécution des tests
Les tests unitaires et d'intégration sont réalisés avec Jest et React Testing Library.

```sh
npm test
```

La couverture des tests est de 100 % (hors `index.js` et `reportWebVitals.js`).

## Règles de validation des champs
- **Nom, Prénom et Ville** : uniquement des lettres, acceptant les accents, trémas et tirets.
- **Email** : doit être valide.
- **Date de naissance** : l'utilisateur doit avoir au moins 18 ans.
- **Code postal** : doit respecter le format français (5 chiffres).
- **Bouton de validation** : désactivé tant que tous les champs ne sont pas valides.

## Tests obligatoires
✅ Vérification du calcul de l'âge  
✅ Vérification de l'âge > 18 ans  
✅ Vérification du format du code postal  
✅ Vérification du format du nom, prénom et ville  
✅ Vérification du format de l'email  
✅ Vérification de la désactivation du bouton tant que les champs ne sont pas remplis  
✅ Vérification de l'affichage du toaster de succès et de la réinitialisation des champs après validation  
✅ Vérification de l'affichage des erreurs en rouge

## Documentation
La documentation JSDoc est générée automatiquement et disponible à l'adresse suivante :  
[https://ton-user.github.io/ton-repo/docs](https://ton-user.github.io/ton-repo/docs)

Pour générer la documentation localement :

```sh
npm run jsdoc
```

## Déploiement
L'application est automatiquement déployée via GitHub Pages après chaque push sur `main`.



