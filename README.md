# 🎯 Talent Map - Plateforme de Cartographie des Talents

**Défi National CESI 2025**

Une plateforme web collaborative permettant aux participants de découvrir, partager et visualiser les talents au sein de la communauté CESI.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration Supabase](#-configuration-supabase)
- [Utilisation](#-utilisation)
- [Déploiement](#-déploiement)
- [Grille d'évaluation](#-grille-dévaluation)

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription / Connexion sécurisée via Supabase Auth
- Gestion de profil complet

### 👤 Profils Talents
- **Informations personnelles** : nom, localisation, bio, contacts
- **Compétences techniques** : catégories, niveaux d'expertise, années d'expérience
- **Langues** : niveaux selon le CECRL (A1 à C2)
- **Projets personnels** : description, technologies, liens GitHub/Portfolio
- **Passions** : centres d'intérêt et hobbies
- Indicateur de disponibilité

### 🔍 Recherche Avancée
- Recherche par nom, compétences, langues
- Filtres : disponibilité, profils vérifiés
- Affichage en cartes avec informations détaillées

### 🗺️ Carte Interactive des Talents
- **Nuage de compétences** : visualisation dynamique selon la popularité
- **Graphiques à barres** : top 20 des compétences les plus répandues
- Statistiques globales : nombre de talents, compétences uniques
- Légende par catégories (technique, linguistique, soft-skills)

### 🤝 Système de Collaboration
- Demandes de collaboration entre talents
- Gestion des demandes reçues/envoyées
- Statuts : en attente, acceptée, refusée, terminée
- Description de projet et compétences recherchées

### 🏆 Badges & Vérification
- Badge **"Talent Verified"** validé par un administrateur
- Autres badges : Expert, Mentor, Collaborator, Innovator
- Visible sur les profils et dans les recherches

### 👨‍💼 Dashboard Administrateur
- Gestion des utilisateurs
- Validation des badges
- Statistiques de la plateforme

## 🛠 Technologies

### Frontend
- **Next.js 14** (App Router) - Framework React
- **JavaScript** (ES6+)
- **Tailwind CSS** - Styling moderne et responsive
- **Lucide React** - Icônes
- **React Hot Toast** - Notifications

### Backend & Base de données
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Row Level Security (RLS)
  - Real-time capabilities

### Visualisation
- **Recharts** - Graphiques interactifs

## 📦 Installation

### Prérequis
- Node.js 18+ et npm
- Compte Supabase (gratuit)

### Étapes

1. **Cloner le projet**
```bash
cd talent-platform
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.local.example .env.local
```

Éditer `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

4. **Configurer Supabase** (voir section suivante)

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🗄️ Configuration Supabase

### 1. Créer un projet Supabase
- Aller sur [supabase.com](https://supabase.com)
- Créer un nouveau projet
- Noter l'URL et la clé API (anon key)

### 2. Créer la base de données

Dans l'éditeur SQL de Supabase, exécuter le script `supabase-schema.sql` :

```sql
-- Le fichier supabase-schema.sql contient :
-- - Tables : profiles, skills, languages, projects, passions, badges, collaborations, messages
-- - Indexes pour les performances
-- - Row Level Security (RLS) policies
-- - Fonctions et triggers automatiques
```

### 3. Activer l'authentification Email

Dans Supabase Dashboard :
- Authentication → Settings
- Activer "Email" provider
- Configurer les URLs de redirection

### 4. Récupérer les clés

- Settings → API
- Copier `Project URL` et `anon public` key dans `.env.local`

## 🚀 Utilisation

### 1. Créer un compte
- Aller sur `/auth/register`
- S'inscrire avec email/mot de passe
- Vérifier l'email (si configuré)

### 2. Compléter son profil
- Aller sur Dashboard → "Modifier mon profil"
- Ajouter :
  - Informations personnelles
  - Compétences avec niveaux
  - Langues parlées
  - Projets réalisés
  - Passions

### 3. Explorer les talents
- `/talents` : Recherche et filtres
- `/map` : Visualisation en carte interactive

### 4. Collaborer
- Trouver un talent
- Cliquer sur "Contacter"
- Décrire le projet
- Envoyer la demande

### 5. Obtenir le badge Verified
- Compléter son profil
- Attendre la validation par un administrateur

## 📤 Déploiement

### Vercel (Recommandé)

1. **Pousser le code sur GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin votre_repo
git push -u origin main
```

2. **Déployer sur Vercel**
- Aller sur [vercel.com](https://vercel.com)
- Importer le repository GitHub
- Ajouter les variables d'environnement :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Déployer

3. **Configurer le domaine**
- Le lien Vercel sera généré automatiquement
- Partager ce lien pour évaluation

### Autres options
- **Netlify** : Similar à Vercel
- **Railway** : Avec base de données intégrée
- **VPS** : Via PM2 et Nginx

## 📊 Grille d'évaluation

### 1. Qualité technique – 40 points

✅ **Fonctionnalités réalisées (20 pts)**
- Profil talent complet : compétences, langues, projets, passions
- Recherche avancée avec filtres multiples
- Visualisation : nuage de compétences + graphiques
- Système de collaboration complet
- Badge Talent Verified avec validation admin

✅ **Stabilité & utilisation réelle (10 pts)**
- Navigation fluide et intuitive
- Pas de bugs majeurs
- Responsive design (mobile/tablet/desktop)
- Notifications en temps réel

✅ **Qualité du code (10 pts)**
- Structure Next.js App Router
- Composants réutilisables
- Code commenté et lisible
- Gestion d'état propre

### 2. UX / UI – 30 points

✅ **Ergonomie (15 pts)**
- Interface intuitive
- Parcours utilisateur fluide
- Formulaires clairs avec validation
- Messages d'erreur explicites

✅ **Design & lisibilité (15 pts)**
- Design moderne avec Tailwind CSS
- Palette de couleurs cohérente
- Typographie lisible
- Visualisations attractives et efficaces

### 3. Pertinence & cohérence – 30 points

✅ **Adéquation au sujet (15 pts)**
- Répond au besoin de cartographie des talents
- Facilite la mise en relation
- Valorise les compétences

✅ **Cohérence et maturité (15 pts)**
- Solution homogène et professionnelle
- Utilisable immédiatement
- Scalable et maintenable

**Total : 100 points**

## 📧 Contact & Évaluation

**Lien d'évaluation** : [À envoyer à jgallet@cesi.fr]

- **URL de la plateforme** : `https://votre-app.vercel.app`
- **Email de test** : `admin@test.com` / `password123`
- **Documentation** : Ce README

## 👥 Contributeurs

Projet réalisé dans le cadre du **Défi National CESI 2025**

## 📝 Licence

MIT License - Libre d'utilisation pour le défi CESI

---

**🎯 Défi National CESI 2025 - Talent Map Platform**

*Développé avec ❤️ et Next.js + Supabase*
