import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRef, useState } from 'react'
import { UploadCloud, CheckCircle2, Loader2, FileCheck } from 'lucide-react'
import ModuleIcon from '../components/ui/ModuleIcon'
import { useCategories, categoryName } from '../hooks/useCategories'
import { useTranslation } from 'react-i18next'
import api from '../lib/api'

const schema = z.object({
  category_id: z.string().min(1, 'Choisissez un module'),
  description: z.string().min(10, 'Décrivez votre besoin (10 caractères minimum)'),
  dimensions: z.string().optional(),
  budget: z.string().optional(),
  name: z.string().min(2, 'Votre nom est requis'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  city: z.string().min(2, 'Ville requise'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
})

export default function Devis() {
  const { i18n } = useTranslation()
  const { categories } = useCategories()
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [attachment, setAttachment] = useState(null)
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setSubmitError('')

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value)
    })
    if (attachment) {
      formData.append('attachment', attachment)
    }

    try {
      await api.post('/quotes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSubmitted(true)
    } catch {
      setSubmitError("Une erreur est survenue lors de l'envoi. Vérifiez vos informations et réessayez.")
    }
  }

  if (submitted) {
    return (
      <section className="bg-cream-50 py-24">
        <div className="max-w-lg mx-auto px-5 text-center">
          <CheckCircle2 className="mx-auto text-red-600 mb-5" size={48} />
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950 mb-3">
            Votre demande a bien été envoyée
          </h1>
          <p className="text-wood-600">
            Notre équipe vous recontactera sous 48h avec un devis détaillé.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-cream-50 py-14 md:py-20">
      <div className="max-w-5xl mx-auto px-5 md:px-10">
        <div className="mb-10">
          <p className="text-xs text-wood-500 mb-2">Accueil / Demande de devis</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-wood-950">Décrivez votre projet</h1>
          <p className="text-wood-500 mt-2">Réponse sous 48h, partout au Cameroun.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-wood-700/10 rounded-sm p-6 md:p-10">
          <p className="font-display font-semibold text-xl text-wood-950 mb-6">1. Quel module vous intéresse ?</p>
          <Controller
            name="category_id"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
                {categories.map((cat) => (
                  <label
                    key={cat.slug}
                    className={`border rounded-sm p-4 text-center cursor-pointer transition flex flex-col items-center gap-2 ${
                      field.value === String(cat.id) ? 'border-red-600 bg-red-600/5' : 'border-wood-700/20 hover:border-red-600'
                    }`}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      checked={field.value === String(cat.id)}
                      onChange={() => field.onChange(String(cat.id))}
                    />
                    <div className="w-8 h-8 flex items-center justify-center text-wood-700">
                      <ModuleIcon name={cat.icon} size={28} />
                    </div>
                    <span className="text-xs font-medium text-wood-800">{categoryName(cat, i18n.language)}</span>
                  </label>
                ))}
              </div>
            )}
          />
          {errors.category_id && <p className="text-xs text-red-600 mb-6">{errors.category_id.message}</p>}

          <p className="font-display font-semibold text-xl text-wood-950 mb-6 mt-10">2. Détails du projet</p>
          <div className="grid md:grid-cols-2 gap-5 mb-10">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-wood-800 mb-1.5 block">Décrivez votre besoin</label>
              <textarea
                rows={4}
                placeholder="Ex: cuisine en L de 4m, finition claire, budget indicatif..."
                className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-wood-800 mb-1.5 block">Dimensions approximatives</label>
              <input
                type="text"
                placeholder="Ex: 4m x 3m"
                className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                {...register('dimensions')}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-wood-800 mb-1.5 block">Budget indicatif (FCFA)</label>
              <input
                type="text"
                placeholder="Ex: 300 000 - 500 000"
                className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                {...register('budget')}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-wood-800 mb-1.5 block">Photo ou plan (optionnel)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => setAttachment(e.target.files?.[0] || null)}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-wood-700/25 rounded-sm py-8 text-center text-sm text-wood-500 cursor-pointer hover:border-red-600 transition"
              >
                {attachment ? (
                  <>
                    <FileCheck className="mx-auto mb-2 text-red-600" size={28} />
                    {attachment.name}
                  </>
                ) : (
                  <>
                    <UploadCloud className="mx-auto mb-2 text-wood-400" size={28} />
                    Cliquez pour choisir un fichier (JPG, PNG ou PDF, 5 Mo max)
                  </>
                )}
              </div>
            </div>
          </div>

          <p className="font-display font-semibold text-xl text-wood-950 mb-6">3. Vos coordonnées</p>
          <div className="grid md:grid-cols-2 gap-5 mb-10">
            <div>
              <label className="text-sm font-medium text-wood-800 mb-1.5 block">Nom complet</label>
              <input
                type="text"
                placeholder="Votre nom"
                className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                {...register('name')}
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
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
            <div>
              <label className="text-sm font-medium text-wood-800 mb-1.5 block">Ville</label>
              <input
                type="text"
                placeholder="Douala, Yaoundé..."
                className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                {...register('city')}
              />
              {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-wood-800 mb-1.5 block">Email (optionnel)</label>
              <input
                type="email"
                placeholder="vous@email.com"
                className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>
          </div>

          {submitError && <p className="text-sm text-red-600 mb-4">{submitError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full md:w-auto px-10 py-4 rounded-sm font-semibold disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande de devis'}
          </button>
        </form>
      </div>
    </section>
  )
}