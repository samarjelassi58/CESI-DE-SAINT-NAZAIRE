import { Award } from 'lucide-react'
import Badge from '@/components/ui/Badge'

export default function TalentCard({ talent }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {talent.full_name?.charAt(0) || '?'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <span>{talent.full_name || 'Utilisateur'}</span>
              {talent.is_verified && <Award className="w-5 h-5 text-blue-600" />}
            </h3>
            <p className="text-sm text-gray-500">{talent.location || 'Non spécifié'}</p>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-1">
          {talent.is_available && <Badge variant="success">Disponible</Badge>}
          {talent.is_verified && <Badge variant="verified">Vérifié</Badge>}
        </div>
      </div>

      {talent.bio && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{talent.bio}</p>}

      {/* Skills */}
      {talent.skills && talent.skills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Compétences</h4>
          <div className="flex flex-wrap gap-2">
            {talent.skills.slice(0, 5).map(skill => (
              <Badge key={skill.id} variant="info">
                {skill.name}
              </Badge>
            ))}
            {talent.skills.length > 5 && (
              <Badge variant="default">+{talent.skills.length - 5}</Badge>
            )}
          </div>
        </div>
      )}

      {/* Languages */}
      {talent.languages && talent.languages.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Langues</h4>
          <div className="flex flex-wrap gap-2">
            {talent.languages.slice(0, 3).map(lang => (
              <Badge key={lang.id} variant="default">
                {lang.name} ({lang.proficiency})
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
