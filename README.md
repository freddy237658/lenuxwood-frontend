# LenuxWood — Frontend (React + Tailwind)

Frontend du site LenuxWood, construit avec React (Vite), React Router, Tailwind CSS,
react-i18next (FR/EN) et react-hook-form + zod pour les formulaires.

## Démarrage

```bash
npm install
cp .env.example .env
npm run dev
```

Le site est servi sur `http://localhost:5173`.

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production dans `dist/`
- `npm run preview` — prévisualiser le build de production
- `npm run lint` — vérifier le code avec ESLint

## Structure du projet

```
src/
  assets/            logo et images statiques
  components/
    layout/          Header, Footer, Layout (structure commune à toutes les pages)
    ui/               Button, Reveal (animation scroll), ModuleIcon
    ModuleCard.jsx    carte d'un module (accueil, catalogue)
    ProductCard.jsx   carte produit (catalogue, fiche produit, accueil)
  data/               données de démonstration (modules, produits) — à remplacer
                      par des appels à l'API Laravel une fois le back-end prêt
  i18n/               configuration react-i18next + fichiers de traduction FR/EN
  pages/              une page par route (Home, Catalogue, Product, Devis, ...)
  App.jsx             déclaration des routes
  main.jsx            point d'entrée
  index.css           styles globaux (Tailwind + classes utilitaires custom)
```

## Pages disponibles

| Route              | Page                              | Accès |
|---------------------|------------------------------------|-------|
| `/`                 | Accueil                            | Public |
| `/catalogue`        | Catalogue avec filtres             | Public |
| `/produit/:slug`    | Fiche produit                      | Public |
| `/realisations`     | Galerie de réalisations filtrable  | Public |
| `/recherche`        | Résultats de recherche             | Public |
| `/devis`             | Demande de devis (formulaire validé) | Public |
| `/paiement`         | Paiement Orange Money / MTN MoMo   | Public |
| `/a-propos`          | À propos (équipe, locaux, carte)   | Public |
| `/contact`           | Contact                            | Public |
| `/connexion`         | Connexion                          | Public |
| `/inscription`       | Création de compte                 | Public |
| `/mot-de-passe-oublie` | Mot de passe oublié              | Public |
| `/compte`            | Espace client (commandes)          | Client connecté |
| `/admin`             | Tableau de bord admin              | Admin uniquement |
| `/admin/produits`    | Gestion des produits (CRUD)        | Admin uniquement |
| `/admin/categories`  | Vue des 8 modules                  | Admin uniquement |
| `/admin/devis`       | Gestion des demandes de devis      | Admin uniquement |
| `/admin/commandes`   | Gestion des commandes              | Admin uniquement |
| `/admin/paiements`   | Historique des paiements           | Admin uniquement |
| `/admin/utilisateurs`| Gestion des comptes admin/commercial | Admin uniquement |

## Authentification (mock, à remplacer par Laravel Sanctum)

`src/context/AuthContext.jsx` simule une authentification avec `localStorage`.
**Astuce démo** : un email contenant "admin" (ex: `admin@lenuxwood.com`) donne le
rôle administrateur ; tout autre email donne le rôle client. Chaque fonction
(`login`, `register`) est marquée d'un `// TODO` indiquant l'endpoint Laravel
Sanctum à brancher.

Les routes protégées utilisent `src/components/auth/ProtectedRoute.jsx` :
- sans le prop `adminOnly` → accessible à tout utilisateur connecté (`/compte`)
- avec `adminOnly` → accessible uniquement au rôle admin (`/admin/*`)

## Panel admin

Layout dédié dans `src/layouts/AdminLayout.jsx` (sidebar + en-tête, sans le
header/footer du site public). Toutes les données admin (devis, commandes,
paiements, utilisateurs) sont dans `src/data/admin-mock.js`, avec des
`// TODO` indiquant les endpoints Laravel à brancher pour chaque page.

## Prochaines étapes de développement

1. **Brancher l'API Laravel** : les données de `src/data/modules.js` et
   `src/data/products.js` sont statiques pour l'instant. Une fois le back-end
   Laravel prêt, remplacer ces fichiers par des appels `axios` (voir
   `VITE_API_URL` dans `.env`).
2. **Formulaires** : `Devis.jsx` et `Contact.jsx` ont un `onSubmit` avec un
   `// TODO` marquant l'endroit où brancher la requête POST vers l'API.
3. **Paiement** : `Paiement.jsx` est une maquette fonctionnelle ; l'intégration
   réelle Orange Money / MTN MoMo se fera côté Laravel (webhook + redirection),
   le front n'aura qu'à afficher le statut renvoyé par l'API.
4. **Images réelles** : remplacer les blocs de couleur (`grain-bg`) par les
   vraies photos une fois reçues et optimisées.
5. **Authentification** : `/compte` est actuellement un mock ; à connecter à
   Laravel Sanctum une fois le back-end en place.

## Design system

Palette, typographies (Fraunces / Manrope) et composants sont directement
repris des maquettes HTML validées. Toute la palette est configurée dans
`tailwind.config.js` (`wood`, `oak`, `cream`, `red`).
