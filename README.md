
# 🎨 YORI Frontend - Interface Utilisateur Moderne

## 📋 Vue d'ensemble

YORI Frontend est une application **Next.js 14** avec **TypeScript** qui fournit une interface utilisateur moderne et responsive pour le système de gestion de bibliothèque YORI. L'application utilise **Tailwind CSS** pour le styling et **Framer Motion** pour les animations.

## 🏗️ Architecture Technique

```
┌─────────────────────────────────────────────────────────────────┐
│                        YORI Frontend Architecture               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │   Browser   │◄──►│  Next.js    │◄──►│   Backend API       │  │
│  │  (Client)   │    │   App       │    │  (Node.js/Express)  │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
│                             │                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │ React Hooks │    │ Components  │    │   Context API       │  │
│  │ & State     │    │ & UI        │    │ (Auth, Config)      │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Structure du Projet

```
Frontend/
├── 📱 app/                           # App Router Next.js 14
│   ├── 🔐 auth/                      # Authentification
│   │   ├── layout.tsx                # Layout auth
│   │   └── page.tsx                  # Page login/register
│   │
│   ├── 📚 book/[id]/                 # Détail d'un livre
│   │   └── page.tsx                  # Page livre dynamique
│   │
│   ├── 📖 books/                     # Catalogue des livres
│   │   └── page.tsx                  # Liste des livres publics
│   │
│   ├── 🏠 dashboard/                 # Interface utilisateur connecté
│   │   ├── layout.tsx                # Layout dashboard
│   │   ├── page.tsx                  # Dashboard principal
│   │   ├── page-admin.tsx            # Dashboard admin
│   │   ├── page-new.tsx              # Nouveau dashboard
│   │   │
│   │   ├── 📚 books/                 # Gestion des livres
│   │   │   ├── page.tsx              # Liste des livres
│   │   │   ├── add/page.tsx          # Ajouter un livre
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Détail livre admin
│   │   │       └── edit/page.tsx     # Éditer un livre
│   │   │
│   │   ├── 📋 loans/                 # Gestion des emprunts
│   │   │   └── page.tsx              # Liste des emprunts
│   │   │
│   │   ├── 🔔 notifications/         # Notifications
│   │   │   └── page.tsx              # Centre de notifications
│   │   │
│   │   ├── ⭐ reviews/               # Gestion des avis
│   │   │   ├── page.tsx              # Liste des avis
│   │   │   ├── page-fixed.tsx        # Version corrigée
│   │   │   ├── add/page.tsx          # Ajouter un avis
│   │   │   └── ReviewsTable.tsx      # Composant tableau
│   │   │
│   │   └── 👥 users/                 # Gestion des utilisateurs
│   │       ├── page.tsx              # Liste des utilisateurs
│   │       ├── UsersTable.tsx        # Composant tableau
│   │       └── [id]/page.tsx         # Profil utilisateur
│   │
│   ├── 🔍 search/                    # Recherche avancée
│   │   └── page.tsx                  # Page de recherche
│   │
│   ├── 👤 profile/                   # Profil utilisateur
│   │   └── page.tsx                  # Page profil
│   │
│   ├── 🌐 api/                       # API Routes Next.js
│   │   ├── health/route.ts           # Health check
│   │   ├── email/route.ts            # Service email
│   │   ├── me/route.ts               # Profil utilisateur
│   │   └── reviews/[id]/route.ts     # API reviews
│   │
│   ├── 📄 globals.css                # Styles globaux
│   ├── 📄 layout.tsx                 # Layout racine
│   ├── 📄 page.tsx                   # Page d'accueil
│   ├── 📄 loading.tsx                # Page de chargement
│   ├── 📄 error.tsx                  # Page d'erreur
│   └── 📄 viewport.ts                # Configuration viewport
│
├── 🧩 components/                    # Composants réutilisables
│   ├── 📚 BookCard.tsx               # Carte de livre
│   ├── 📚 BookCard-new.tsx           # Nouvelle version
│   ├── 📚 BookContent.tsx            # Contenu détaillé livre
│   ├── 📚 BookReviews.tsx            # Avis sur les livres
│   ├── 🎛️ Button.tsx                 # Bouton réutilisable
│   ├── 🃏 Card.tsx                   # Composant carte
│   ├── 🏠 Home.tsx                   # Composant accueil
│   ├── 🏠 Home-new.tsx               # Nouvelle version
│   ├── 🔗 Header.tsx                 # En-tête
│   ├── 🔒 ProtectedRoute.tsx         # Route protégée
│   ├── 📱 Sidebar.tsx                # Barre latérale
│   ├── 📱 Sidebar-modern.tsx         # Version moderne
│   ├── 📱 Sidebar-new.tsx            # Nouvelle version
│   ├── 🍞 Toast.tsx                  # Notifications toast
│   │
│   ├── 🎨 kokonutui/                 # Composants UI avancés
│   │   └── dashboard-content.tsx     # Contenu dashboard
│   │
│   └── 🎭 ui/                        # Composants UI de base
│       ├── badge.tsx                 # Badge
│       ├── button.tsx                # Bouton UI
│       ├── card.tsx                  # Carte UI
│       ├── dialog.tsx                # Modal/Dialog
│       ├── dropdown-menu.tsx         # Menu déroulant
│       ├── input.tsx                 # Input
│       ├── label.tsx                 # Label
│       ├── popover.tsx               # Popover
│       ├── select.tsx                # Select
│       ├── tabs.tsx                  # Onglets
│       ├── toast.tsx                 # Toast UI
│       └── toaster.tsx               # Gestionnaire toast
│
├── 🧠 contexts/                      # Contextes React
│   ├── 🔐 AuthContext.tsx            # Authentification
│   ├── 🔐 AuthContext-fixed.tsx      # Version corrigée
│   └── ⚙️ ConfigContext.tsx          # Configuration
│
├── 📊 data/                          # Données statiques
│   └── books.ts                      # Données des livres
│
├── 🪝 hooks/                         # Hooks personnalisés
│   ├── use-animations.ts             # Animations
│   └── use-mobile.tsx                # Détection mobile
│
├── 📚 lib/                           # Bibliothèques et utilitaires
│   ├── 🌐 api.ts                     # Service API principal
│   ├── 🌐 api-new-broken.ts          # Version en développement
│   ├── 🔐 auth.ts                    # Utilitaires auth
│   ├── 🎨 theme.ts                   # Configuration thème
│   ├── 🛠️ utils.ts                   # Utilitaires généraux
│   └── ✅ validations.ts             # Schémas de validation
│
├── 🖼️ public/                        # Fichiers statiques
│   ├── images/                       # Images
│   └── favicon.ico                   # Icône du site
│
├── 🏷️ types/                         # Types TypeScript
│   └── user.ts                       # Types utilisateur
│
├── 🎨 styles/                        # Styles supplémentaires
├── 🔧 Configuration Files
│   ├── 📦 package.json               # Dépendances
│   ├── ⚡ next.config.mjs            # Configuration Next.js
│   ├── 🎨 tailwind.config.ts         # Configuration Tailwind
│   ├── 📝 tsconfig.json              # Configuration TypeScript
│   ├── 🎨 postcss.config.mjs         # Configuration PostCSS
│   ├── 🔧 next-env.d.ts              # Types Next.js
│   └── 🐳 Dockerfile                 # Configuration Docker
│
└── 📚 Documentation
    |
    └── 📖 README.md                  # Ce fichier
