import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from '../ui/WhatsAppButton'
import AssistantButton from '../ui/AssistantButton'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="bg-cream-50 font-sans">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AssistantButton />
      <WhatsAppButton />
    </div>
  )
}
