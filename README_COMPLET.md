# 📚 YORI - Backend Complet
## Analyse détaillée du système de gestion de bibliothèque

---

## 🎯 Vue d'ensemble du projet

YORI est une **plateforme complète de gestion de bibliothèque** développée avec Node.js/Express et MySQL. Le système permet la gestion des livres, emprunts, utilisateurs, notifications et avis avec un système d'authentification robuste et des tâches automatisées.

### Caractéristiques principales
- **API RESTful** complète avec documentation intégrée
- **Authentification JWT** avec refresh tokens
- **Système de rôles** (admin, librarian, student)
- **Gestion d'emprunts** automatisée avec notifications
- **Système de notifications** en temps réel
- **Tâches programmées** (cron jobs)
- **Upload de fichiers** sécurisé
- **Base de données optimisée** avec indexes et procédures stockées
- **Docker containerization** prêt pour la production
- **Logging avancé** avec Winston
- **Tests API** complets avec REST Client

---

## 📂 Structure complète du projet

```
yori-backend/
├── 📁 src/                           # Code source principal
│   ├── 📁 config/                    # Configuration
│   │   └── database.js               # Configuration MySQL avec pool de connexions
│   ├── 📁 controllers/               # Contrôleurs API
│   │   ├── admin.controller.js       # Gestion administrative
│   │   ├── auth.controller.js        # Authentification et autorisation
│   │   ├── book.controller.js        # Gestion des livres
│   │   ├── loan.controller.js        # Gestion des emprunts
│   │   ├── notification.controller.js # Système de notifications
│   │   └── review.controller.js      # Gestion des avis
│   ├── 📁 middleware/                # Middlewares personnalisés
│   │   ├── auth.middleware.js        # Authentification JWT
│   │   ├── error.middleware.js       # Gestion d'erreurs
│   │   ├── upload.middleware.js      # Upload de fichiers
│   │   └── validation.middleware.js  # Validation des données
│   ├── 📁 models/                    # Modèles de données
│   │   ├── book.model.js            # Modèle livre
│   │   ├── loan.model.js            # Modèle emprunt
│   │   ├── notification.model.js     # Modèle notification
│   │   ├── review.model.js          # Modèle avis
│   │   └── user.model.js            # Modèle utilisateur
│   ├── 📁 routes/                   # Routes API
│   │   ├── admin.routes.js          # Routes admin
│   │   ├── auth.routes.js           # Routes authentification
│   │   ├── book.routes.js           # Routes livres
│   │   ├── debug.routes.js          # Routes de debug
│   │   ├── index.js                 # Router principal
│   │   ├── loan.routes.js           # Routes emprunts
│   │   ├── notification.routes.js   # Routes notifications
│   │   └── review.routes.js         # Routes avis
│   ├── 📁 services/                 # Services métier
│   │   ├── auth.service.js          # Service authentification
│   │   ├── book.service.js          # Service livre
│   │   ├── email.service.js         # Service email
│   │   ├── loan.service.js          # Service emprunt
│   │   ├── modern-book.service.js   # Service livre moderne
│   │   ├── notification.service.js  # Service notification
│   │   ├── review.service.js        # Service avis
│   │   └── statistics.service.js    # Service statistiques
│   ├── 📁 jobs/                     # Tâches programmées (cron)
│   │   ├── cleanup.jobs.js          # Nettoyage automatique
│   │   ├── notification.jobs.js     # Notifications automatiques
│   │   └── statistics.jobs.js       # Calcul statistiques
│   ├── 📁 utils/                    # Utilitaires
│   │   ├── constants.js             # Constantes de l'application
│   │   ├── helpers.js               # Fonctions utilitaires
│   │   ├── initDb.js               # Initialisation DB
│   │   ├── seed.js                 # Données de test
│   │   └── validators.js           # Validateurs personnalisés
│   ├── 📁 validators/               # Validateurs Joi
│   │   ├── auth.validators.js       # Validation auth
│   │   ├── book.validators.js       # Validation livres
│   │   ├── loan.validators.js       # Validation emprunts
│   │   ├── notification.validators.js # Validation notifications
│   │   └── review.validators.js     # Validation avis
│   ├── app.js                       # Configuration Express
│   └── server.js                    # Point d'entrée serveur
├── 📁 database/                     # Base de données
│   ├── 📁 migrations/               # Migrations SQL
│   │   ├── 001_create_users_table.sql
│   │   ├── 002_create_books_table.sql
│   │   ├── 003_create_loans_table.sql
│   │   ├── 004_create_reviews_table.sql
│   │   ├── 005_create_notifications_table.sql
│   │   └── 006_create_user_sessions_table.sql
│   ├── 📁 seeders/                  # Données de test
│   │   ├── 001_users_seeder.sql
│   │   ├── 002_books_seeder.sql
│   │   └── 003_loans_seeder.sql
│   ├── init-database.js             # Script d'initialisation
│   ├── reset-database.js            # Script de réinitialisation
│   └── schema.sql                   # Schéma complet
├── 📁 scripts/                      # Scripts utilitaires
│   ├── init-db.js                   # Initialisation DB
│   ├── jobs-manager.js              # Gestionnaire de tâches
│   ├── reset-db.js                  # Reset DB
│   └── setup-test-users.js          # Utilisateurs de test
├── 📁 docs/                         # Documentation
│   ├── API.md                       # Documentation API
│   ├── DATABASE.md                  # Documentation DB
│   ├── DEPLOYMENT.md                # Guide déploiement
│   └── JOBS.md                      # Documentation tâches
├── 📁 logs/                         # Journaux
│   ├── combined.log                 # Tous les logs
│   └── error.log                    # Logs d'erreur
├── 📁 uploads/                      # Fichiers uploadés
│   ├── 📁 backups/                  # Sauvegardes
│   ├── 📁 books/                    # Images de livres
│   └── 📁 users/                    # Images utilisateurs
├── 📁 public/                       # Fichiers statiques
│   └── 📁 images/                   # Images publiques
├── api-tests.http                   # Tests API REST Client
├── docker-compose.yml               # Configuration Docker
├── Dockerfile                       # Image Docker
├── nodemon.json                     # Configuration Nodemon
├── package.json                     # Dépendances Node.js
└── README.md                        # Documentation principale
```