```

## 🔧 Technologies Utilisées

### Core Technologies
- **⚡ Next.js 14** - Framework React avec App Router
- **⚛️ React 18** - Bibliothèque UI avec hooks
- **📘 TypeScript** - Typage statique JavaScript
- **🎨 Tailwind CSS** - Framework CSS utility-first

### UI & UX
- **🎭 Radix UI** - Composants accessibles
- **🎪 Framer Motion** - Animations fluides
- **🎨 Class Variance Authority** - Gestion des variantes CSS
- **🌙 Next Themes** - Gestion des thèmes

### Outils & Utilitaires
- **🔍 Lucide React** - Icônes SVG
- **🔐 JWT Decode** - Décodage des tokens
- **🍞 React Toastify** - Notifications
- **✅ Yup** - Validation des formulaires

## 🎯 Fonctionnalités Principales

### 🔐 Authentification & Autorisation
```typescript
// Contexte d'authentification avec gestion des rôles
const AuthContext = {
  user: UserProfile | null,
  isAuthenticated: boolean,
  login: (credentials) => Promise<void>,
  logout: () => void,
  register: (userData) => Promise<void>
}

// Rôles supportés
type UserRole = 'admin' | 'librarian' | 'student'
```

### 📚 Gestion des Livres
- **Catalogue public** - Navigation sans authentification
- **CRUD complet** - Création, lecture, mise à jour, suppression
- **Upload d'images** - Couvertures de livres
- **Recherche avancée** - Filtres multiples
- **Système de likes** - Favoris utilisateurs

### 📋 Système d'Emprunts
- **Emprunts en temps réel** - Vérification de disponibilité
- **Historique complet** - Suivi des emprunts passés
- **Notifications** - Rappels et alertes
- **Prolongation** - Extension des emprunts

### ⭐ Avis et Évaluations
```typescript
// Composant de gestion des avis
const ReviewsManagement = {
  // Filtrage dynamique
  filters: {
    search: string,
    status: 'all' | 'approved' | 'pending',
    rating: number | 'all'
  },
  
  // Actions admin
  actions: {
    approve: (reviewId) => Promise<void>,
    reject: (reviewId) => Promise<void>,
    moderate: (reviewId, action) => Promise<void>
  }
}
```

### 🏠 Tableaux de Bord Adaptatifs
- **Dashboard Étudiant** - Mes emprunts, favoris, recommendations
- **Dashboard Bibliothécaire** - Gestion des emprunts et livres
- **Dashboard Admin** - Statistiques et gestion globale

## 🚀 Démarrage Rapide

### 📋 Prérequis
- **Node.js** 18+ avec npm
- **Backend YORI** en cours d'exécution sur le port 5000

### ⚡ Installation
```bash
# Cloner le projet
git clone <repository-url>
cd Frontend

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local
```

### 🔧 Configuration
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

### 🚀 Lancement
```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start

