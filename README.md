
# 📚 YORI - Frontend

Frontend Next.js pour la plateforme de gestion de bibliothèque YORI.

## Démarrage rapide

1. Copier `.env.local.example` en `.env.local` et configurer les variables d'environnement (voir backend).
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
4. Accéder à [http://localhost:3000](http://localhost:3000)

## Fonctionnalités principales

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