---

## 🗄️ Architecture de base de données

### Tables principales

#### 1. **users** - Utilisateurs
```sql
- id (INT, PK, AUTO_INCREMENT)
- first_name (VARCHAR(50)) - Prénom
- last_name (VARCHAR(50)) - Nom
- email (VARCHAR(100), UNIQUE) - Email
- password (VARCHAR(255)) - Mot de passe hashé
- phone (VARCHAR(20)) - Téléphone
- role (ENUM: admin, student, librarian) - Rôle
- student_id (VARCHAR(20), UNIQUE) - Numéro étudiant
- department (VARCHAR(100)) - Département
- is_active (BOOLEAN) - Statut actif
- profile_image (VARCHAR(255)) - Image de profil
- created_at, updated_at (TIMESTAMP)
```

#### 2. **books** - Livres
```sql
- id (INT, PK, AUTO_INCREMENT)
- title (VARCHAR(255)) - Titre
- author (VARCHAR(255)) - Auteur
- isbn (VARCHAR(20), UNIQUE) - ISBN
- publisher (VARCHAR(100)) - Éditeur
- publication_year (YEAR) - Année de publication
- category (VARCHAR(50)) - Catégorie
- description (TEXT) - Description
- total_copies (INT) - Nombre total d'exemplaires
- available_copies (INT) - Exemplaires disponibles
- status (ENUM: available, borrowed, reserved, maintenance, lost)
- cover_image (VARCHAR(255)) - Image de couverture
- language (VARCHAR(10)) - Langue
- pages (INT) - Nombre de pages
- location (VARCHAR(50)) - Localisation physique
- created_at, updated_at (TIMESTAMP)
```

