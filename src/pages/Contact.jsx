import { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Clock, CheckCircle2, Loader2, ExternalLink, UserCheck } from 'lucide-react'
import api from '../lib/api'
import { ATELIER_ADDRESS, MAP_EMBED_SRC, MAP_DIRECT_URL } from '../lib/location'
import { useAuth } from '../context/AuthContext'
import SocialLinks from '../components/ui/SocialLinks'

export default function Contact() {
  const { user, isAuthenticated } = useAuth()
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: "Demande d'information", message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  // Pré-remplir les coordonnées si l'utilisateur est connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }))
    }
  }, [isAuthenticated, user])

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      await api.post('/contact', form)
      setSent(true)
    } catch (err) {
      const msg = err?.response?.data?.message
      setError(
        msg
          ? `Erreur : ${msg}`
          : err?.response?.status
          ? `Erreur serveur (${err.response.status}). Réessayez dans un instant.`
          : "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez."
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="bg-cream-50 py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <div className="mb-10">
          <p className="text-xs text-wood-500 mb-2">Accueil / Contact</p>
          <h1 className="font-display text-3xl md:text-5xl font-semibold text-wood-950">Parlons de votre projet</h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 bg-white border border-wood-700/10 rounded-sm p-6 md:p-8">
            {sent ? (
              <div className="text-center py-10">
                <CheckCircle2 className="mx-auto text-red-600 mb-4" size={40} />
                <p className="font-display text-xl font-semibold text-wood-950 mb-2">Message envoyé</p>
                <p className="text-wood-500 text-sm">Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-5 mb-5">

                  {isAuthenticated && user && (
                    <div className="sm:col-span-2 flex items-center gap-2 text-sm text-wood-700 bg-wood-950/5 border border-wood-700/15 rounded-sm px-4 py-2.5">
                      <UserCheck size={16} className="text-red-600 shrink-0" />
                      <span>Connecté en tant que <strong>{user.name}</strong> — vos coordonnées ont été pré-remplies.</span>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-wood-800 mb-1.5 block">Nom complet</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={update('name')}
                      placeholder="Votre nom"
                      className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-wood-800 mb-1.5 block">Téléphone</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={update('phone')}
                      placeholder="+237 6XX XXX XXX"
                      className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">Email (optionnel)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="vous@email.com"
                    className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div className="mb-5">
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">Sujet</label>
                  <select
                    value={form.subject}
                    onChange={update('subject')}
                    className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm text-wood-700 bg-white focus:outline-none focus:border-red-600"
                  >
                    <option>Demande d'information</option>
                    <option>Suivi de commande</option>
                    <option>Partenariat professionnel</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary px-8 py-3.5 rounded-sm font-semibold disabled:opacity-60 inline-flex items-center gap-2"
                >
                  {sending && <Loader2 size={16} className="animate-spin" />}
                  {sending ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-wood-950 rounded-sm p-6">
              <p className="text-xs font-bold tracking-[0.2em] text-oak-400 mb-4">NOS COORDONNÉES</p>
              <div className="space-y-4 text-sm text-wood-300">
                <div className="flex gap-3">
                  <MapPin size={18} className="text-oak-400 shrink-0 mt-0.5" />
                  <a
                    href={MAP_DIRECT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-oak-400 transition"
                  >
                    {ATELIER_ADDRESS}
                  </a>
                </div>
                <div className="flex gap-3">
                  <Phone size={18} className="text-oak-400 shrink-0 mt-0.5" />
                  <span>+237 6 97 64 77 99</span>
                </div>
                <div className="flex gap-3">
                  <Mail size={18} className="text-oak-400 shrink-0 mt-0.5" />
                  <span>arthurmouakem35@gmail.com</span>
                </div>
                <div className="flex gap-3">
                  <Clock size={18} className="text-oak-400 shrink-0 mt-0.5" />
                  <span>Lun – Sam, 8h – 18h</span>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-wood-800">
                <p className="text-xs font-bold tracking-[0.2em] text-oak-400 mb-3">SUIVEZ-NOUS</p>
                <SocialLinks variant="dark" />
              </div>
            </div>
            <div className="aspect-[4/3] rounded-sm overflow-hidden border border-wood-700/10 relative group bg-wood-950">
              <iframe
                title="Localisation LenuxWood"
                src={MAP_EMBED_SRC}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={MAP_DIRECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 bg-wood-950/90 hover:bg-red-600 text-cream-50 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md transition flex items-center gap-1.5 backdrop-blur-xs"
              >
                <ExternalLink size={13} /> Ouvrir Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}