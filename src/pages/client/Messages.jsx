import { useEffect, useRef, useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import api from '../../lib/api'

export default function ClientMessages() {
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    let conv = null
    api
      .get('/me/conversation')
      .then((res) => {
        conv = res.data.data
        setConversation(conv)
        return api.get(`/conversations/${conv.id}/messages`)
      })
      .then((res) => {
        setMessages(res.data.data ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!draft.trim() || !conversation) return
    setSending(true)
    try {
      const res = await api.post(`/conversations/${conversation.id}/messages`, { body: draft.trim() })
      setMessages((prev) => [...prev, res.data.data])
      setDraft('')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-wood-950 mb-1">Messages</h2>
      <p className="text-wood-500 text-sm mb-6">Échangez directement avec l'équipe LenuxWood.</p>

      <div className="bg-white border border-wood-700/10 rounded-2xl overflow-hidden flex flex-col h-[calc(100dvh-220px)] min-h-[440px] md:h-[550px] shadow-xs">
        <div className="px-5 py-4 border-b border-wood-700/10 shrink-0">
          <p className="font-display font-semibold text-wood-950">Support LenuxWood</p>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-cream-50">
          {loading ? (
            <div className="flex items-center gap-2 text-wood-500 text-sm">
              <Loader2 size={15} className="animate-spin" /> Chargement...
            </div>
          ) : messages.length === 0 ? (
            <p className="text-sm text-wood-400 text-center py-8">
              Aucun message pour l'instant. Écrivez-nous si vous avez une question !
            </p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'client' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.from === 'client'
                      ? 'bg-wood-950 text-cream-100 rounded-br-sm'
                      : 'bg-white border border-wood-700/10 text-wood-800 rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  <p className="text-[10px] mt-1 text-wood-400 text-right">{new Date(m.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={sendMessage} className="p-3 sm:p-4 bg-white border-t border-wood-700/10 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Écrire un message..."
            className="flex-1 border border-wood-700/20 rounded-full px-4 py-2 sm:py-2.5 text-sm focus:outline-none focus:border-red-600"
          />
          <button
            type="submit"
            disabled={sending || !draft.trim()}
            className="w-10 h-10 shrink-0 rounded-full bg-red-600 text-cream-50 flex items-center justify-center hover:bg-red-700 transition disabled:opacity-50"
            aria-label="Envoyer"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}