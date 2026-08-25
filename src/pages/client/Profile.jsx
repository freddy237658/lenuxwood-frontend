import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const schema = z.object({
  name: z.string().min(2, 'Votre nom est requis'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().min(8, 'Numéro de téléphone invalide').optional().or(z.literal('')),
})

export default function ClientProfile() {
  const { user, updateProfile } = useAuth()
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name || '', email: user?.email || '', phone: user?.phone || '' },
  })

  const onSubmit = async (data) => {
    setSaved(false)
    await updateProfile(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-wood-950 mb-1">Profil</h2>
      <p className="text-wood-500 text-sm mb-6">Modifiez vos informations personnelles.</p>

      <div className="bg-white border border-wood-700/10 rounded-2xl p-6 md:p-8 max-w-xl">
        {saved && (
          <p className="mb-5 text-sm text-green-700 bg-green-700/10 border border-green-700/20 rounded-full px-4 py-2.5 flex items-center gap-2">
            <CheckCircle2 size={16} /> Vos informations ont été mises à jour.
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-wood-800 mb-1.5 block">Nom complet</label>
            <input
              type="text"
              className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
              {...register('name')}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-wood-800 mb-1.5 block">Adresse email</label>
            <input
              type="email"
              className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-wood-800 mb-1.5 block">Téléphone</label>
            <input
              type="text"
              placeholder="+237 6XX XXX XXX"
              className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
              {...register('phone')}
            />
            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
          </div>

          <div className="border-t border-wood-700/10 pt-5">
            <label className="text-sm font-medium text-wood-800 mb-1.5 block">Nouveau mot de passe (optionnel)</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
            />
            <p className="text-xs text-wood-400 mt-1.5">Laissez vide pour conserver votre mot de passe actuel.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary px-8 py-3 rounded-full font-semibold disabled:opacity-60"
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  )
}