#### 3. **loans** - Emprunts
```sql
- id (INT, PK, AUTO_INCREMENT)
- user_id (INT, FK vers users)
- book_id (INT, FK vers books)
- loan_date (DATE) - Date d'emprunt
- due_date (DATE) - Date de retour prévue
- return_date (DATE, NULL) - Date de retour effective
- status (ENUM: active, returned, overdue, reserved)
- renewals_count (INT) - Nombre de prolongations
- late_fee (DECIMAL(10,2)) - Frais de retard
- notes (TEXT) - Notes
- created_at, updated_at (TIMESTAMP)
```

#### 4. **reviews** - Avis/Critiques
```sql
- id (INT, PK, AUTO_INCREMENT)
- user_id (INT, FK vers users)
- book_id (INT, FK vers books)
- rating (INT, 1-5) - Note
- comment (TEXT) - Commentaire
- is_approved (BOOLEAN) - Statut d'approbation
- created_at, updated_at (TIMESTAMP)
```

#### 5. **notifications** - Notifications
```sql
- id (INT, PK, AUTO_INCREMENT)
- user_id (INT, FK vers users)
- type (ENUM: loan_reminder, overdue_notice, reservation_ready, book_returned, account_created, password_reset)
- title (VARCHAR(255)) - Titre
- message (TEXT) - Contenu
- is_read (BOOLEAN) - Lu/non lu
- is_sent (BOOLEAN) - Envoyé/non envoyé
- related_loan_id (INT, FK vers loans, NULL)
- related_book_id (INT, FK vers books, NULL)
- scheduled_for (TIMESTAMP, NULL) - Programmé pour
- created_at, updated_at (TIMESTAMP)
```

#### 6. **user_sessions** - Sessions utilisateur
```sql
- id (INT, PK, AUTO_INCREMENT)
- user_id (INT, FK vers users)
- refresh_token (VARCHAR(500)) - Token de rafraîchissement
- expires_at (TIMESTAMP) - Date d'expiration
- ip_address (VARCHAR(45)) - Adresse IP
- user_agent (TEXT) - User Agent
- is_active (BOOLEAN) - Session active
- created_at (TIMESTAMP)
```

### Vues et procédures stockées

#### Vue **active_loans**
```sql
-- Vue des emprunts actifs avec informations utilisateur et livre
-- Calcule automatiquement l'urgence (overdue, due_soon, active)
```

#### Procédures stockées
- **GetUserLoanHistory(userId)** - Historique des emprunts d'un utilisateur
- **GetOverdueLoans()** - Liste des emprunts en retard avec nombre de jours

---

## 🔐 Système d'authentification

### Types d'authentification
1. **JWT Access Token** (durée courte, 7 jours par défaut)
2. **Refresh Token** (durée longue, 30 jours)
3. **Sessions utilisateur** avec tracking IP et User-Agent

### Rôles et permissions
- **admin** : Accès complet à toutes les fonctionnalités
- **librarian** : Gestion des livres et emprunts
- **student** : Emprunts et consultation

### Sécurité
- Hashage bcrypt (12 rounds)
- Rate limiting sur les routes sensibles
- Validation stricte des données
- Nettoyage automatique des sessions expirées

---

## 🚀 API REST Complète

### Endpoints d'authentification
```
POST   /api/auth/register          - Inscription
POST   /api/auth/login             - Connexion
POST   /api/auth/logout            - Déconnexion
POST   /api/auth/refresh           - Rafraîchir token
POST   /api/auth/forgot-password   - Mot de passe oublié
POST   /api/auth/reset-password    - Réinitialiser mot de passe
GET    /api/auth/profile           - Profil utilisateur
PUT    /api/auth/profile           - Modifier profil
```

### Endpoints livres
```
GET    /api/books                  - Liste des livres
GET    /api/books/search           - Recherche livres
GET    /api/books/:id              - Détails d'un livre
POST   /api/books                  - Créer livre (admin/librarian)
PUT    /api/books/:id              - Modifier livre (admin/librarian)
DELETE /api/books/:id              - Supprimer livre (admin)
GET    /api/books/categories       - Liste des catégories
GET    /api/books/authors          - Liste des auteurs
```

