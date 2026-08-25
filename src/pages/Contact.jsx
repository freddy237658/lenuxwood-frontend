import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: brancher sur l'API Laravel (POST /api/contact)
    setSent(true)
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
                  <div>
                    <label className="text-sm font-medium text-wood-800 mb-1.5 block">Nom complet</label>
                    <input
                      required
                      type="text"
                      placeholder="Votre nom"
                      className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-wood-800 mb-1.5 block">Téléphone</label>
                    <input
                      required
                      type="text"
                      placeholder="+237 6XX XXX XXX"
                      className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">Sujet</label>
                  <select className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm text-wood-700 bg-white focus:outline-none focus:border-red-600">
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
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <button type="submit" className="btn-primary px-8 py-3.5 rounded-sm font-semibold">
                  Envoyer le message
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
                  <span>Zone industrielle, Douala &amp; Yaoundé, Cameroun</span>
                </div>
                <div className="flex gap-3">
                  <Phone size={18} className="text-oak-400 shrink-0 mt-0.5" />
                  <span>+237 6XX XXX XXX</span>
                </div>
                <div className="flex gap-3">
                  <Mail size={18} className="text-oak-400 shrink-0 mt-0.5" />
                  <span>contact@lenuxwood.com</span>
                </div>
                <div className="flex gap-3">
                  <Clock size={18} className="text-oak-400 shrink-0 mt-0.5" />
                  <span>Lun – Sam, 8h – 18h</span>
                </div>
              </div>
            </div>
            <div className="aspect-[4/3] rounded-sm bg-wood-700 grain-bg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-cream-100/70 text-sm">
                Carte interactive (Google Maps)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
