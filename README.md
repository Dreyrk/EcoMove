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

2.  **Lancez l'application en mode développement :**
    Cette commande unique va :

    - Construire et lancer les conteneurs Docker (base de données, etc.).
    - Démarrer le serveur backend.
    - Démarrer l'application frontend.
    - Populer la base de données avec des données de test.

    ```bash
    npm run dev
    ```

3.  **Accédez à l'application :**
    - **Frontend :** [http://localhost:3000](http://localhost:3000)
    - **API Backend :** [http://localhost:4000](http://localhost:4000)

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
  - **Styling :** [Tailwind CSS]()

## ⚙️ Scripts utiles

- `npm run dev`: Lance l'environnement de développement complet.
- `npm run build`: Construit les applications frontend et backend pour la production.
- `npm run start`: Démarre les applications en mode production (après un `build`).

## 🤝 Contribution

Les contributions sont les bienvenues ! Si vous souhaitez améliorer ce projet, merci de forker le dépôt et de créer une Pull Request.

1.  Forkez le projet
2.  Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3.  Commitez vos changements (`git commit -m 'Add some AmazingFeature'`)
4.  Pushez vers la branche (`git push origin feature/AmazingFeature`)
5.  Ouvrez une Pull Request

## 📄 Licence

Ce projet est distribué sous la licence MIT. Voir le fichier `LICENSE` pour plus d'informations.