# Docker
npm run docker:build
npm run docker:run
```

## 🔌 Intégration API

### Service API Centralisé
```typescript
// Structure du service API
const apiService = {
  // Authentification
  auth: {
    login: (credentials) => Promise<LoginResponse>,
    register: (userData) => Promise<UserProfile>,
    refresh: () => Promise<TokenResponse>
  },
  
  // Livres
  books: {
    getAll: (filters?) => Promise<Book[]>,
    getById: (id) => Promise<Book>,
    create: (bookData) => Promise<Book>,
    update: (id, bookData) => Promise<Book>,
    delete: (id) => Promise<void>
  },
  
  // Avis
  reviews: {
    getReviews: () => Promise<Review[]>,
    createReview: (reviewData) => Promise<Review>,
    approveReview: (id) => Promise<void>,
    rejectReview: (id) => Promise<void>
  }
}
```

### Gestion des États
```typescript
// Hooks personnalisés pour la gestion d'état
const useAuth = () => {
  const { user, login, logout } = useContext(AuthContext)
  return { user, isAuthenticated: !!user, login, logout }
}

const useApi = <T>(apiCall: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Logic d'appel API avec gestion d'erreur
}
```

## 🎨 Design System

### Palette de Couleurs
```css
/* Couleurs principales */
:root {
  --primary-blue: #3b82f6;      /* Bleu principal */
  --primary-green: #10b981;     /* Vert succès */
  --primary-orange: #f59e0b;    /* Orange warning */
  --primary-red: #ef4444;       /* Rouge erreur */
  --primary-purple: #8b5cf6;    /* Violet accent */
}
```

### Composants UI
- **Cards** - Conteneurs avec shadow et border-radius
- **Buttons** - Variantes primary, secondary, ghost
- **Forms** - Inputs avec validation en temps réel
- **Modals** - Overlays avec animations
- **Toast** - Notifications non-intrusives

## 🔐 Sécurité

### Protection des Routes
```typescript
// Composant de protection des routes
const ProtectedRoute = ({ children, requiredRole? }) => {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Redirect to="/auth" />
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <AccessDenied />
  }
  
  return children
}
```

### Validation des Données
```typescript
// Schémas de validation avec Yup
const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
})

