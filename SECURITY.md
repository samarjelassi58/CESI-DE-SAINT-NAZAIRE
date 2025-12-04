# Security Policy

## Versions Supportées

| Version | Supportée          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Signaler une Vulnérabilité

La sécurité de Talent Map est notre priorité. Si vous découvrez une vulnérabilité de sécurité, merci de nous la signaler de manière responsable.

### Comment Signaler

**⚠️ NE PAS créer d'issue publique pour les vulnérabilités de sécurité**

À la place :

1. **Email** : Envoyez un email détaillé à **security@talent-map-cesi.fr**
2. **Encryption** : Utilisez notre clé PGP si possible (disponible sur demande)
3. **Détails** : Incluez :
   - Description de la vulnérabilité
   - Étapes pour reproduire
   - Impact potentiel
   - Suggestions de correction (si possible)

### Ce qui se passe ensuite

1. **Confirmation** : Nous accusons réception sous 48h
2. **Investigation** : Évaluation de la vulnérabilité (2-5 jours)
3. **Correction** : Développement d'un patch
4. **Communication** : Mise à jour coordonnée
5. **Crédit** : Reconnaissance publique (si souhaité)

### Ce que nous promettons

✅ Réponse rapide et professionnelle  
✅ Vous tenir informé du progrès  
✅ Crédit public pour la découverte (si souhaité)  
✅ Pas de poursuites pour signalement responsable

## Bonnes Pratiques de Sécurité

### Pour les Développeurs

- Ne commitez JAMAIS de secrets (.env, clés API)
- Utilisez des variables d'environnement
- Validez toutes les entrées utilisateur
- Sanitisez les données avant affichage
- Utilisez HTTPS en production
- Gardez les dépendances à jour

### Pour les Utilisateurs

- Utilisez des mots de passe forts et uniques
- Activez l'authentification à deux facteurs
- Ne partagez pas vos identifiants
- Déconnectez-vous des sessions publiques
- Signalez tout comportement suspect

## Vulnérabilités Connues

Nous publierons ici les CVE et vulnérabilités corrigées :

### [Date] - [Titre]

- **Sévérité** : Critique/Haute/Moyenne/Basse
- **Impact** : Description
- **Correction** : Version X.Y.Z
- **CVE** : CVE-XXXX-XXXXX (si applicable)

---

**Dernière mise à jour** : Décembre 2025
