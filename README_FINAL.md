# YORI - Bibliothèque Moderne

![YORI Logo](https://img.shields.io/badge/YORI-Bibliothèque-orange?style=for-the-badge&logo=bookstack)

## 🚀 Description

YORI est une application moderne de gestion de bibliothèque développée avec Next.js 14 et Node.js. Elle offre une interface utilisateur intuitive pour la gestion des emprunts de livres, la recherche par catégories, les notifications et les avis utilisateurs.

## ✨ Fonctionnalités

### 🔐 Authentification
- Connexion et inscription sécurisées
- Gestion des sessions utilisateur
- Authentification JWT
- Validation des données côté client et serveur

### 📚 Gestion des Livres
- Catalogue de livres avec recherche avancée
- Filtrage par catégories
- Pagination optimisée
- Détails complets des livres
- Couvertures d'ouvrages

### 📖 Système d'Emprunts
- Emprunts et retours de livres
- Historique des emprunts
- Statuts des emprunts (actif, retourné, en retard)
- Notifications de rappel

### 👤 Profil Utilisateur
- Gestion du profil personnel
- Historique des activités
- Préférences utilisateur

### 💬 Système d'Avis
- Évaluation des livres (1-5 étoiles)
- Commentaires détaillés
- Modération des avis

### 🔔 Notifications
- Notifications en temps réel
- Rappels d'échéances
- Messages système

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Radix UI** - Composants UI accessibles
- **Framer Motion** - Animations fluides

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de données relationnelle
- **JWT** - Authentification par tokens
- **Winston** - Système de logs
- **Nodemailer** - Envoi d'emails

## 📦 Installation

### Prérequis
- Node.js (v18 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

### 1. Cloner le projet
```bash
git clone https://github.com/your-username/yori-library.git
cd yori-library
```

### 2. Installation du Backend
```bash
cd Backend
npm install
```

### 3. Configuration de la base de données
```bash
# Créer la base de données MySQL
mysql -u root -p -e "CREATE DATABASE yori_library;"

# Exécuter les migrations
npm run migrate
```

### 4. Configuration du Backend
Créer un fichier `.env` dans le dossier Backend :
```env
# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=yori_library
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 5. Installation du Frontend
```bash
cd ../Frontend
npm install
```

### 6. Configuration du Frontend
Créer un fichier `.env.local` dans le dossier Frontend :
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=YORI
NEXT_PUBLIC_APP_VERSION=1.0.0

# Features
NEXT_PUBLIC_ENABLE_REGISTRATION=true
NEXT_PUBLIC_ENABLE_REVIEWS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Pagination
NEXT_PUBLIC_ITEMS_PER_PAGE=12
NEXT_PUBLIC_MAX_SEARCH_RESULTS=100

# File Upload
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf

# Cache
NEXT_PUBLIC_CACHE_DURATION=300000

# Theme
NEXT_PUBLIC_PRIMARY_COLOR=#f59e0b
NEXT_PUBLIC_SECONDARY_COLOR=#d97706
```

## 🚀 Démarrage

### Backend
```bash
cd Backend
npm run dev
```
Le serveur backend sera accessible sur `http://localhost:5000`

### Frontend
```bash
cd Frontend
npm run dev
```
L'application frontend sera accessible sur `http://localhost:3000`

## 📁 Structure du Projet

### Frontend
```
Frontend/
├── app/                    # App Router Next.js
│   ├── auth/              # Pages d'authentification
│   ├── book/              # Pages détails des livres
│   ├── dashboard/         # Interface utilisateur
│   └── layout.tsx         # Layout principal
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   └── ...
├── contexts/             # Contextes React
├── lib/                  # Utilitaires et services
└── public/              # Assets statiques
```

### Backend
```
Backend/
├── src/
│   ├── controllers/      # Contrôleurs API
│   ├── middleware/       # Middlewares Express
│   ├── models/          # Modèles de données
│   ├── routes/          # Routes API
│   ├── services/        # Services métier
│   └── utils/           # Utilitaires
├── database/            # Scripts et migrations DB
└── uploads/            # Fichiers uploadés
```

## 🔧 Scripts Disponibles

### Frontend
- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run start` - Serveur de production
- `npm run lint` - Vérification du code

### Backend
- `npm run dev` - Serveur de développement avec nodemon
- `npm start` - Serveur de production
- `npm run migrate` - Exécuter les migrations DB
- `npm run seed` - Insérer les données de test

## 🎨 Design System

### Couleurs Principales
- **Amber 600** (#f59e0b) - Couleur primaire
- **Orange 600** (#d97706) - Couleur secondaire
- **Neutral** - Textes et arrière-plans

### Typographie
- **Geist Sans** - Police principale
- **Lora** - Police pour le contenu

## 🧪 Tests

```bash
# Frontend
cd Frontend
npm run test

# Backend
cd Backend
npm run test
```

## 📚 API Documentation

L'API REST suit les conventions RESTful standard :

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `POST /api/auth/logout` - Déconnexion

### Livres
- `GET /api/books` - Liste des livres
- `GET /api/books/:id` - Détails d'un livre
- `GET /api/books/categories` - Catégories

### Emprunts
- `GET /api/loans` - Emprunts utilisateur
- `POST /api/loans` - Nouveau emprunt
- `PUT /api/loans/:id/return` - Retour d'emprunt

### Avis
- `GET /api/reviews` - Avis utilisateur
- `POST /api/reviews` - Nouvel avis
- `PUT /api/reviews/:id` - Modifier un avis

## 🔒 Sécurité

- Authentification JWT
- Validation des données d'entrée
- Protection CORS
- Hashage des mots de passe avec bcrypt
- Limitation du taux de requêtes
- Validation des permissions utilisateur

## 🌐 Déploiement

### Frontend (Vercel)
```bash
# Build automatique avec Vercel
vercel --prod
```

### Backend (Railway/Heroku)
```bash
# Configuration des variables d'environnement
# Déploiement automatique via Git
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Frontend Developer** - Interface utilisateur moderne avec Next.js
- **Backend Developer** - API REST robuste avec Node.js
- **UI/UX Designer** - Design system et expérience utilisateur
- **Database Administrator** - Architecture et optimisation MySQL

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe à : support@yori-library.com

## 🎯 Roadmap

### Version 1.1
- [ ] Mode sombre/clair
- [ ] Notifications push
- [ ] Application mobile (React Native)
- [ ] Système de recommandations

### Version 1.2
- [ ] Chat en temps réel
- [ ] Système de réservation
- [ ] Intégration avec d'autres bibliothèques
- [ ] API publique

---

**YORI** - *Your Online Reading Interface* 📚

Made with ❤️ by the YORI Team
