-- ========================================
-- SCRIPT DE REMPLISSAGE COMPLET
-- Défi National CESI 2025 - Carte des Talents
-- ========================================

-- 1. METTRE À JOUR LE PROFIL ADMIN
UPDATE profiles 
SET 
  full_name = 'Administrateur CESI',
  bio = 'Administrateur de la plateforme Défi National CESI. Responsable de la validation des talents et de la gestion de la communauté.',
  location = 'Paris, France',
  phone = '+33 1 23 45 67 89',
  is_available = true,
  is_verified = true
WHERE email = 'admin@cesi.fr';


-- 2. AJOUTER DES COMPÉTENCES À L'ADMIN
INSERT INTO skills (user_id, name, category, level, years_experience) VALUES
((SELECT id FROM profiles WHERE email = 'admin@cesi.fr'), 'Gestion de projet', 'soft-skill', 'expert', 10),
((SELECT id FROM profiles WHERE email = 'admin@cesi.fr'), 'Management', 'soft-skill', 'expert', 10),
((SELECT id FROM profiles WHERE email = 'admin@cesi.fr'), 'Leadership', 'soft-skill', 'expert', 10);

-- 3. AJOUTER DES LANGUES À L'ADMIN  
INSERT INTO languages (user_id, name, proficiency) VALUES
((SELECT id FROM profiles WHERE email = 'admin@cesi.fr'), 'Français', 'natif'),
((SELECT id FROM profiles WHERE email = 'admin@cesi.fr'), 'Anglais', 'C2');

-- ========================================
-- DONNÉES POUR COMPTES DE DÉMONSTRATION
-- ========================================
-- INSTRUCTIONS: Créez d'abord ces utilisateurs via Authentication > Add User:
-- 1. marie.martin@cesi.fr (Mot de passe: Marie123!)
-- 2. pierre.bernard@cesi.fr (Mot de passe: Pierre123!)
-- 3. sophie.dubois@cesi.fr (Mot de passe: Sophie123!)
-- 4. lucas.petit@cesi.fr (Mot de passe: Lucas123!)
-- 5. julie.moreau@cesi.fr (Mot de passe: Julie123!)

-- Ensuite, créez leurs profils:
INSERT INTO profiles (id, email, full_name, bio, location, phone, is_verified, is_available)
SELECT id, email, 
  CASE email
    WHEN 'marie.martin@cesi.fr' THEN 'Marie Martin'
    WHEN 'pierre.bernard@cesi.fr' THEN 'Pierre Bernard'
    WHEN 'sophie.dubois@cesi.fr' THEN 'Sophie Dubois'
    WHEN 'lucas.petit@cesi.fr' THEN 'Lucas Petit'
    WHEN 'julie.moreau@cesi.fr' THEN 'Julie Moreau'
  END,
  CASE email
    WHEN 'marie.martin@cesi.fr' THEN 'Développeuse Full Stack passionnée par React et Node.js. 4 ans d''expérience dans le développement web moderne.'
    WHEN 'pierre.bernard@cesi.fr' THEN 'Expert en cybersécurité et développement sécurisé. Certifié OSCP et passionné par les CTF.'
    WHEN 'sophie.dubois@cesi.fr' THEN 'Data Scientist spécialisée en Machine Learning et IA. Kaggle Master avec plusieurs projets d''analyse prédictive.'
    WHEN 'lucas.petit@cesi.fr' THEN 'Designer UX/UI et développeur frontend. Passionné par l''accessibilité web et le design thinking.'
    WHEN 'julie.moreau@cesi.fr' THEN 'Chef de projet digital et Scrum Master certifiée. 6 ans d''expérience en transformation agile.'
  END,
  CASE email
    WHEN 'marie.martin@cesi.fr' THEN 'Lyon, France'
    WHEN 'pierre.bernard@cesi.fr' THEN 'Toulouse, France'
    WHEN 'sophie.dubois@cesi.fr' THEN 'Bordeaux, France'
    WHEN 'lucas.petit@cesi.fr' THEN 'Nantes, France'
    WHEN 'julie.moreau@cesi.fr' THEN 'Lille, France'
  END,
  '+33 6' || LPAD(FLOOR(RANDOM() * 100000000)::TEXT, 8, '0'),
  true,
  true
