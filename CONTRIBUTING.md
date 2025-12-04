# Contributing to Talent Map

Merci de votre intérêt pour contribuer à Talent Map ! 🎉

## Code de Conduite

En participant à ce projet, vous acceptez de respecter notre [Code de Conduite](CODE_OF_CONDUCT.md).

## Comment Contribuer

### Signaler des Bugs 🐛

Si vous trouvez un bug :

1. Vérifiez qu'il n'a pas déjà été signalé dans les [Issues](https://github.com/votre-org/talent-platform/issues)
2. Créez une nouvelle issue avec :
   - Un titre descriptif
   - Les étapes pour reproduire le bug
   - Le comportement attendu vs. le comportement actuel
   - Des captures d'écran si pertinent
   - Votre environnement (OS, navigateur, version de Node.js)

### Proposer des Fonctionnalités 💡

Pour proposer une nouvelle fonctionnalité :

1. Ouvrez une issue avec le tag `enhancement`
2. Décrivez clairement la fonctionnalité et son utilité
3. Incluez des maquettes ou diagrammes si possible
4. Attendez l'approbation avant de commencer le développement

### Soumettre du Code 🔧

#### 1. Fork et Clone

```bash
# Fork le projet sur GitHub puis :
git clone https://github.com/votre-username/talent-platform.git
cd talent-platform
npm install
```

#### 2. Créer une Branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug
```

**Convention de nommage des branches :**

- `feature/` pour nouvelles fonctionnalités
- `fix/` pour corrections de bugs
- `docs/` pour documentation
- `refactor/` pour refactoring
- `test/` pour ajout de tests

#### 3. Développer

**Standards de Code :**

- Utilisez ESLint et Prettier (configuration fournie)
- Suivez les conventions de nommage JavaScript
- Ajoutez des commentaires JSDoc pour les fonctions
- Utilisez PropTypes pour les composants React
- Testez vos changements localement

**Structure des Commits :**

```
type(scope): description courte

Description détaillée si nécessaire

Fixes #123
```

Types : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Exemples :**

```bash
git commit -m "feat(auth): ajouter authentification à deux facteurs"
git commit -m "fix(profile): corriger validation email"
git commit -m "docs(readme): mettre à jour instructions installation"
```

#### 4. Tester

```bash
# Lancer les tests
npm run test

# Vérifier le linting
npm run lint

# Build du projet
npm run build
```

#### 5. Push et Pull Request

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

Créez une Pull Request avec :

- Un titre clair et descriptif
- Une description détaillée des changements
- Des captures d'écran pour les changements UI
- La référence aux issues concernées (`Fixes #123`)

**Template PR :**

```markdown
## Description

Brève description des changements

## Type de Changement

- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests

- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests manuels effectués
- [ ] Toutes les tests passent

## Checklist

- [ ] Code respecte les standards du projet
- [ ] Documentation mise à jour
- [ ] Pas de warnings de build
- [ ] Testé sur différents navigateurs
```

### Workflow de Review

1. Au moins un mainteneur doit approuver la PR
2. Tous les tests CI/CD doivent passer
3. Résolvez tous les commentaires de review
4. La branche sera mergée par un mainteneur

## Standards de Code

### JavaScript/React

```javascript
// ✅ Bon
export default function UserCard({ user, onEdit }) {
  const { name, email } = user

  const handleClick = () => {
    onEdit(user.id)
  }

  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
      <button onClick={handleClick}>Modifier</button>
    </div>
  )
}

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  onEdit: PropTypes.func.isRequired
}

// ❌ Mauvais
function usercard(props) {
  return <div>{props.user.name}</div>
}
```

### CSS/Tailwind

- Privilégiez Tailwind CSS aux styles custom
- Utilisez les classes utilitaires de manière cohérente
- Créez des composants réutilisables pour éviter la duplication
- Respectez le design system (couleurs, espacements)

### Accessibilité

- Utilisez des balises sémantiques (`<nav>`, `<main>`, `<article>`)
- Ajoutez des attributs ARIA quand nécessaire
- Assurez un contraste suffisant (WCAG AA minimum)
- Testez la navigation au clavier
- Incluez des labels explicites pour les formulaires

## Structure du Projet

```
talent-platform/
├── app/                    # Pages Next.js (App Router)
│   ├── (auth)/            # Routes authentification
│   ├── (protected)/       # Routes protégées
│   └── (public)/          # Routes publiques
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   ├── forms/            # Formulaires
│   └── layouts/          # Layouts
├── lib/                  # Utilitaires et configuration
│   ├── constants.js      # Constants globales
│   ├── utils.js          # Fonctions utilitaires
│   ├── supabase.js       # Client Supabase
│   └── hooks/            # Hooks personnalisés
├── public/               # Assets statiques
└── __tests__/            # Tests
```

## Conventions de Nommage

- **Composants** : PascalCase (`UserCard.js`)
- **Hooks** : camelCase avec préfixe `use` (`useAuth.js`)
- **Utils** : camelCase (`formatDate.js`)
- **Constants** : UPPER_SNAKE_CASE (`MAX_USERS`)
- **CSS Classes** : kebab-case ou Tailwind

## Documentation

- Documentez toutes les fonctions publiques avec JSDoc
- Mettez à jour le README si nécessaire
- Ajoutez des commentaires pour la logique complexe
- Créez des exemples d'utilisation pour nouveaux composants

## Questions ?

- Consultez la [documentation](README.md)
- Ouvrez une [discussion](https://github.com/votre-org/talent-platform/discussions)
- Contactez l'équipe : talent-map@cesi.fr

Merci pour votre contribution ! 🙏
