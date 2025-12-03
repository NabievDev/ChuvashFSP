import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, MailOpen, Trash2, Calendar, User, MessageSquare } from 'lucide-react'
import { contactAPI } from '../../utils/api'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { cn } from '../../utils/cn'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => { fetchMessages() }, [])

  const fetchMessages = async () => {
    try {
      const response = await contactAPI.getAll({ limit: 100 })
      setMessages(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await contactAPI.markRead(id)
      fetchMessages()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить сообщение?')) return
    try {
      await contactAPI.delete(id)
      if (selectedMessage?.id === id) setSelectedMessage(null)
      fetchMessages()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const selectMessage = (message) => {
    setSelectedMessage(message)
    if (!message.is_read) {
      handleMarkRead(message.id)
    }
  }

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
          Сообщения
          {unreadCount > 0 && (
            <span className="ml-3 px-2.5 py-1 text-sm font-semibold rounded-full bg-red-500 text-white">
              {unreadCount}
            </span>
          )}
        </h1>
        <p className="text-dark-600 dark:text-dark-400">Сообщения с формы обратной связи</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" /></div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 card">
          <MessageSquare className="w-16 h-16 text-dark-300 dark:text-dark-600 mx-auto mb-4" />
          <p className="text-dark-500">Сообщений пока нет</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {messages.map((message) => (
              <motion.button
                key={message.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => selectMessage(message)}
                className={cn(
                  "w-full text-left p-4 rounded-xl transition-colors",
                  selectedMessage?.id === message.id
                    ? "bg-primary-500/10 border border-primary-500/30"
                    : "card hover:bg-dark-50 dark:hover:bg-dark-800/50",
                  !message.is_read && "border-l-4 border-l-primary-500"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={cn(
                    "font-semibold truncate",
                    message.is_read ? "text-dark-700 dark:text-dark-300" : "text-dark-900 dark:text-white"
                  )}>
                    {message.name}
                  </span>
                  {message.is_read ? (
                    <MailOpen className="w-4 h-4 text-dark-400 flex-shrink-0" />
                  ) : (
                    <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-dark-500 truncate">{message.subject || 'Без темы'}</p>
                <p className="text-xs text-dark-400 mt-1">
                  {format(new Date(message.created_at), 'd MMM, HH:mm', { locale: ru })}
                </p>
              </motion.button>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-1">
                      {selectedMessage.subject || 'Без темы'}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-dark-500">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {selectedMessage.name}
                      </span>
                      <a href={`mailto:${selectedMessage.email}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                        {selectedMessage.email}
                      </a>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(selectedMessage.created_at), 'd MMMM yyyy, HH:mm', { locale: ru })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {selectedMessage.message.split('\n').map((p, i) => (
                    <p key={i} className="text-dark-700 dark:text-dark-300">{p}</p>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-dark-200 dark:border-dark-700">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Ваше сообщение'}`}
                    className="btn-primary"
                  >
                    Ответить
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="card p-12 text-center">
                <Mail className="w-16 h-16 text-dark-300 dark:text-dark-600 mx-auto mb-4" />
                <p className="text-dark-500">Выберите сообщение для просмотра</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
