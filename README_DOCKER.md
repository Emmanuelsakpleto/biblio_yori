# YORI Frontend - Configuration Docker

## 🐳 Démarrage rapide avec Docker

### Option 1 : Build et run simple
```bash
# Construire l'image
npm run docker:build

# Lancer le conteneur
npm run docker:run
```

### Option 2 : Mode développement
```bash
# Lancer en mode dev avec hot-reload
npm run docker:dev
```

### Option 3 : Production avec Docker Compose complet
```bash
# Depuis la racine du projet
docker-compose up --build
```

## 📋 Configuration

### Variables d'environnement

Créer un fichier `.env.local` basé sur `.env.example` :

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=production
```

### Ports utilisés
- **Frontend** : `3000`
- **Backend** : `5000` 
- **MySQL** : `3306`

## 🔧 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run docker:build` | Construire l'image Docker |
| `npm run docker:run` | Lancer le conteneur |
| `npm run docker:stop` | Arrêter les conteneurs |
| `npm run docker:clean` | Nettoyer les images inutiles |
| `npm run docker:dev` | Mode développement |

## 🚀 Accès à l'application

Une fois démarré :
- **Frontend** : http://localhost:3000
- **API Health** : http://localhost:3000/api/health
- **Backend API** : http://localhost:5000

## 🐛 Dépannage

### Problèmes courants

**Port déjà utilisé :**
```bash
# Voir les processus sur le port 3000
lsof -i :3000

# Tuer le processus
kill -9 <PID>
```

**Erreur de build :**
```bash
# Nettoyer et rebuild
npm run docker:clean
npm run docker:build
```

**Problèmes de permissions :**
```bash
# Sur Linux/Mac, assurer les bonnes permissions
sudo chown -R $USER:$USER .
```

## 📁 Structure Docker

```
Frontend/
├── Dockerfile              # Image de production optimisée
├── .dockerignore           # Fichiers exclus du build
├── docker-compose.dev.yml  # Config développement
├── .env.example            # Variables d'environnement
└── app/api/health/         # Endpoint de santé
```

## 🔐 Sécurité

- Image basée sur Alpine Linux (légère et sécurisée)
- Utilisateur non-root dans le conteneur
- Variables d'environnement pour la configuration
- Healthcheck intégré