FROM auth.users 
WHERE email IN ('marie.martin@cesi.fr', 'pierre.bernard@cesi.fr', 'sophie.dubois@cesi.fr', 'lucas.petit@cesi.fr', 'julie.moreau@cesi.fr')
ON CONFLICT (id) DO NOTHING;

-- 4. COMPÉTENCES - Marie Martin (Full Stack Dev)
INSERT INTO skills (user_id, name, category, level, years_experience) 
SELECT id, name, category, level, years_exp FROM profiles, (VALUES
  ('JavaScript', 'technique', 'expert', 5),
  ('React', 'technique', 'expert', 4),
  ('Next.js', 'technique', 'avance', 3),
  ('Node.js', 'technique', 'avance', 4),
  ('TypeScript', 'technique', 'avance', 3),
  ('PostgreSQL', 'technique', 'avance', 3),
  ('Docker', 'technique', 'intermediaire', 2),
  ('Git', 'technique', 'expert', 4),
  ('Communication', 'soft-skill', 'avance', 5),
  ('Travail d''équipe', 'soft-skill', 'expert', 5)
) AS skills(name, category, level, years_exp)
WHERE email = 'marie.martin@cesi.fr';

-- 5. COMPÉTENCES - Pierre Bernard (Cybersécurité)
INSERT INTO skills (user_id, name, category, level, years_experience)
SELECT id, name, category, level, years_exp FROM profiles, (VALUES
  ('Python', 'technique', 'expert', 6),
  ('Sécurité Web', 'technique', 'expert', 5),
  ('Pentest', 'technique', 'avance', 4),
  ('Cryptographie', 'technique', 'avance', 5),
  ('Linux', 'technique', 'expert', 7),
  ('Kali Linux', 'technique', 'expert', 5),
  ('Burp Suite', 'technique', 'avance', 4),
  ('Analyse critique', 'soft-skill', 'expert', 6),
  ('Résolution de problèmes', 'soft-skill', 'expert', 6)
) AS skills(name, category, level, years_exp)
WHERE email = 'pierre.bernard@cesi.fr';

-- 6. COMPÉTENCES - Sophie Dubois (Data Science)
INSERT INTO skills (user_id, name, category, level, years_experience)
SELECT id, name, category, level, years_exp FROM profiles, (VALUES
  ('Python', 'technique', 'expert', 5),
  ('Machine Learning', 'technique', 'expert', 4),
  ('TensorFlow', 'technique', 'avance', 3),
  ('Scikit-learn', 'technique', 'expert', 4),
  ('Pandas', 'technique', 'expert', 5),
  ('SQL', 'technique', 'avance', 4),
  ('Data Visualization', 'technique', 'avance', 3),
  ('R', 'technique', 'intermediaire', 2),
  ('Analyse de données', 'soft-skill', 'expert', 5),
  ('Esprit d''analyse', 'soft-skill', 'expert', 5)
) AS skills(name, category, level, years_exp)
WHERE email = 'sophie.dubois@cesi.fr';

-- 7. COMPÉTENCES - Lucas Petit (UX/UI Designer)
INSERT INTO skills (user_id, name, category, level, years_experience)
SELECT id, name, category, level, years_exp FROM profiles, (VALUES
  ('Figma', 'technique', 'expert', 4),
  ('Adobe XD', 'technique', 'avance', 3),
  ('Photoshop', 'technique', 'avance', 5),
  ('HTML/CSS', 'technique', 'expert', 5),
  ('JavaScript', 'technique', 'avance', 3),
  ('Design Thinking', 'technique', 'avance', 4),
  ('Prototyping', 'technique', 'expert', 4),
  ('Créativité', 'soft-skill', 'expert', 5),
  ('Empathie', 'soft-skill', 'avance', 4)
) AS skills(name, category, level, years_exp)
WHERE email = 'lucas.petit@cesi.fr';

