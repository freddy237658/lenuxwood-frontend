import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import logo from '../../assets/logo.jpg'

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    // TODO: brancher sur POST `${VITE_API_URL}/forgot-password`
    setSent(true)
  }

  return (
    <section className="bg-cream-50 min-h-[80vh] flex items-center py-14">
      <div className="max-w-md w-full mx-auto px-5">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <img src={logo} alt="LenuxWood" className="h-10 w-10 rounded-sm object-cover" />
            <p className="font-display font-semibold text-lg text-wood-950">
              Lenux<span className="text-red-600">Wood</span>
            </p>
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950">Mot de passe oublié</h1>
          <p className="text-wood-500 text-sm mt-2">
            Indiquez votre email, nous vous enverrons un lien de réinitialisation.
          </p>
        </div>

        <div className="bg-white border border-wood-700/10 rounded-sm p-6 md:p-8">
          {sent ? (
            <div className="text-center py-6">
              <CheckCircle2 className="mx-auto text-red-600 mb-4" size={36} />
              <p className="font-display font-semibold text-wood-950 mb-2">Email envoyé</p>
              <p className="text-sm text-wood-500">
                Si un compte existe pour <strong>{email}</strong>, un lien de réinitialisation vient d'être envoyé.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <label className="text-sm font-medium text-wood-800 mb-1.5 block">Adresse email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@email.com"
                className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm mb-6 focus:outline-none focus:border-red-600"
              />
              <button type="submit" className="btn-primary w-full py-3.5 rounded-sm font-semibold">
                Envoyer le lien
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-wood-600 mt-6">
          <Link to="/connexion" className="text-red-600 font-semibold hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </section>
  )
}