### Endpoints emprunts
```
GET    /api/loans                  - Liste emprunts (admin/librarian)
GET    /api/loans/me               - Mes emprunts
POST   /api/loans                  - Créer emprunt
GET    /api/loans/:id              - Détails emprunt
PATCH  /api/loans/:id/return       - Retourner livre
PUT    /api/loans/:id/extend       - Prolonger emprunt (admin/librarian)
GET    /api/loans/overdue          - Emprunts en retard (admin/librarian)
GET    /api/loans/history          - Historique emprunts
```

### Endpoints avis
```
GET    /api/reviews                - Liste des avis
GET    /api/reviews/book/:bookId   - Avis d'un livre
POST   /api/reviews                - Créer avis
PUT    /api/reviews/:id            - Modifier avis
DELETE /api/reviews/:id            - Supprimer avis
PATCH  /api/reviews/:id/moderate   - Modérer avis (admin/librarian)
```

### Endpoints notifications
```
GET    /api/notifications/me       - Mes notifications
GET    /api/notifications/:id      - Détails notification
PUT    /api/notifications/:id/read - Marquer comme lue
PUT    /api/notifications/mark-all-read - Tout marquer comme lu
DELETE /api/notifications/:id      - Supprimer notification
POST   /api/notifications/custom   - Créer notification (admin)
GET    /api/notifications/stream   - Stream SSE temps réel
```

### Endpoints administrateur
```
GET    /api/admin/users            - Gestion utilisateurs
GET    /api/admin/stats            - Statistiques globales
GET    /api/admin/loans            - Gestion emprunts
GET    /api/admin/books            - Gestion livres
POST   /api/admin/notifications/bulk - Notifications en masse
GET    /api/admin/reports          - Rapports et exports
```

---

## ⚙️ Services métier

### AuthService
- Gestion des sessions utilisateur
- Validation des tokens
- Suivi des connexions (IP, User-Agent)
- Nettoyage automatique des sessions expirées

### BookService
- Recherche avancée avec filtres
- Gestion du stock (total_copies, available_copies)
- Validation ISBN (10 et 13 chiffres)
- Upload et gestion des images de couverture
- Système de catégories et localisation

### LoanService
- Logique d'emprunt avec vérification de disponibilité
- Calcul automatique des dates de retour
- Gestion des prolongations (maximum 2)
- Calcul des frais de retard
- Validation des limites par utilisateur (5 livres max)

### NotificationService
- Création automatique de notifications
- Templates de notifications personnalisables
- Système de priorités (normal, high, urgent)
- Notifications en temps réel via Server-Sent Events
- Programmation de notifications (scheduled_for)
- Envoi d'emails optionnel

### EmailService
- Intégration avec différents providers SMTP
- Templates HTML pour les emails
- Gestion des erreurs d'envoi
- File d'attente pour les envois en masse

### StatisticsService
- Calcul des statistiques en temps réel
- Métriques d'utilisation (emprunts, utilisateurs actifs)
- Rapports personnalisés
- Export de données (CSV, PDF)

---

## 🤖 Tâches automatisées (Cron Jobs)

### CleanupJobs - Nettoyage
```javascript
// Tous les jours à 2h - Nettoyage notifications (30+ jours)
scheduleNotificationCleanup()

// Toutes les 6h - Nettoyage sessions expirées
scheduleSessionCleanup()

// Tous les jours à 3h - Nettoyage tokens expirés
scheduleTokenCleanup()

// Tous les jours à 4h - Nettoyage fichiers temporaires
scheduleFileCleanup()

// Chaque dimanche à 5h - Nettoyage logs (90+ jours)
scheduleLogCleanup()

// 1er de chaque mois à 6h - Nettoyage audit (1+ an)
scheduleAuditCleanup()

// Chaque dimanche à 6h - Optimisation base de données
scheduleDatabaseOptimization()

// Tous les jours à 7h - Analyse des tables
scheduleTableAnalysis()
```