-- 8. COMPÉTENCES - Julie Moreau (Chef de projet)
INSERT INTO skills (user_id, name, category, level, years_experience)
SELECT id, name, category, level, years_exp FROM profiles, (VALUES
  ('Scrum', 'technique', 'expert', 4),
  ('Agile', 'technique', 'expert', 5),
  ('Jira', 'technique', 'avance', 4),
  ('Confluence', 'technique', 'avance', 4),
  ('MS Project', 'technique', 'intermediaire', 3),
  ('Management', 'soft-skill', 'expert', 6),
  ('Leadership', 'soft-skill', 'expert', 6),
  ('Communication', 'soft-skill', 'expert', 6),
  ('Coaching', 'soft-skill', 'avance', 4)
) AS skills(name, category, level, years_exp)
WHERE email = 'julie.moreau@cesi.fr';

-- 9. LANGUES
INSERT INTO languages (user_id, name, proficiency)
SELECT id, name, proficiency FROM profiles, (VALUES
  ('Français', 'natif'), ('Anglais', 'C1'), ('Espagnol', 'B1')
) AS langs(name, proficiency)
WHERE email = 'marie.martin@cesi.fr';

INSERT INTO languages (user_id, name, proficiency)
SELECT id, name, proficiency FROM profiles, (VALUES
  ('Français', 'natif'), ('Anglais', 'C2'), ('Allemand', 'B2')
) AS langs(name, proficiency)
WHERE email = 'pierre.bernard@cesi.fr';

INSERT INTO languages (user_id, name, proficiency)
SELECT id, name, proficiency FROM profiles, (VALUES
  ('Français', 'natif'), ('Anglais', 'C1')
) AS langs(name, proficiency)
WHERE email = 'sophie.dubois@cesi.fr';

INSERT INTO languages (user_id, name, proficiency)
SELECT id, name, proficiency FROM profiles, (VALUES
  ('Français', 'natif'), ('Anglais', 'B2'), ('Italien', 'B1')
) AS langs(name, proficiency)
WHERE email = 'lucas.petit@cesi.fr';

INSERT INTO languages (user_id, name, proficiency)
SELECT id, name, proficiency FROM profiles, (VALUES
  ('Français', 'natif'), ('Anglais', 'C2')
) AS langs(name, proficiency)
WHERE email = 'julie.moreau@cesi.fr';

-- 10. PROJETS - Marie Martin
INSERT INTO projects (user_id, title, description, technologies, start_date, end_date, is_current)
SELECT id,
  'Plateforme E-commerce',
  'Développement d''une plateforme e-commerce complète avec panier, paiement Stripe et gestion des stocks en temps réel.',
  ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
  '2024-01-15'::date,
  '2024-06-30'::date,
  false
FROM profiles WHERE email = 'marie.martin@cesi.fr'
UNION ALL
SELECT id,
  'Application RH',
  'Application de gestion RH avec suivi des congés, évaluations annuelles et onboarding des nouveaux employés.',
  ARRAY['Next.js', 'Supabase', 'Tailwind CSS'],
  '2024-07-01'::date,
  NULL,
  true
FROM profiles WHERE email = 'marie.martin@cesi.fr';

-- 11. PROJETS - Pierre Bernard
INSERT INTO projects (user_id, title, description, technologies, start_date, end_date, is_current)
SELECT id,
  'Audit de sécurité bancaire',
  'Audit complet de sécurité pour une application bancaire mobile : tests d''intrusion, analyse de code, revue d''architecture.',
  ARRAY['Python', 'Burp Suite', 'OWASP ZAP', 'Metasploit'],
  '2024-03-01'::date,
  '2024-05-15'::date,
  false
FROM profiles WHERE email = 'pierre.bernard@cesi.fr'
UNION ALL
SELECT id,
  'Outil de pentest automatisé',
  'Développement d''un outil de pentest automatisé pour applications web avec génération de rapports détaillés.',
  ARRAY['Python', 'Selenium', 'Docker', 'FastAPI'],
  '2024-06-01'::date,
  NULL,
  true
FROM profiles WHERE email = 'pierre.bernard@cesi.fr';

-- 12. PROJETS - Sophie Dubois
INSERT INTO projects (user_id, title, description, technologies, start_date, end_date, is_current)
SELECT id,
  'Prédiction de churn client',
  'Modèle de Machine Learning pour prédire le risque de départ des clients avec 92% de précision.',
  ARRAY['Python', 'Scikit-learn', 'Pandas', 'Jupyter', 'XGBoost'],
  '2024-02-01'::date,
  '2024-04-30'::date,
  false
