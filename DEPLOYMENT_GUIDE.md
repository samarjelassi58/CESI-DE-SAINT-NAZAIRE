# 📋 Guide de Configuration et Déploiement - Talent Map

## 🎯 Étape 1 : Configuration Supabase

### 1.1 Créer le projet Supabase

1. Aller sur https://supabase.com
2. Se connecter ou créer un compte
3. Cliquer sur "New Project"
4. Remplir :
   - **Name** : talent-map
   - **Database Password** : (noter ce mot de passe !)
   - **Region** : Europe (West) - Paris
5. Attendre la création du projet (~2 minutes)

### 1.2 Créer la base de données

1. Dans le dashboard Supabase, aller à **SQL Editor**
2. Cliquer sur "New Query"
3. Copier TOUT le contenu du fichier `supabase-schema.sql`
4. Coller dans l'éditeur
5. Cliquer sur **Run** (en bas à droite)
6. ✅ Vous devriez voir "Success. No rows returned"

### 1.3 Configurer l'authentification

1. Aller à **Authentication** → **Providers**
2. Activer **Email**
3. Aller à **Authentication** → **URL Configuration**
4. Ajouter les URLs :
   - Site URL: `http://localhost:3000` (développement)
   - Redirect URLs: `http://localhost:3000/**`

### 1.4 Récupérer les clés API

1. Aller à **Settings** → **API**
2. Noter :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public key** : `eyJhbG...` (très longue clé)

### 1.5 Créer le premier administrateur

