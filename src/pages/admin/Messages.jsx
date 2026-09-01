import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, Search, MessageCircle, Loader2 } from 'lucide-react'
import api from '../../lib/api'

export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)

  const loadConversations = () => {
    setLoadingList(true)
    api
      .get('/conversations')
      .then((res) => setConversations(res.data.data ?? []))
      .finally(() => setLoadingList(false))
  }

  useEffect(loadConversations, [])

  // Ouverture directe depuis un bouton "message" sur une autre page admin (?client=ID)
  useEffect(() => {
    const clientId = searchParams.get('client')
    if (!clientId) return
    api.post('/conversations/find-or-create', { user_id: clientId }).then((res) => {
      const conv = res.data.data
      setConversations((prev) => (prev.some((c) => c.id === conv.id) ? prev : [conv, ...prev]))
      setActiveId(conv.id)
    })
  }, [searchParams])

  const openConversation = (id) => {
    setActiveId(id)
    setSearchParams({})
    setLoadingMessages(true)
    api
      .get(`/conversations/${id}/messages`)
      .then((res) => {
        setMessages(res.data.data ?? [])
        setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread_count: 0 } : c)))
      })
      .finally(() => setLoadingMessages(false))
  }

  useEffect(() => {
    if (activeId) openConversation(activeId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!draft.trim() || !activeId) return
    setSending(true)
    try {
      const res = await api.post(`/conversations/${activeId}/messages`, { body: draft.trim() })
      setMessages((prev) => [...prev, res.data.data])
      setDraft('')
    } finally {
      setSending(false)
    }
  }

  const filtered = query.trim()
    ? conversations.filter((c) => c.user.name.toLowerCase().includes(query.toLowerCase()))
    : conversations

  const active = conversations.find((c) => c.id === activeId)

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950 mb-1">Messagerie</h1>
      <p className="text-wood-500 text-sm mb-8">
        Échangez directement avec vos clients au sujet de leurs devis et commandes.
      </p>

      <div className="bg-white border border-wood-700/10 rounded-2xl overflow-hidden flex flex-col md:flex-row h-[600px]">
        <div className="w-full md:w-72 shrink-0 border-b md:border-b-0 md:border-r border-wood-700/10 flex flex-col">
          <div className="p-3 border-b border-wood-700/10">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-wood-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une conversation..."
                className="w-full border border-wood-700/20 rounded-full pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-red-600"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingList ? (
              <div className="flex items-center gap-2 text-wood-500 p-4 text-sm">
                <Loader2 size={15} className="animate-spin" /> Chargement...
              </div>
            ) : (
              <>
                {filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={`w-full text-left px-4 py-3 border-b border-wood-700/10 transition ${
                      activeId === c.id ? 'bg-cream-100' : 'hover:bg-cream-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-wood-900 truncate">{c.user.name}</p>
                      {c.unread_count > 0 && (
                        <span className="w-5 h-5 rounded-full bg-red-600 text-cream-50 text-[10px] font-semibold flex items-center justify-center shrink-0">
                          {c.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-wood-500 truncate mt-0.5">
                      {c.context || c.last_message?.body || 'Aucun message'}
                    </p>
                  </button>
                ))}
                {filtered.length === 0 && <p className="text-sm text-wood-400 text-center py-8">Aucune conversation trouvée.</p>}
              </>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          {active ? (
            <>
              <div className="px-5 py-4 border-b border-wood-700/10">
                <p className="font-display font-semibold text-wood-950">{active.user.name}</p>
                <p className="text-xs text-wood-500">{active.context || active.user.email}</p>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3 bg-cream-50">
                {loadingMessages ? (
                  <div className="flex items-center gap-2 text-wood-500 text-sm">
                    <Loader2 size={15} className="animate-spin" /> Chargement des messages...
                  </div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={`flex ${m.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                          m.from === 'admin'
                            ? 'bg-wood-950 text-cream-100 rounded-br-sm'
                            : 'bg-white border border-wood-700/10 text-wood-800 rounded-bl-sm'
                        }`}
                      >
                        <p>{m.body}</p>
                        <p className="text-[10px] mt-1 text-wood-400">{new Date(m.created_at).toLocaleString('fr-FR')}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t border-wood-700/10 flex items-center gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Écrire un message..."
                  className="flex-1 border border-wood-700/20 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-10 h-10 shrink-0 rounded-full bg-red-600 text-cream-50 flex items-center justify-center hover:bg-red-700 transition disabled:opacity-60"
                  aria-label="Envoyer"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-wood-400 gap-3">
              <MessageCircle size={32} />
              <p className="text-sm">Sélectionnez une conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}