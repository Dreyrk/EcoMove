# Challenge Mobilité

Ce projet est une application web conçue pour le "Challenge Mobilité", visant à encourager et suivre les modes de transport durables des employés pour leurs trajets domicile-travail. L'application permet aux entreprises de créer des défis, aux employés de déclarer leurs trajets, et de visualiser les résultats via un classement général.

## ✨ Fonctionnalités

- **Espace Administrateur :** Gestion des entreprises, des utilisateurs et des défis.
- **Espace Employé :** Inscription, déclaration des trajets (vélo, covoiturage, transports en commun, etc.) et consultation des classements.
- **Gestion des Défis :** Création de défis sur des périodes données avec des objectifs spécifiques.
- **Classement en Temps Réel :** Suivi des performances individuelles et par entreprise, basé sur les kilomètres parcourus en mobilité douce.

## 🚀 Démarrage Rapide

Ce projet est un monorepo conteneurisé avec Docker.

### Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- [Docker](https://www.docker.com/)

### Installation & Lancement

1.  **Clonez le dépôt :**

    ```bash
    git clone git@github.com:Dreyrk/Mobility_Challenge.git
    cd Mobility_Challenge
    ```

2.  **Gèrer votre environnement :**
    via le fichier .env.sample :

    **Côté Backend**
    Vous pouvez changer les variables si besoin:
    - JWT_SECRET: si vous souhaitez une secret aussi robuste que celle de la production: ```bash echo $(openssl rand -base64 32)```
    - CORS_URLS: Si vous souhaitez ajoutez d'autres services
  
    **Côté Frontend**
    Créer un fichier .env.local:
    - NEXT_PUBLIC_API_BASE_URL: Renseignez l'url de l'api (NEXT_PUBLIC_API_BASE_URL="http://localhost:4000" par exemple)

3.  **Lancez l'application en mode développement :**
    Cette commande unique va :

    - Construire et lancer les conteneurs Docker (base de données, etc.).
    - Démarrer le serveur backend.
    - Démarrer l'application frontend.
    - Populer la base de données avec des données de test.

    ```bash
    npm run dev
    ```

3.  **Accédez à l'application :**

    - **En local :**

      - Frontend : [http://localhost:3000](http://localhost:3000)
      - API Backend : [http://localhost:4000](http://localhost:4000)

    - **En production (exemple) :**
      - Frontend : [https://mobility-challenge.vercel.app/](https://mobility-challenge.vercel.app/)
      - API Backend : [https://mobilitychallenge-production.up.railway.app/](https://mobilitychallenge-production.up.railway.app/)


5.  **Identifiant de démonstration :**
    - **email**: admin@email.com
    - **Mot de passe**: password


## 🛠️ Stack Technique

Ce projet est un monorepo structuré comme suit :

- **`/backend`**:

  - **Framework :** [Express.js](https://expressjs.com/)
  - **Langage :** [TypeScript](https://www.typescriptlang.org/)
  - **ORM :** [Prisma](https://www.prisma.io/)
  - **Base de données :** [PostgreSQL](https://www.postgresql.org/) (gérée via Docker)

- **`/frontend`**:
  - **Framework :** [Next.js](https://nextjs.org/)
  - **Langage :** [TypeScript](https://www.typescriptlang.org/)
  - **Styling :** [Tailwind CSS](https://tailwindcss.com/)

## 📚 Documentation

La documentation complète du projet est disponible sur Notion :  
[📖 Accéder à la documentation Notion](https://topaz-turner-be7.notion.site/Challenge-Mobilit-Documentation-23618d5e5ff780a0abcaecec62e99a7a)  

N’hésitez pas à consulter cette documentation pour comprendre l’architecture, les spécifications, et les guides de développement.

## ⚙️ Scripts utiles

- `npm run dev`: Lance l'environnement de développement complet.
- `npm run build`: Construit les applications frontend et backend pour la production.
- `npm run start`: Démarre les applications en mode production (après un `build`).
