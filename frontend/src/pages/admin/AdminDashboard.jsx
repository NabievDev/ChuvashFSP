import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Newspaper, Calendar, FileText, Users, Crown, MessageSquare,
  TrendingUp, ArrowRight, Clock
} from 'lucide-react'
import { newsAPI, eventsAPI, teamAPI, leadershipAPI, contactAPI } from '../../utils/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    news: 0,
    events: 0,
    team: 0,
    leadership: 0,
    messages: 0,
    unreadMessages: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [newsRes, eventsRes, teamRes, leadershipRes, messagesRes] = await Promise.all([
        newsAPI.getAll({ limit: 1000, include_hidden: true }),
        eventsAPI.getAll({ limit: 1000, include_hidden: true }),
        teamAPI.getAll({ include_hidden: true }),
        leadershipAPI.getAll({ include_hidden: true }),
        contactAPI.getAll({ limit: 1000 })
      ])

      setStats({
        news: newsRes.data.length,
        events: eventsRes.data.length,
        team: teamRes.data.length,
        leadership: leadershipRes.data.length,
        messages: messagesRes.data.length,
        unreadMessages: messagesRes.data.filter(m => !m.is_read).length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    { name: 'Новости', value: stats.news, icon: Newspaper, href: '/admin/news', color: 'from-blue-500 to-cyan-500' },
    { name: 'Мероприятия', value: stats.events, icon: Calendar, href: '/admin/events', color: 'from-primary-500 to-accent-yellow' },
    { name: 'Сборная', value: stats.team, icon: Users, href: '/admin/team', color: 'from-green-500 to-emerald-500' },
    { name: 'Руководство', value: stats.leadership, icon: Crown, href: '/admin/leadership', color: 'from-purple-500 to-pink-500' },
    {
      name: 'Сообщения',
      value: stats.messages,
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : null,
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'from-rose-500 to-red-500'
    },
    { name: 'Документы', value: '-', icon: FileText, href: '/admin/documents', color: 'from-amber-500 to-orange-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
          Панель управления
        </h1>
        <p className="text-dark-600 dark:text-dark-400">
          Добро пожаловать в админ-панель ФСП Чувашии
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cards.map((card, index) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={card.href}
                  className="block card-hover p-6 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    {card.badge && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-dark-900 dark:text-white">
                        {card.value}
                      </p>
                      <p className="text-dark-500 dark:text-dark-400">
                        {card.name}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-dark-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                Быстрые действия
              </h2>
              <div className="space-y-3">
                <Link
                  to="/admin/news"
                  className="flex items-center justify-between p-4 rounded-xl bg-dark-50 dark:bg-dark-800/50 hover:bg-primary-500/10 transition-colors group"
                >
                  <span className="text-dark-700 dark:text-dark-300">Добавить новость</span>
                  <ArrowRight className="w-5 h-5 text-dark-400 group-hover:text-primary-500 transition-colors" />
                </Link>
                <Link
                  to="/admin/events"
                  className="flex items-center justify-between p-4 rounded-xl bg-dark-50 dark:bg-dark-800/50 hover:bg-primary-500/10 transition-colors group"
                >
                  <span className="text-dark-700 dark:text-dark-300">Создать мероприятие</span>
                  <ArrowRight className="w-5 h-5 text-dark-400 group-hover:text-primary-500 transition-colors" />
                </Link>
                <Link
                  to="/admin/documents"
                  className="flex items-center justify-between p-4 rounded-xl bg-dark-50 dark:bg-dark-800/50 hover:bg-primary-500/10 transition-colors group"
                >
                  <span className="text-dark-700 dark:text-dark-300">Загрузить документ</span>
                  <ArrowRight className="w-5 h-5 text-dark-400 group-hover:text-primary-500 transition-colors" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                Информация
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                  <p className="text-sm text-dark-600 dark:text-dark-400 mb-1">
                    Telegram-канал
                  </p>
                  <a
                    href="https://t.me/fspchuv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                  >
                    @fspchuv
                  </a>
                </div>
                <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800/50">
                  <p className="text-sm text-dark-600 dark:text-dark-400 mb-1">
                    Email для связи
                  </p>
                  <p className="text-dark-900 dark:text-white font-medium">
                    chuvashia@fsp-russia.ru
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  )
}
