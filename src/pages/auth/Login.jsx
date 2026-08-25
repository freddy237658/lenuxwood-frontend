import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo.jpg'

const schema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, '6 caractères minimum'),
})

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setServerError('')
    try {
      const user = await login(data)
      const redirectTo = location.state?.from?.pathname || (user.role === 'admin' ? '/admin' : '/compte')
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setServerError(err.message || 'Une erreur est survenue, veuillez réessayer.')
    }
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
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950">Se connecter</h1>
          <p className="text-wood-500 text-sm mt-2">Accédez à votre espace client ou administrateur.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-wood-700/10 rounded-sm p-6 md:p-8">
          {serverError && (
            <p className="mb-5 text-sm text-red-600 bg-red-600/10 border border-red-600/20 rounded-sm px-4 py-3">
              {serverError}
            </p>
          )}

          <div className="mb-5">
            <label className="text-sm font-medium text-wood-800 mb-1.5 block">Adresse email</label>
            <input
              type="email"
              placeholder="vous@email.com"
              className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-red-600"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div className="mb-2">
            <label className="text-sm font-medium text-wood-800 mb-1.5 block">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full border border-wood-700/20 rounded-sm px-4 py-3 pr-11 text-sm focus:outline-none focus:border-red-600"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 hover:text-wood-700"
                tabIndex={-1}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex justify-end mb-6">
            <Link to="/mot-de-passe-oublie" className="text-xs text-wood-500 hover:text-red-600 transition">
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-3.5 rounded-sm font-semibold disabled:opacity-60"
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>

          <p className="text-xs text-wood-400 text-center mt-4">
            Astuce démo : utilisez un email contenant « admin » pour accéder au panel administrateur.
          </p>
        </form>

        <p className="text-center text-sm text-wood-600 mt-6">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="text-red-600 font-semibold hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </section>
  )
}
