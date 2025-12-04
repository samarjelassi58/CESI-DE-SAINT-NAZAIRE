'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import {
  User,
  Mail,
  MapPin,
  Phone,
  Linkedin,
  Github,
  Globe,
  Plus,
  X,
  Save,
  ArrowLeft,
  Award,
  Languages,
  Briefcase,
  Heart
} from 'lucide-react'
import Link from 'next/link'

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState(null)

  // Profile data
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    location: '',
    phone: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    is_available: true
  })

  // Skills
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'technique',
    level: 'intermediaire',
    years_experience: 0
  })

  // Languages
  const [languages, setLanguages] = useState([])
  const [newLanguage, setNewLanguage] = useState({
    name: '',
    proficiency: 'B2'
  })

  // Projects
  const [projects, setProjects] = useState([])
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    url: '',
    github_url: '',
    start_date: '',
    end_date: '',
    is_current: false
  })

  // Passions
  const [passions, setPassions] = useState([])
  const [newPassion, setNewPassion] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUserId(user.id)

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) setProfile(profileData)

      // Load skills
      const { data: skillsData } = await supabase.from('skills').select('*').eq('user_id', user.id)
      if (skillsData) setSkills(skillsData)

      // Load languages
      const { data: languagesData } = await supabase
        .from('languages')
        .select('*')
        .eq('user_id', user.id)
      if (languagesData) setLanguages(languagesData)

      // Load projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
      if (projectsData) setProjects(projectsData)

      // Load passions
      const { data: passionsData } = await supabase
        .from('passions')
        .select('*')
        .eq('user_id', user.id)
      if (passionsData) setPassions(passionsData)
    } catch (error) {
      toast.error('Impossible de charger votre profil. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const { error } = await supabase.from('profiles').update(profile).eq('id', userId)

      if (error) throw error
      toast.success('Profil mis à jour avec succès !')
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const addSkill = async () => {
    if (!newSkill.name) {
      toast.error('Veuillez saisir un nom de compétence')
      return
    }

    try {
      const { data, error } = await supabase
        .from('skills')
        .insert([{ ...newSkill, user_id: userId }])
        .select()

      if (error) throw error
      setSkills([...skills, data[0]])
      setNewSkill({ name: '', category: 'technique', level: 'intermediaire', years_experience: 0 })
      toast.success('Compétence ajoutée !')
    } catch (error) {
      toast.error("Erreur lors de l'ajout")
    }
  }

  const deleteSkill = async id => {
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id)

      if (error) throw error
      setSkills(skills.filter(s => s.id !== id))
      toast.success('Compétence supprimée')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const addLanguage = async () => {
    if (!newLanguage.name) {
      toast.error('Veuillez saisir une langue')
      return
    }

    try {
      const { data, error } = await supabase
        .from('languages')
        .insert([{ ...newLanguage, user_id: userId }])
        .select()

      if (error) throw error
      setLanguages([...languages, data[0]])
      setNewLanguage({ name: '', proficiency: 'B2' })
      toast.success('Langue ajoutée !')
    } catch (error) {
      toast.error("Erreur lors de l'ajout")
    }
  }

  const deleteLanguage = async id => {
    try {
      const { error } = await supabase.from('languages').delete().eq('id', id)

      if (error) throw error
      setLanguages(languages.filter(l => l.id !== id))
      toast.success('Langue supprimée')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const addProject = async () => {
    if (!newProject.title) {
      toast.error('Veuillez saisir un titre de projet')
      return
    }

    try {
      const projectData = {
        ...newProject,
        user_id: userId,
        technologies: newProject.technologies
          ? newProject.technologies.split(',').map(t => t.trim())
          : []
      }

      const { data, error } = await supabase.from('projects').insert([projectData]).select()

      if (error) throw error
      setProjects([...projects, data[0]])
      setNewProject({
        title: '',
        description: '',
        technologies: '',
        url: '',
        github_url: '',
        start_date: '',
        end_date: '',
        is_current: false
      })
      toast.success('Projet ajouté !')
    } catch (error) {
      toast.error("Erreur lors de l'ajout")
    }
  }

  const deleteProject = async id => {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)

      if (error) throw error
      setProjects(projects.filter(p => p.id !== id))
      toast.success('Projet supprimé')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const addPassion = async () => {
    if (!newPassion.name) {
      toast.error('Veuillez saisir une passion')
      return
    }

    try {
      const { data, error } = await supabase
        .from('passions')
        .insert([{ ...newPassion, user_id: userId }])
        .select()

      if (error) throw error
      setPassions([...passions, data[0]])
      setNewPassion({ name: '', description: '' })
      toast.success('Passion ajoutée !')
    } catch (error) {
      toast.error("Erreur lors de l'ajout")
    }
  }

  const deletePassion = async id => {
    try {
      const { error } = await supabase.from('passions').delete().eq('id', id)

      if (error) throw error
      setPassions(passions.filter(p => p.id !== id))
      toast.success('Passion supprimée')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm mb-8">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour au dashboard</span>
            </Link>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <User className="w-6 h-6" />
            <span>Informations personnelles</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
              <input
                type="text"
                value={profile.full_name || ''}
                onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Localisation
              </label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={e => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Paris, France"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Téléphone
              </label>
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Linkedin className="w-4 h-4 inline mr-1" />
                LinkedIn
              </label>
              <input
                type="url"
                value={profile.linkedin_url || ''}
                onChange={e => setProfile({ ...profile, linkedin_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Github className="w-4 h-4 inline mr-1" />
                GitHub
              </label>
              <input
                type="url"
                value={profile.github_url || ''}
                onChange={e => setProfile({ ...profile, github_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Portfolio
              </label>
              <input
                type="url"
                value={profile.portfolio_url || ''}
                onChange={e => setProfile({ ...profile, portfolio_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://monportfolio.com"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={profile.bio || ''}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Parlez-nous de vous..."
            />
          </div>

          <div className="mt-6 flex items-center">
            <input
              type="checkbox"
              id="available"
              checked={profile.is_available}
              onChange={e => setProfile({ ...profile, is_available: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="available" className="ml-2 text-sm text-gray-700">
              Disponible pour des collaborations
            </label>
          </div>
        </div>

        {/* Skills Section */}
        <div id="skills" className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Award className="w-6 h-6" />
            <span>Compétences</span>
          </h2>

          {/* Add Skill Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                value={newSkill.name}
                onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de la compétence"
              />
              <select
                value={newSkill.category}
                onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="technique">Technique</option>
                <option value="linguistique">Linguistique</option>
                <option value="soft-skill">Soft Skill</option>
                <option value="autre">Autre</option>
              </select>
              <select
                value={newSkill.level}
                onChange={e => setNewSkill({ ...newSkill, level: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="debutant">Débutant</option>
                <option value="intermediaire">Intermédiaire</option>
                <option value="avance">Avancé</option>
                <option value="expert">Expert</option>
              </select>
              <input
                type="number"
                min="0"
                value={newSkill.years_experience}
                onChange={e =>
                  setNewSkill({ ...newSkill, years_experience: parseInt(e.target.value) || 0 })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Années d'exp."
              />
            </div>
            <button
              onClick={addSkill}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une compétence</span>
            </button>
          </div>

          {/* Skills List */}
          <div className="space-y-3">
            {skills.map(skill => (
              <div
                key={skill.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-gray-900">{skill.name}</span>
                    <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                      {skill.category}
                    </span>
                    <span className="text-sm text-gray-600 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {skill.level}
                    </span>
                    {skill.years_experience > 0 && (
                      <span className="text-sm text-gray-600">
                        {skill.years_experience} an{skill.years_experience > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteSkill(skill.id)}
                  className="text-red-600 hover:text-red-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            {skills.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucune compétence ajoutée</p>
            )}
          </div>
        </div>

        {/* Languages Section */}
        <div id="languages" className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Languages className="w-6 h-6" />
            <span>Langues</span>
          </h2>

          {/* Add Language Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                value={newLanguage.name}
                onChange={e => setNewLanguage({ ...newLanguage, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Langue"
              />
              <select
                value={newLanguage.proficiency}
                onChange={e => setNewLanguage({ ...newLanguage, proficiency: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="A1">A1 - Débutant</option>
                <option value="A2">A2 - Élémentaire</option>
                <option value="B1">B1 - Intermédiaire</option>
                <option value="B2">B2 - Intermédiaire avancé</option>
                <option value="C1">C1 - Avancé</option>
                <option value="C2">C2 - Maîtrise</option>
                <option value="natif">Natif</option>
              </select>
              <button
                onClick={addLanguage}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          {/* Languages List */}
          <div className="space-y-3">
            {languages.map(lang => (
              <div
                key={lang.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">{lang.name}</span>
                  <span className="text-sm text-gray-600 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {lang.proficiency}
                  </span>
                </div>
                <button
                  onClick={() => deleteLanguage(lang.id)}
                  className="text-red-600 hover:text-red-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            {languages.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucune langue ajoutée</p>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div id="projects" className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Briefcase className="w-6 h-6" />
            <span>Projets</span>
          </h2>

          {/* Add Project Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-4">
              <input
                type="text"
                value={newProject.title}
                onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Titre du projet"
              />
              <textarea
                value={newProject.description}
                onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Description"
              />
              <input
                type="text"
                value={newProject.technologies}
                onChange={e => setNewProject({ ...newProject, technologies: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Technologies (séparées par des virgules)"
              />
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="url"
                  value={newProject.url}
                  onChange={e => setNewProject({ ...newProject, url: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="URL du projet"
                />
                <input
                  type="url"
                  value={newProject.github_url}
                  onChange={e => setNewProject({ ...newProject, github_url: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="URL GitHub"
                />
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="date"
                  value={newProject.start_date}
                  onChange={e => setNewProject({ ...newProject, start_date: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-600">à</span>
                <input
                  type="date"
                  value={newProject.end_date}
                  onChange={e => setNewProject({ ...newProject, end_date: e.target.value })}
                  disabled={newProject.is_current}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newProject.is_current}
                    onChange={e => setNewProject({ ...newProject, is_current: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Projet en cours</span>
                </label>
              </div>
              <button
                onClick={addProject}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter le projet</span>
              </button>
            </div>
          </div>

          {/* Projects List */}
          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{project.title}</h3>
                    <p className="text-gray-600 mt-1">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600"
                        >
                          🔗 Voir le projet
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600"
                        >
                          <Github className="w-4 h-4 inline" /> GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-red-600 hover:text-red-700 transition ml-4"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucun projet ajouté</p>
            )}
          </div>
        </div>

        {/* Passions Section */}
        <div id="passions" className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Heart className="w-6 h-6" />
            <span>Passions & Centres d'intérêt</span>
          </h2>

          {/* Add Passion Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-4">
              <input
                type="text"
                value={newPassion.name}
                onChange={e => setNewPassion({ ...newPassion, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de la passion"
              />
              <textarea
                value={newPassion.description}
                onChange={e => setNewPassion({ ...newPassion, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Description (optionnel)"
              />
              <button
                onClick={addPassion}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une passion</span>
              </button>
            </div>
          </div>

          {/* Passions List */}
          <div className="space-y-3">
            {passions.map(passion => (
              <div
                key={passion.id}
                className="flex items-start justify-between bg-gray-50 rounded-lg p-4"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{passion.name}</h3>
                  {passion.description && (
                    <p className="text-gray-600 text-sm mt-1">{passion.description}</p>
                  )}
                </div>
                <button
                  onClick={() => deletePassion(passion.id)}
                  className="text-red-600 hover:text-red-700 transition ml-4"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            {passions.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucune passion ajoutée</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>
              {saving ? 'Sauvegarde en cours...' : 'Sauvegarder toutes les modifications'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
