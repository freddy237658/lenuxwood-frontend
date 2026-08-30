import { useEffect, useRef, useState } from 'react'
import { Bot, X, Send, Loader2 } from 'lucide-react'

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Bonjour 👋 Je suis l'assistant LenuxWood. Posez-moi vos questions sur nos produits, nos délais ou notre processus de devis.",
}

export default function AssistantButton() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  const sendMessage = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // On n'envoie pas le message de bienvenue, l'API attend uniquement user/assistant réels
          messages: nextMessages.filter((m) => m !== WELCOME_MESSAGE),
        }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Connexion impossible pour le moment, réessayez dans un instant." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Positionné au-dessus du bouton WhatsApp (bottom-6) pour ne pas se superposer */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Ouvrir l'assistant LenuxWood"
        className="fixed bottom-24 right-6 z-50 group"
      >
        <span className="absolute inset-0 rounded-full bg-wood-950 animate-ping opacity-40" />
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-wood-950 shadow-lg shadow-black/20 transition-transform duration-300 group-hover:scale-110">
          {open ? <X size={22} className="text-cream-100" /> : <Bot size={24} className="text-oak-400" />}
        </span>
      </button>

      {open && (
        <div className="fixed bottom-[168px] right-6 z-50 w-[90vw] max-w-sm h-[480px] bg-white rounded-2xl shadow-2xl border border-wood-700/10 flex flex-col overflow-hidden">
          <div className="bg-wood-950 px-5 py-4 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-oak-500 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-wood-950" />
            </div>
            <div>
              <p className="font-display font-semibold text-cream-100 text-sm">Assistant LenuxWood</p>
              <p className="text-[11px] text-wood-400">Répond instantanément</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === 'user'
                      ? 'bg-wood-950 text-cream-100 rounded-br-sm'
                      : 'bg-white border border-wood-700/10 text-wood-800 rounded-bl-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-wood-700/10 rounded-2xl rounded-bl-sm px-4 py-2.5">
                  <Loader2 size={14} className="animate-spin text-wood-400" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="p-3 border-t border-wood-700/10 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez votre question..."
              className="flex-1 border border-wood-700/20 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-10 h-10 shrink-0 rounded-full bg-red-600 text-cream-50 flex items-center justify-center hover:bg-red-700 transition disabled:opacity-50"
              aria-label="Envoyer"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}