FROM profiles WHERE email = 'sophie.dubois@cesi.fr'
UNION ALL
SELECT id,
  'Système de recommandation',
  'Système de recommandation de produits basé sur l''IA avec filtrage collaboratif et deep learning.',
  ARRAY['Python', 'TensorFlow', 'FastAPI', 'Redis'],
  '2024-05-01'::date,
  NULL,
  true
FROM profiles WHERE email = 'sophie.dubois@cesi.fr';

-- 13. PROJETS - Lucas Petit
INSERT INTO projects (user_id, title, description, technologies, start_date, end_date, is_current)
SELECT id,
  'Refonte UX app de livraison',
  'Refonte complète de l''expérience utilisateur d''une application de livraison : recherche utilisateur, wireframes, prototypes.',
  ARRAY['Figma', 'Adobe XD', 'UserTesting'],
  '2024-01-10'::date,
  '2024-03-20'::date,
  false
FROM profiles WHERE email = 'lucas.petit@cesi.fr'
UNION ALL
SELECT id,
  'Design System entreprise',
  'Création d''un design system complet avec bibliothèque de composants React et documentation Storybook.',
  ARRAY['Figma', 'React', 'Storybook', 'Tailwind CSS'],
  '2024-04-01'::date,
  NULL,
  true
FROM profiles WHERE email = 'lucas.petit@cesi.fr';

-- 14. PROJETS - Julie Moreau
INSERT INTO projects (user_id, title, description, technologies, start_date, end_date, is_current)
SELECT id,
  'Transformation agile',
  'Accompagnement d''une équipe de 25 personnes dans sa transformation agile : formation, coaching, mise en place de rituels.',
  ARRAY['Scrum', 'Jira', 'Confluence', 'Miro'],
  '2024-01-01'::date,
  NULL,
  true
FROM profiles WHERE email = 'julie.moreau@cesi.fr';

-- 15. PASSIONS
INSERT INTO passions (user_id, name, description)
SELECT id, 'Open Source', 'Contributrice active sur GitHub, notamment sur des projets React et Next.js.' FROM profiles WHERE email = 'marie.martin@cesi.fr'
UNION ALL
SELECT id, 'Tech for Good', 'Passionnée par l''utilisation de la technologie pour résoudre des problèmes sociaux.' FROM profiles WHERE email = 'marie.martin@cesi.fr'
UNION ALL
SELECT id, 'CTF Competitions', 'Participation régulière aux compétitions Capture The Flag en cybersécurité.' FROM profiles WHERE email = 'pierre.bernard@cesi.fr'
UNION ALL
SELECT id, 'Formation', 'Formateur bénévole en sécurité informatique pour étudiants et professionnels.' FROM profiles WHERE email = 'pierre.bernard@cesi.fr'
UNION ALL
SELECT id, 'Kaggle', 'Kaggle Master avec plusieurs compétitions gagnées en Data Science et ML.' FROM profiles WHERE email = 'sophie.dubois@cesi.fr'
UNION ALL
SELECT id, 'Vulgarisation scientifique', 'Blog et chaîne YouTube sur l''IA et le Machine Learning (10k abonnés).' FROM profiles WHERE email = 'sophie.dubois@cesi.fr'
UNION ALL
SELECT id, 'Photographie', 'Photographie créative et design graphique comme loisir, Instagram @lucas_designs.' FROM profiles WHERE email = 'lucas.petit@cesi.fr'
UNION ALL
SELECT id, 'Accessibilité web', 'Militant pour l''accessibilité numérique et l''inclusion dans le design.' FROM profiles WHERE email = 'lucas.petit@cesi.fr'
UNION ALL
SELECT id, 'Coaching', 'Coach agile certifiée, accompagnement d''équipes en transformation digitale.' FROM profiles WHERE email = 'julie.moreau@cesi.fr'
UNION ALL
SELECT id, 'Entrepreneuriat', 'Mentorat de startups et participation active à des hackathons.' FROM profiles WHERE email = 'julie.moreau@cesi.fr';

