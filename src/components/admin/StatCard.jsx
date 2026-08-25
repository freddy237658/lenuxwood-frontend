export default function StatCard({ icon: Icon, label, value, tone = 'dark' }) {
  const badgeClass = tone === 'red' ? 'bg-red-600 text-cream-50' : 'bg-wood-950 text-oak-400'

  return (
    <div className="bg-white border border-wood-700/10 rounded-2xl p-5 flex items-center gap-4 card-lift">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${badgeClass}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="font-display text-2xl font-semibold text-wood-950 truncate">{value}</p>
        <p className="text-xs text-wood-500 mt-0.5 truncate">{label}</p>
      </div>
    </div>
  )
}