1. Aller à **SQL Editor**
2. Créer une nouvelle query
3. Exécuter ce script (remplacer l'email) :

```sql
-- Mettre à jour un utilisateur existant en admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'votre-email@example.com';

-- Vérifier
SELECT email, role FROM profiles WHERE role = 'admin';
```

## 🔧 Étape 2 : Configuration Locale

### 2.1 Variables d'environnement

1. Dans le dossier `talent-platform`, créer le fichier `.env.local`
2. Ajouter :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...votre_longue_cle
```

3. Sauvegarder

### 2.2 Tester l'application localement

```bash
npm run dev
```

Ouvrir http://localhost:3000

**Tests à effectuer** :
- ✅ Inscription d'un utilisateur
- ✅ Connexion
- ✅ Création de profil
- ✅ Ajout de compétences
- ✅ Recherche de talents
- ✅ Carte interactive

## 🚀 Étape 3 : Déploiement sur Vercel

### 3.1 Préparer le code

1. **Initialiser Git** (si pas déjà fait) :

```bash
git init
git add .
git commit -m "Initial commit - Talent Map Platform"
```

2. **Créer un repository GitHub** :
   - Aller sur https://github.com/new
   - Nom : `talent-map`
   - Public ou Private
   - Créer le repository

3. **Pousser le code** :

```bash
git remote add origin https://github.com/votre-username/talent-map.git
git branch -M main
git push -u origin main
```

### 3.2 Déployer sur Vercel

1. Aller sur https://vercel.com
2. Se connecter avec GitHub
3. Cliquer sur **Add New** → **Project**
4. Importer le repository `talent-map`
5. **Configuration** :
   - Framework Preset : **Next.js** (détecté auto)
   - Root Directory : `./`
   - Build Command : `npm run build`
   - Output Directory : `.next`

6. **Environment Variables** - IMPORTANT :
   - Cliquer sur **Environment Variables**
   - Ajouter :
     ```
     NEXT_PUBLIC_SUPABASE_URL
     Valeur : https://xxxxx.supabase.co
     
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     Valeur : eyJhbG...votre_longue_cle
     ```

7. Cliquer sur **Deploy**
8. Attendre 2-3 minutes

### 3.3 Configurer les URLs de redirection Supabase

Une fois déployé, Vercel donne une URL comme : `https://talent-map-xxxx.vercel.app`

1. Retourner sur **Supabase** → **Authentication** → **URL Configuration**
2. Ajouter :
   - Site URL : `https://talent-map-xxxx.vercel.app`
   - Redirect URLs : `https://talent-map-xxxx.vercel.app/**`
3. Sauvegarder

## ✅ Étape 4 : Vérification finale

### Tests de production

1. **Page d'accueil** : `https://talent-map-xxxx.vercel.app`
   - ✅ Design affiché correctement
   - ✅ Boutons fonctionnels

2. **Inscription** : `/auth/register`
   - ✅ Créer un compte test
   - ✅ Recevoir email de confirmation

3. **Dashboard** : `/dashboard`
   - ✅ Statistiques affichées
   - ✅ Navigation fluide

4. **Profil** : `/profile/edit`
   - ✅ Ajouter compétences, langues, projets
   - ✅ Sauvegarde fonctionnelle

5. **Recherche** : `/talents`
   - ✅ Liste des talents
   - ✅ Filtres fonctionnels

6. **Carte** : `/map`
   - ✅ Nuage de compétences
   - ✅ Graphiques interactifs

7. **Collaborations** : `/collaborations`
   - ✅ Créer une demande
   - ✅ Accepter/Refuser

8. **Admin** : `/admin`
   - ✅ Se connecter en admin
   - ✅ Valider des badges

## 📧 Étape 5 : Préparation pour évaluation

### Email à envoyer à jgallet@cesi.fr

```
Objet : Défi National CESI 2025 - Talent Map Platform

Bonjour,

Je vous présente ma soumission pour le Défi National CESI 2025.

🔗 Lien de la plateforme : https://talent-map-xxxx.vercel.app

👤 Comptes de test :
- Utilisateur : user@test.com / password123
- Administrateur : admin@test.com / admin123

📚 Documentation : README.md dans le repository
🔗 Repository GitHub : https://github.com/votre-username/talent-map

🎯 Fonctionnalités implémentées :
✅ Authentification complète (Supabase Auth)
✅ Profils talents détaillés (compétences, langues, projets, passions)
✅ Recherche avancée avec filtres multiples
✅ Carte interactive des talents (nuage + graphiques)
✅ Système de collaboration complet
✅ Badge "Talent Verified" avec validation admin
✅ Dashboard administrateur
✅ Design responsive et moderne
✅ Base de données Supabase avec RLS

🛠 Stack technique :
- Next.js 14 (App Router) + JavaScript
- Supabase (PostgreSQL, Auth, Real-time)
- Tailwind CSS
- Vercel (déploiement)

Cordialement,
[Votre nom]
```

## 🎨 Personnalisations possibles

### Changer les couleurs

Éditer `tailwind.config.js` :

```javascript
colors: {
  primary: {
    500: '#votre-couleur',
    600: '#votre-couleur-foncée',
  }
}
```

### Ajouter un logo

1. Placer le logo dans `/public/logo.png`
2. Modifier les composants pour utiliser `<Image src="/logo.png" />`

## 🐛 Dépannage

### Problème : "Invalid API key"
**Solution** : Vérifier que les clés Supabase sont correctes dans `.env.local` et Vercel

### Problème : Erreur 500 au déploiement
**Solution** : Vérifier les logs Vercel, souvent lié aux variables d'environnement

### Problème : Authentification ne fonctionne pas
**Solution** : Vérifier les URLs de redirection dans Supabase

### Problème : Base de données vide
**Solution** : Réexécuter `supabase-schema.sql` dans l'éditeur SQL

## 📊 Métriques de qualité

- **Performance** : Lighthouse Score > 90
- **Accessibilité** : WCAG 2.1 Level AA
- **SEO** : Optimisé avec metadata Next.js
- **Mobile** : Responsive design complet

## 🎯 Checklist finale

Avant de soumettre :

- [ ] Application déployée sur Vercel
- [ ] Variables d'environnement configurées
- [ ] URLs de redirection Supabase configurées
- [ ] Compte admin créé
- [ ] Comptes de test créés
- [ ] Toutes les fonctionnalités testées
- [ ] README.md à jour
- [ ] Email envoyé à jgallet@cesi.fr

---

**🎉 Félicitations ! Votre plateforme Talent Map est prête pour l'évaluation !**
