import { useState } from 'react'
import { Send } from 'lucide-react'
import { CLIENT_CONVERSATION } from '../../data/client-messages-mock'

export default function ClientMessages() {
  const [messages, setMessages] = useState(
    CLIENT_CONVERSATION.messages.map((m) => ({ ...m, read: true }))
  )
  const [draft, setDraft] = useState('')

  const sendMessage = (e) => {
    e.preventDefault()
    if (!draft.trim()) return
    // TODO: remplacer par POST `${VITE_API_URL}/me/messages`
    setMessages((prev) => [...prev, { from: 'client', text: draft.trim(), date: "À l'instant", read: true }])
    setDraft('')
  }

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-wood-950 mb-1">Messages</h2>
      <p className="text-wood-500 text-sm mb-6">Échangez directement avec l'équipe LenuxWood.</p>

      <div className="bg-white border border-wood-700/10 rounded-2xl overflow-hidden flex flex-col h-[520px]">
        <div className="px-5 py-4 border-b border-wood-700/10">
          <p className="font-display font-semibold text-wood-950">{CLIENT_CONVERSATION.context}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-cream-50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'client' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.from === 'client'
                    ? 'bg-wood-950 text-cream-100 rounded-br-sm'
                    : 'bg-white border border-wood-700/10 text-wood-800 rounded-bl-sm'
                }`}
              >
                <p>{m.text}</p>
                <p className="text-[10px] mt-1 text-wood-400">{m.date}</p>
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
      </div>
    </div>
  )
}
