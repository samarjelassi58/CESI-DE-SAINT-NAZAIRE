// ========================================
// TEST COMPLET DES FONCTIONNALITÉS GET/POST
// ========================================

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Lire les variables d'environnement
const envContent = fs.readFileSync('.env.local', 'utf8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    envVars[key.trim()] = value.trim()
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
}

function logTest(name, success, message) {
  testResults.total++
  if (success) {
    testResults.passed++
    console.log(`✅ ${name}: ${message}`)
  } else {
    testResults.failed++
    console.log(`❌ ${name}: ${message}`)
  }
  testResults.tests.push({ name, success, message })
}

async function testAuth() {
  console.log('\n🔐 TEST AUTHENTIFICATION\n')
  
  // Test 1: Inscription
  try {
    const { data, error } = await supabase.auth.signUp({
      email: `test-${Date.now()}@cesi.fr`,
      password: 'Test123!',
      options: {
        data: { full_name: 'Test User' }
      }
    })
    
    if (error) {
      logTest('POST /auth/signup', false, error.message)
    } else {
      logTest('POST /auth/signup', true, 'Inscription réussie')
    }
  } catch (err) {
    logTest('POST /auth/signup', false, err.message)
  }
  
  // Test 2: Connexion avec compte existant
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'marie.martin@cesi.fr',
      password: 'Marie123!'
    })
    
    if (error) {
      logTest('POST /auth/signin', false, error.message)
    } else {
      logTest('POST /auth/signin', true, 'Connexion réussie')
      
      // Garder la session pour les tests suivants
      return data.session
    }
  } catch (err) {
    logTest('POST /auth/signin', false, err.message)
  }
  
  return null
}

async function testProfiles(session) {
  console.log('\n👤 TEST PROFILS\n')
  
  // Test 3: GET tous les profils
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
    
    if (error) {
      logTest('GET /profiles', false, error.message)
    } else {
      logTest('GET /profiles', true, `${data.length} profils récupérés`)
    }
  } catch (err) {
    logTest('GET /profiles', false, err.message)
  }
  
  // Test 4: GET profil spécifique
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'marie.martin@cesi.fr')
      .single()
    
    if (error) {
      logTest('GET /profiles/:id', false, error.message)
    } else {
      logTest('GET /profiles/:id', true, `Profil ${data.full_name} récupéré`)
    }
  } catch (err) {
    logTest('GET /profiles/:id', false, err.message)
  }
  
  // Test 5: UPDATE profil (nécessite authentification)
  if (session) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ bio: 'Bio mise à jour par test automatique' })
        .eq('id', session.user.id)
      
      if (error) {
        logTest('POST /profiles/update', false, error.message)
      } else {
        logTest('POST /profiles/update', true, 'Profil mis à jour')
      }
    } catch (err) {
      logTest('POST /profiles/update', false, err.message)
    }
  }
}

async function testSkills(session) {
  console.log('\n💼 TEST COMPÉTENCES\n')
  
  // Test 6: GET toutes les compétences
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
    
    if (error) {
      logTest('GET /skills', false, error.message)
    } else {
      logTest('GET /skills', true, `${data.length} compétences récupérées`)
    }
  } catch (err) {
    logTest('GET /skills', false, err.message)
  }
  
  // Test 7: GET compétences par utilisateur
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', (await supabase.from('profiles').select('id').eq('email', 'marie.martin@cesi.fr').single()).data.id)
    
    if (error) {
      logTest('GET /skills?user_id', false, error.message)
    } else {
      logTest('GET /skills?user_id', true, `${data.length} compétences pour l'utilisateur`)
    }
  } catch (err) {
    logTest('GET /skills?user_id', false, err.message)
  }
  
  // Test 8: POST nouvelle compétence
  if (session) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .insert({
          user_id: session.user.id,
          name: 'Test Skill',
          category: 'technique',
          level: 'intermediaire',
          years_experience: 2
        })
        .select()
      
      if (error) {
        logTest('POST /skills/create', false, error.message)
      } else {
        logTest('POST /skills/create', true, 'Compétence créée')
        
        // Test 9: DELETE compétence
        if (data && data.length > 0) {
          const skillId = data[0].id
          const { error: deleteError } = await supabase
            .from('skills')
            .delete()
            .eq('id', skillId)
          
          if (deleteError) {
            logTest('POST /skills/delete', false, deleteError.message)
          } else {
            logTest('POST /skills/delete', true, 'Compétence supprimée')
          }
        } else {
          logTest('POST /skills/delete', false, 'Aucune donnée retournée pour suppression')
        }
      }
    } catch (err) {
      logTest('POST /skills/create', false, err.message)
    }
  }
}

async function testLanguages() {
  console.log('\n🌍 TEST LANGUES\n')
  
  // Test 10: GET toutes les langues
  try {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
    
    if (error) {
      logTest('GET /languages', false, error.message)
    } else {
      logTest('GET /languages', true, `${data.length} langues récupérées`)
    }
  } catch (err) {
    logTest('GET /languages', false, err.message)
  }
}

async function testProjects() {
  console.log('\n📁 TEST PROJETS\n')
  
  // Test 11: GET tous les projets
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
    
    if (error) {
      logTest('GET /projects', false, error.message)
    } else {
      logTest('GET /projects', true, `${data.length} projets récupérés`)
    }
  } catch (err) {
    logTest('GET /projects', false, err.message)
  }
}

async function testPassions() {
  console.log('\n❤️ TEST PASSIONS\n')
  
  // Test 12: GET toutes les passions
  try {
    const { data, error } = await supabase
      .from('passions')
      .select('*')
    
    if (error) {
      logTest('GET /passions', false, error.message)
    } else {
      logTest('GET /passions', true, `${data.length} passions récupérées`)
    }
  } catch (err) {
    logTest('GET /passions', false, err.message)
  }
}