### NotificationJobs - Notifications
```javascript
// Tous les jours à 9h - Rappels d'échéance (3 jours avant)
scheduleLoanReminders()

// Tous les jours à 18h - Notifications de retard
scheduleOverdueNotifications()

// Toutes les heures - Notifications programmées
scheduleDelayedNotifications()

// Chaque vendredi à 16h - Résumé hebdomadaire
scheduleWeeklySummary()

// 1er de chaque mois à 8h - Rapport mensuel
scheduleMonthlyReport()
```

### StatisticsJobs - Statistiques
```javascript
// Tous les jours à minuit - Statistiques quotidiennes
scheduleDailyStats()

// Chaque lundi à 1h - Statistiques hebdomadaires
scheduleWeeklyStats()

// 1er de chaque mois à 1h - Statistiques mensuelles
scheduleMonthlyStats()

// Tous les 1er janvier à 2h - Statistiques annuelles
scheduleYearlyStats()
```

---

## 📦 Middleware personnalisés

### AuthMiddleware
```javascript
// Vérification JWT token
authenticateToken()

// Vérification des rôles
requireRole(['admin', 'librarian'])

// Optionnel : token facultatif
optionalAuth()
```

### ValidationMiddleware
```javascript
// Validation avec Joi
validateBody(schema)
validateParams(schema)
validateQuery(schema)

// Nettoyage des données
sanitizeInput()
```

### UploadMiddleware
```javascript
// Upload d'images sécurisé
uploadImage(['jpg', 'png'], 5MB)

// Upload de documents
uploadDocument(['pdf', 'doc'], 10MB)

// Validation de fichiers
validateFileType()
validateFileSize()
```

### ErrorMiddleware
```javascript
// Gestion centralisée des erreurs
errorHandler()

// Logging des erreurs
logError()

// Formatage des réponses d'erreur
formatErrorResponse()
```

---

## 🛠️ Utilitaires et helpers

### Helpers.js - Fonctions utilitaires
```javascript
// Authentification
hashPassword() - Hashage bcrypt
verifyPassword() - Vérification mot de passe
generateToken() - Génération JWT
verifyToken() - Vérification JWT

// Validation
isValidEmail() - Validation email
isValidISBN() - Validation ISBN
isValidFileSize() - Validation taille fichier

// Dates et temps
calculateReturnDate() - Calcul date de retour
isOverdue() - Vérification retard
getOverdueDays() - Nombre de jours de retard
formatDate() - Formatage date

// Utilitaires
formatResponse() - Réponse API standardisée
formatError() - Erreur API standardisée
paginate() - Calcul pagination
sanitizeString() - Nettoyage chaînes
generateUUID() - UUID unique
generateSecureFileName() - Nom de fichier sécurisé
```

### Constants.js - Constantes
```javascript
// Rôles utilisateur
USER_ROLES = { ADMIN, STUDENT, LIBRARIAN }

// Statuts
LOAN_STATUS = { ACTIVE, RETURNED, OVERDUE, RESERVED }
BOOK_STATUS = { AVAILABLE, BORROWED, RESERVED, MAINTENANCE, LOST }

// Types de notifications
NOTIFICATION_TYPES = { 
  LOAN_REMINDER, OVERDUE_NOTICE, RESERVATION_READY,
  BOOK_RETURNED, ACCOUNT_CREATED, PASSWORD_RESET 
}

// Limites et durées
DURATIONS = { LOAN_PERIOD_DAYS: 14, MAX_RENEWALS: 2 }
LIMITS = { MAX_BOOKS_PER_USER: 5, MAX_FILE_SIZE: 5MB }

// Messages
ERROR_MESSAGES = { ... }
SUCCESS_MESSAGES = { ... }

// Patterns regex
REGEX_PATTERNS = { EMAIL, PASSWORD, ISBN }
```

---

## 📋 Validateurs Joi

### AuthValidators
```javascript
registerSchema - Validation inscription
loginSchema - Validation connexion
resetPasswordSchema - Validation reset mot de passe
updateProfileSchema - Validation modification profil
```

