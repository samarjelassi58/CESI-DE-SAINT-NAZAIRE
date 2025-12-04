'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Mail, Lock } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function LoginForm({ onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) throw error

      toast.success('Connexion réussie !')
      if (onSuccess) onSuccess(data)
    } catch (error) {
      toast.error(error.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        type="email"
        label="Email"
        icon={Mail}
        required
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
        placeholder="jean.dupont@example.com"
      />

      <Input
        type="password"
        label="Mot de passe"
        icon={Lock}
        required
        value={formData.password}
        onChange={e => setFormData({ ...formData, password: e.target.value })}
        placeholder="••••••••"
      />

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </Button>
    </form>
  )
}
