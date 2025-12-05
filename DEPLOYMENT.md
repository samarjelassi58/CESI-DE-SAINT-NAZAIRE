# 🚀 Guide de Déploiement

## Variables d'Environnement Requises

Avant de déployer, configurez ces variables d'environnement sur votre plateforme :

### Vercel

1. Allez sur votre projet Vercel
2. Settings → Environment Variables
3. Ajoutez :

```
NEXT_PUBLIC_SUPABASE_URL=https://bfjsmqntohfqlapmmgob.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
```

### Netlify

1. Site settings → Build & deploy → Environment
2. Ajoutez les mêmes variables

### Autres plateformes

Ajoutez les variables dans le fichier de configuration de votre plateforme :
- Railway : Variables tab
- Render : Environment tab
- Heroku : Config Vars

## ⚠️ Important

- **NE JAMAIS** pousser `.env.local` sur GitHub
- Les variables `NEXT_PUBLIC_*` sont publiques côté client
- Ne mettez JAMAIS de clés secrètes dans `NEXT_PUBLIC_*`
- Pour les secrets, utilisez des variables serveur sans `NEXT_PUBLIC_`

## 🔐 Sécurité

Le fichier `.env.local` est automatiquement ignoré par Git (voir `.gitignore`).
Seul `.env.example` doit être versionné comme template.