### BookValidators
```javascript
createBookSchema - Validation création livre
updateBookSchema - Validation modification livre
searchBookSchema - Validation recherche livre
```

### LoanValidators
```javascript
createLoanSchema - Validation création emprunt
extendLoanSchema - Validation prolongation
returnLoanSchema - Validation retour livre
```

### NotificationValidators
```javascript
createNotificationSchema - Validation création notification
updatePreferencesSchema - Validation préférences
bulkNotificationSchema - Validation notifications en masse
```

---

## 🐳 Docker et déploiement

### Docker Compose
```yaml
services:
  mysql:          # Base de données MySQL 8.0
  yori-backend: # Application Node.js
  redis:          # Cache Redis (optionnel)

volumes:
  mysql_data:     # Persistance MySQL
  redis_data:     # Persistance Redis

networks:
  yori-network: # Réseau interne
```

### Variables d'environnement
```bash
# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=yori_db
DB_USER=root
DB_PASSWORD=

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Application
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
```

### Scripts NPM
```json
{
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "db:init": "node database/init-database.js",
  "db:reset": "node database/reset-database.js",
  "db:fresh": "npm run db:reset && npm run db:init",
  "jobs": "node scripts/jobs-manager.js",
  "jobs:cleanup": "node scripts/jobs-manager.js cleanup --all"
}
```

---

## 📊 Logging et monitoring

### Winston Logger
```javascript
// Niveaux de log : error, warn, info, debug
// Fichiers de sortie :
//   - logs/error.log (erreurs uniquement)
//   - logs/combined.log (tous les logs)
//   - Console (en développement)

// Rotation des logs automatique (5MB max, 5 fichiers)
// Formatage JSON structuré
// Metadata automatique (service, timestamp)
```

### Métriques système
```javascript
GET /health     - Santé du serveur
GET /metrics    - Métriques système (CPU, mémoire, uptime)

// Logging automatique des requêtes HTTP
// Durée de traitement
// Code de statut
// IP et User-Agent
```

---

## 🧪 Tests et développement

### Fichier api-tests.http
- **50+ requêtes de test** complètes
- Tests pour tous les endpoints
- Gestion des tokens automatique
- Tests d'erreurs et cas limites
- Documentation intégrée
- Variables dynamiques

### Utilisateurs de test
```javascript
// Mots de passe : Password123!
admin@yori.com (admin)
sophie.biblio@yori.com (librarian)  
jean.dupont@student.univ.com (student)
marie.martin@student.univ.com (student)
pierre.durand@student.univ.com (student)
test@example.com (student)
```

### Données de test
- **25+ livres** de différentes catégories
- **Emprunts actifs** et historique
- **Avis et commentaires**
- **Notifications** de tous types

---

## ⚡ Performances et optimisation

### Base de données
- **Index optimisés** sur toutes les colonnes de recherche
- **Recherche full-text** sur titre, auteur, description
- **Procédures stockées** pour les requêtes complexes
- **Vues matérialisées** pour les données fréquemment consultées
- **Nettoyage automatique** des données obsolètes

### Application
- **Pool de connexions MySQL** (20 connexions max)
- **Compression gzip** des réponses
- **Rate limiting** anti-spam
- **Cache Redis** (optionnel)
- **Pagination optimisée**
- **Upload de fichiers** sécurisé avec validation

### Sécurité
- **Helmet.js** pour les en-têtes sécurisés
- **CORS configuré** avec origines autorisées
- **Validation stricte** de toutes les entrées
- **Hashage bcrypt** sécurisé (12 rounds)
- **Tokens JWT** avec expiration
- **Sessions trackées** (IP, User-Agent)

---

## 🔧 Scripts utilitaires

### jobs-manager.js
```bash
# Gestion des tâches programmées
npm run jobs help           # Aide
npm run jobs status         # Statut des tâches
npm run jobs cleanup --all  # Nettoyage complet
npm run jobs stats daily    # Statistiques quotidiennes
```