const bookSchema = yup.object({
  title: yup.string().required(),
  author: yup.string().required(),
  isbn: yup.string().matches(/^\d{13}$/)
})
```

## 📱 Responsive Design

### Breakpoints Tailwind
```css
/* Système de breakpoints */
sm: '640px',   /* Mobile large */
md: '768px',   /* Tablette */
lg: '1024px',  /* Desktop small */
xl: '1280px',  /* Desktop large */
2xl: '1536px'  /* Desktop XL */
```

### Grilles Adaptatives
```jsx
// Exemple de grille responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {books.map(book => <BookCard key={book.id} book={book} />)}
</div>
```

## 🛠️ Scripts de Développement

```json
{
  "scripts": {
    "dev": "next dev",                    // Démarrage développement
    "build": "next build",                // Build production
    "start": "next start",                // Démarrage production
    "lint": "next lint",                  // Linting
    "docker:build": "docker build -t yori-frontend .",
    "docker:run": "docker run -p 3000:3000 yori-frontend",
    "docker:dev": "docker-compose -f docker-compose.dev.yml up"
  }
}
```

## 🌐 Variables d'Environnement

```bash
# Configuration Frontend
NEXT_PUBLIC_BASE_URL=http://localhost:3000    # URL frontend
NEXT_PUBLIC_API_URL=http://localhost:5000     # URL API backend
NODE_ENV=development                          # Environnement
NEXT_TELEMETRY_DISABLED=1                     # Désactiver télémétrie
```

## 🚀 Déploiement

### Docker
```dockerfile
# Multi-stage build pour optimisation
FROM node:20-alpine AS deps
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
CMD ["node", "server.js"]
```

### Health Check
```typescript
// Endpoint de santé pour monitoring
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'YORI Frontend',
    version: '1.0.0'
  })
}
```

## 📞 Support & Documentation

- **🌐 Application** : http://localhost:3000
- **🔧 Health Check** : http://localhost:3000/api/health
- **📚 API Backend** : http://localhost:5000
- **🐳 Docker** : Voir `README_DOCKER.md`

**🎯 Frontend moderne, sécurisé et prêt pour la production !**

- Authentification JWT (connexion, inscription, refresh, logout)
- Dashboard utilisateur (profil, emprunts, notifications, avis)
- Recherche et consultation de livres
- Responsive, accessible, SEO optimisé
- Connexion API backend sécurisée

## Structure du projet

```
app/
  dashboard/
    profile/
    ...
  styles/
components/
contexts/
hooks/
lib/
public/
types/
```

## Bonnes pratiques

- Variables d'environnement dans `.env.local`
- Appels API centralisés dans `lib/api.ts`
- Types TypeScript dans `types/`
- Composants réutilisables dans `components/`
- Respect des styles globaux (`globals.css`, `BookContent.css`)

## Nettoyage

- Les mocks et fichiers inutiles ont été supprimés.
- Les données proviennent exclusivement du backend.

## Pour toute contribution

Merci de respecter la structure et les conventions du projet.
