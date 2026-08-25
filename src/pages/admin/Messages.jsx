import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, Search, MessageCircle } from 'lucide-react'
import { CONVERSATIONS as INITIAL_CONVERSATIONS } from '../../data/messages-mock'

export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')

  const preselect = searchParams.get('client')
  const [activeId, setActiveId] = useState(preselect || INITIAL_CONVERSATIONS[0]?.id)

  // Si on arrive depuis un bouton "message" sur une autre page (?client=xxx),
  // on ouvre directement la bonne conversation.
  useEffect(() => {
    if (preselect) setActiveId(preselect)
  }, [preselect])

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations
    const q = query.toLowerCase()
    return conversations.filter((c) => c.name.toLowerCase().includes(q) || c.context.toLowerCase().includes(q))
  }, [conversations, query])

  const active = conversations.find((c) => c.id === activeId) || conversations[0]

  const selectConversation = (id) => {
    setActiveId(id)
    setSearchParams({ client: id })
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)))
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!draft.trim() || !active) return
    // TODO: remplacer par POST `${VITE_API_URL}/conversations/${active.id}/messages`
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? { ...c, messages: [...c.messages, { from: 'admin', text: draft.trim(), date: "À l'instant" }] }
          : c
      )
    )
    setDraft('')
  }

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
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => selectConversation(c.id)}
                className={`w-full text-left px-4 py-3 border-b border-wood-700/10 transition ${
                  active?.id === c.id ? 'bg-cream-100' : 'hover:bg-cream-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-wood-900 truncate">{c.name}</p>
                  {c.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-red-600 text-cream-50 text-[10px] font-semibold flex items-center justify-center shrink-0">
                      {c.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-wood-500 truncate mt-0.5">{c.context}</p>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-wood-400 text-center py-8">Aucune conversation trouvée.</p>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          {active ? (
            <>
              <div className="px-5 py-4 border-b border-wood-700/10">
                <p className="font-display font-semibold text-wood-950">{active.name}</p>
                <p className="text-xs text-wood-500">{active.context}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-cream-50">
                {active.messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.from === 'admin'
                          ? 'bg-wood-950 text-cream-100 rounded-br-sm'
                          : 'bg-white border border-wood-700/10 text-wood-800 rounded-bl-sm'
                      }`}
                    >
                      <p>{m.text}</p>
                      <p className={`text-[10px] mt-1 ${m.from === 'admin' ? 'text-wood-400' : 'text-wood-400'}`}>{m.date}</p>
                    </div>
                  </div>
                ))}
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
                  className="w-10 h-10 shrink-0 rounded-full bg-red-600 text-cream-50 flex items-center justify-center hover:bg-red-700 transition"
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
