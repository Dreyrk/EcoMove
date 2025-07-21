# Frontend - Challenge Mobilité

Ce dossier contient l’application frontend de l’outil Challenge Mobilité, développée avec **Next.js**, **TypeScript** et **Tailwind CSS**.

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js v18 ou supérieur
- Le backend doit être lancé et accessible (par défaut sur `http://localhost:4000`)

### Installation

Depuis la racine du projet ou depuis le dossier frontend :

```bash
npm install
```

Lancer en mode développement

```bash
npm run dev
```

L’application sera accessible à http://localhost:3000.

Le serveur backend doit tourner simultanément pour que les appels API fonctionnent.

**📁 Architecture du frontend**
src/app/ : Contient les routes et pages (Next.js App Router)

src/components/ : Composants React, organisés par pages ou modules

src/actions/ : Server Actions Next.js (fonctions côté serveur appelées depuis le frontend)

src/lib/ : Librairies et configurations partagées

src/utils/ : Fonctions utilitaires diverses

src/types/ : Types TypeScript globalement utilisés

src/tests/ : Tests unitaires frontend (Jest, React Testing Library)

**⚙️ Scripts utiles**
npm run dev : Lance l’application en mode développement

npm run build : Compile et optimise pour la production

npm run start : Démarre le serveur de production (après build)

npm run lint : Lance ESLint pour vérifier la qualité du code

**🛡️ Sécurité et middleware**
Les routes sensibles sont protégées par un middleware (middleware.ts) qui vérifie l’authentification et les rôles utilisateur (admin, user).

**📖 Bonnes pratiques et conventions**
Code écrit en TypeScript avec typage strict

Composants fonctionnels React avec hooks

Validation des formulaires côté serveur via Zod

Utilisation de Server Actions Next.js pour le backend dans le frontend

Styles avec Tailwind CSS pour une rapidité et cohérence visuelle

ESLint et Prettier configurés pour un code propre et cohérent

**🧪 Tests**
Les tests unitaires sont écrits avec Jest et React Testing Library, exécutables via :

```bash
npm run test
```