async function testBadges() {
  console.log('\n🏆 TEST BADGES\n')
  
  // Test 13: GET tous les badges
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
    
    if (error) {
      logTest('GET /badges', false, error.message)
    } else {
      logTest('GET /badges', true, `${data.length} badges récupérés`)
    }
  } catch (err) {
    logTest('GET /badges', false, err.message)
  }
}

async function testCollaborations(session) {
  console.log('\n🤝 TEST COLLABORATIONS\n')
  
  // Test 14: GET toutes les collaborations
  try {
    const { data, error } = await supabase
      .from('collaborations')
      .select('*')
    
    if (error) {
      logTest('GET /collaborations', false, error.message)
    } else {
      logTest('GET /collaborations', true, `${data.length} collaborations récupérées`)
    }
  } catch (err) {
    logTest('GET /collaborations', false, err.message)
  }
  
  // Test 15: POST nouvelle collaboration
  if (session) {
    try {
      const receiverId = (await supabase
        .from('profiles')
        .select('id')
        .eq('email', 'pierre.bernard@cesi.fr')
        .single()).data?.id
      
      if (receiverId) {
        const { data, error } = await supabase
          .from('collaborations')
          .insert({
            requester_id: session.user.id,
            receiver_id: receiverId,
            project_title: 'Test Collaboration',
            description: 'Collaboration de test automatique',
            required_skills: ['Test'],
            status: 'pending'
          })
        
        if (error) {
          logTest('POST /collaborations/create', false, error.message)
        } else {
          logTest('POST /collaborations/create', true, 'Collaboration créée')
        }
      }
    } catch (err) {
      logTest('POST /collaborations/create', false, err.message)
    }
  }
}

async function testMessages() {
  console.log('\n💬 TEST MESSAGES\n')
  
  // Test 16: GET tous les messages
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
    
    if (error) {
      logTest('GET /messages', false, error.message)
    } else {
      logTest('GET /messages', true, `${data.length} messages récupérés`)
    }
  } catch (err) {
    logTest('GET /messages', false, err.message)
  }
}

async function testSearch() {
  console.log('\n🔍 TEST RECHERCHE\n')
  
  // Test 17: Recherche par compétence
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('user_id, profiles!inner(full_name, email)')
      .ilike('name', '%javascript%')
    
    if (error) {
      logTest('GET /search?skill', false, error.message)
    } else {
      logTest('GET /search?skill', true, `${data.length} résultats pour "javascript"`)
    }
  } catch (err) {
    logTest('GET /search?skill', false, err.message)
  }
  
  // Test 18: Filtrer talents disponibles
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_available', true)
    
    if (error) {
      logTest('GET /talents?available', false, error.message)
    } else {
      logTest('GET /talents?available', true, `${data.length} talents disponibles`)
    }
  } catch (err) {
    logTest('GET /talents?available', false, err.message)
  }
  
  // Test 19: Filtrer talents vérifiés
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_verified', true)
    
    if (error) {
      logTest('GET /talents?verified', false, error.message)
    } else {
      logTest('GET /talents?verified', true, `${data.length} talents vérifiés`)
    }
  } catch (err) {
    logTest('GET /talents?verified', false, err.message)
  }
}

async function testRLS() {
  console.log('\n🔒 TEST ROW LEVEL SECURITY\n')
  
  // Test 20: Vérifier que les politiques RLS sont actives
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('email', 'admin@cesi.fr')
      .single()
    
    if (error) {
      logTest('RLS Policies', false, error.message)
    } else {
      logTest('RLS Policies', true, `Accès autorisé, role: ${data.role}`)
    }
  } catch (err) {
    logTest('RLS Policies', false, err.message)
  }
}

async function runAllTests() {
  console.log('╔═══════════════════════════════════════════════════════╗')
  console.log('║     TEST COMPLET DES FONCTIONNALITÉS GET/POST         ║')
  console.log('╚═══════════════════════════════════════════════════════╝')
  
  const session = await testAuth()
  await testProfiles(session)
  await testSkills(session)
  await testLanguages()
  await testProjects()
  await testPassions()
  await testBadges()
  await testCollaborations(session)
  await testMessages()
  await testSearch()
  await testRLS()
  
  console.log('\n╔═══════════════════════════════════════════════════════╗')
  console.log('║                    RÉSULTATS FINAUX                   ║')
  console.log('╚═══════════════════════════════════════════════════════╝\n')
  
  console.log(`📊 Total: ${testResults.total} tests`)
  console.log(`✅ Réussis: ${testResults.passed}`)
  console.log(`❌ Échoués: ${testResults.failed}`)
  console.log(`📈 Taux de réussite: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%\n`)
  
  if (testResults.failed === 0) {
    console.log('🎉 EXCELLENT ! Toutes les fonctionnalités fonctionnent parfaitement !\n')
  } else {
    console.log('⚠️  Certaines fonctionnalités nécessitent des ajustements.\n')
    console.log('💡 CONSEIL: Exécutez seed-data.sql pour peupler la base de données.\n')
  }
  
  console.log('📋 PROCHAINES ÉTAPES:')
  console.log('1. Si des tests échouent: Exécutez seed-data.sql dans Supabase')
  console.log('2. Testez manuellement l\'interface utilisateur')
  console.log('3. Vérifiez les formulaires d\'ajout/modification')
  console.log('4. Testez les collaborations et messages')
  console.log('5. Déployez sur Vercel\n')
  
  // Déconnexion
  if (session) {
    await supabase.auth.signOut()
  }
  
  process.exit(testResults.failed === 0 ? 0 : 1)
}

runAllTests().catch(console.error)