-- 16. BADGES
INSERT INTO badges (user_id, type, name, description, verified_at, verified_by)
SELECT 
  p1.id, 
  'expert',
  'Expert React',
  'Experte React certifiée avec 4 ans d''expérience professionnelle',
  NOW() - INTERVAL '30 days',
  p2.id
FROM profiles p1, profiles p2 
WHERE p1.email = 'marie.martin@cesi.fr' AND p2.email = 'admin@cesi.fr';

INSERT INTO badges (user_id, type, name, description, verified_at, verified_by)
SELECT 
  p1.id, 
  'expert',
  'Expert Cybersécurité',
  'Expert cybersécurité certifié OSCP (Offensive Security Certified Professional)',
  NOW() - INTERVAL '60 days',
  p2.id
FROM profiles p1, profiles p2 
WHERE p1.email = 'pierre.bernard@cesi.fr' AND p2.email = 'admin@cesi.fr';

INSERT INTO badges (user_id, type, name, description, verified_at, verified_by)
SELECT 
  p1.id, 
  'expert',
  'Expert Data Science',
  'Data Scientist certifiée TensorFlow Developer Certificate',
  NOW() - INTERVAL '45 days',
  p2.id
FROM profiles p1, profiles p2 
WHERE p1.email = 'sophie.dubois@cesi.fr' AND p2.email = 'admin@cesi.fr';

INSERT INTO badges (user_id, type, name, description, verified_at, verified_by)
SELECT 
  p1.id, 
  'mentor',
  'Mentor Scrum',
  'Mentor Scrum certifié PSM II (Professional Scrum Master)',
  NOW() - INTERVAL '90 days',
  p2.id
FROM profiles p1, profiles p2 
WHERE p1.email = 'julie.moreau@cesi.fr' AND p2.email = 'admin@cesi.fr';

-- 17. COLLABORATIONS
INSERT INTO collaborations (requester_id, receiver_id, project_title, description, required_skills, status, created_at)
SELECT 
  p1.id,
  p2.id,
  'Refonte UI plateforme RH',
  'Besoin d''un designer UX/UI pour améliorer l''expérience utilisateur de notre application RH et créer un design system cohérent.',
  ARRAY['Figma', 'Design UX', 'Prototyping'],
  'accepted',
  NOW() - INTERVAL '10 days'
FROM profiles p1, profiles p2 
WHERE p1.email = 'marie.martin@cesi.fr' AND p2.email = 'lucas.petit@cesi.fr';

INSERT INTO collaborations (requester_id, receiver_id, project_title, description, required_skills, status, created_at)
SELECT 
  p1.id,
  p2.id,
  'API ML prédictive',
  'Besoin d''aide pour développer une API RESTful performante pour exposer mes modèles de Machine Learning en production.',
  ARRAY['Node.js', 'API REST', 'Docker'],
  'pending',
  NOW() - INTERVAL '3 days'
FROM profiles p1, profiles p2 
WHERE p1.email = 'sophie.dubois@cesi.fr' AND p2.email = 'marie.martin@cesi.fr';

INSERT INTO collaborations (requester_id, receiver_id, project_title, description, required_skills, status, created_at)
SELECT 
  p1.id,
  p2.id,
  'Audit sécurité application web',
  'Recherche expert en cybersécurité pour audit complet de sécurité de notre plateforme e-commerce avant mise en production.',
  ARRAY['Sécurité Web', 'Pentest', 'OWASP'],
  'pending',
  NOW() - INTERVAL '2 days'
FROM profiles p1, profiles p2 
WHERE p1.email = 'marie.martin@cesi.fr' AND p2.email = 'pierre.bernard@cesi.fr';

INSERT INTO collaborations (requester_id, receiver_id, project_title, description, required_skills, status, created_at)
SELECT 
  p1.id,
  p2.id,
  'Coaching transformation agile',
  'Besoin d''accompagnement pour mettre en place Scrum dans mon équipe de développement (8 personnes).',
  ARRAY['Scrum', 'Coaching', 'Management'],
  'accepted',
  NOW() - INTERVAL '15 days'
FROM profiles p1, profiles p2 
WHERE p1.email = 'marie.martin@cesi.fr' AND p2.email = 'julie.moreau@cesi.fr';