### Database scripts
```bash
npm run db:init    # Initialiser la base
npm run db:reset   # Réinitialiser la base
npm run db:fresh   # Reset + Init
```

---

## 📚 Dépendances principales

### Production
```json
{
  "express": "^4.18.2",          // Framework web
  "mysql2": "^3.6.5",           // Driver MySQL
  "bcryptjs": "^2.4.3",         // Hashage mots de passe
  "jsonwebtoken": "^9.0.2",     // JWT tokens
  "joi": "^17.11.0",            // Validation données
  "winston": "^3.11.0",         // Logging
  "nodemailer": "^6.9.7",       // Envoi emails
  "multer": "^1.4.5-lts.1",     // Upload fichiers
  "node-cron": "^3.0.3",        // Tâches programmées
  "helmet": "^7.1.0",           // Sécurité headers
  "cors": "^2.8.5",             // CORS policy
  "compression": "^1.7.4",      // Compression gzip
  "express-rate-limit": "^7.1.5", // Rate limiting
  "moment": "^2.29.4",          // Gestion dates
  "uuid": "^9.0.1"              // UUID generation
}
```

### Développement
```json
{
  "nodemon": "^3.0.2"           // Hot reload développement
}
```

---

## 🚀 Pour commencer

### 1. Installation
```bash
git clone [repository]
cd yori-backend
npm install
```

### 2. Configuration
```bash
cp .env.example .env
# Modifier les variables d'environnement
```

### 3. Base de données
```bash
# Créer la base MySQL
npm run db:init
```

### 4. Démarrage
```bash
# Développement
npm run dev

# Production
npm start
```

### 5. Tests
```bash
# Ouvrir api-tests.http dans VS Code
# Installer l'extension REST Client
# Exécuter les requêtes de test
```

---

## 🎯 Fonctionnalités clés

### ✅ Gestion complète des livres
- CRUD complet avec validation
- Recherche avancée multi-critères
- Gestion du stock automatique
- Upload d'images de couverture
- Catégorisation et localisation

### ✅ Système d'emprunts intelligent
- Vérification automatique de disponibilité
- Calcul des dates de retour
- Prolongations limitées (2 max)
- Gestion des frais de retard
- Historique complet

### ✅ Notifications en temps réel
- Rappels d'échéance automatiques
- Notifications de retard
- Server-Sent Events (SSE)
- Templates personnalisables
- Envoi d'emails optionnel

### ✅ Administration avancée
- Gestion des utilisateurs
- Statistiques détaillées
- Rapports et exports
- Modération des avis
- Tâches de maintenance

### ✅ API REST complète
- Documentation intégrée
- Authentification sécurisée
- Validation stricte
- Gestion d'erreurs centralisée
- Rate limiting

### ✅ Tâches automatisées
- Nettoyage des données obsolètes
- Calcul des statistiques
- Envoi de notifications
- Optimisation de la base
- Maintenance automatique

---

## 📈 Statistiques du projet

- **📁 150+ fichiers** de code source
- **🔧 25+ endpoints** API REST
- **📊 6 tables** principales avec relations
- **⚙️ 15+ tâches** automatisées
- **🧪 50+ tests** API intégrés
- **🛡️ 10+ middlewares** de sécurité
- **📦 20+ dépendances** optimisées
- **🗂️ 8 services** métier
- **📋 5 validateurs** Joi
- **🔄 3 types** de tâches cron

---

## 🎊 Conclusion

YORI Backend est une **solution complète et professionnelle** pour la gestion de bibliothèque, offrant :

- **Architecture robuste** et scalable
- **Sécurité de niveau entreprise**
- **Automatisation complète** des tâches
- **API RESTful** bien documentée
- **Performances optimisées**
- **Monitoring et logging** avancés
- **Déploiement Docker** simplifié
- **Tests complets** intégrés

Le système est **prêt pour la production** et peut facilement évoluer selon les besoins futurs.

---

*📝 Documentation générée automatiquement à partir de l'analyse complète du code source*
*🔄 Dernière mise à jour : 2025*