-- 18. MESSAGES
INSERT INTO messages (collaboration_id, sender_id, content, created_at)
SELECT 
  c.id,
  c.requester_id,
  'Salut Lucas ! Merci d''avoir accepté la collaboration. Quand es-tu disponible pour une première réunion de cadrage ?',
  NOW() - INTERVAL '9 days'
FROM collaborations c
JOIN profiles p1 ON c.requester_id = p1.id
WHERE p1.email = 'marie.martin@cesi.fr' AND c.project_title = 'Refonte UI plateforme RH';

INSERT INTO messages (collaboration_id, sender_id, content, created_at)
SELECT 
  c.id,
  c.receiver_id,
  'Bonjour Marie ! Avec plaisir. Je suis disponible cette semaine. Mardi 14h ça te convient ?',
  NOW() - INTERVAL '9 days' + INTERVAL '2 hours'
FROM collaborations c
JOIN profiles p1 ON c.requester_id = p1.id
WHERE p1.email = 'marie.martin@cesi.fr' AND c.project_title = 'Refonte UI plateforme RH';

INSERT INTO messages (collaboration_id, sender_id, content, created_at)
SELECT 
  c.id,
  c.requester_id,
  'Parfait ! Je t''envoie le lien Teams. À mardi !',
  NOW() - INTERVAL '8 days'
FROM collaborations c
JOIN profiles p1 ON c.requester_id = p1.id
WHERE p1.email = 'marie.martin@cesi.fr' AND c.project_title = 'Refonte UI plateforme RH';

INSERT INTO messages (collaboration_id, sender_id, content, created_at)
SELECT 
  c.id,
  c.requester_id,
  'Bonjour Julie ! J''aimerais discuter de la mise en place de Scrum dans mon équipe. Nous sommes 8 développeurs et nous travaillons actuellement en mode "cascade".',
  NOW() - INTERVAL '14 days'
FROM collaborations c
JOIN profiles p1 ON c.requester_id = p1.id
WHERE p1.email = 'marie.martin@cesi.fr' AND c.project_title = 'Coaching transformation agile';

INSERT INTO messages (collaboration_id, sender_id, content, created_at)
SELECT 
  c.id,
  c.receiver_id,
  'Bonjour Marie ! Excellente initiative. Je propose qu''on commence par un diagnostic de l''existant. Tu as déjà une idée de la durée des sprints que tu vises ?',
  NOW() - INTERVAL '14 days' + INTERVAL '3 hours'
FROM collaborations c
JOIN profiles p1 ON c.requester_id = p1.id
WHERE p1.email = 'marie.martin@cesi.fr' AND c.project_title = 'Coaching transformation agile';

-- ========================================
-- VÉRIFICATION DES DONNÉES
-- ========================================
SELECT 
  'RÉSUMÉ DES DONNÉES INSÉRÉES' as titre,
  '' as detail
UNION ALL
SELECT '-------------------', '-------------------'
UNION ALL
SELECT 'Profiles', COUNT(*)::TEXT FROM profiles
UNION ALL
SELECT 'Skills', COUNT(*)::TEXT FROM skills
UNION ALL
SELECT 'Languages', COUNT(*)::TEXT FROM languages
UNION ALL
SELECT 'Projects', COUNT(*)::TEXT FROM projects
UNION ALL
SELECT 'Passions', COUNT(*)::TEXT FROM passions
UNION ALL
SELECT 'Badges', COUNT(*)::TEXT FROM badges
UNION ALL
SELECT 'Collaborations', COUNT(*)::TEXT FROM collaborations
UNION ALL
SELECT 'Messages', COUNT(*)::TEXT FROM messages;

-- Détail par profil
SELECT 
  p.full_name,
  p.email,
  COUNT(DISTINCT s.id) as skills,
  COUNT(DISTINCT l.id) as langues,
  COUNT(DISTINCT pr.id) as projets,
  COUNT(DISTINCT pa.id) as passions,
  p.is_verified as verifie
FROM profiles p
LEFT JOIN skills s ON s.user_id = p.id
LEFT JOIN languages l ON l.user_id = p.id
LEFT JOIN projects pr ON pr.user_id = p.id
LEFT JOIN passions pa ON pa.user_id = p.id
GROUP BY p.id, p.full_name, p.email, p.is_verified
ORDER BY p.email;

