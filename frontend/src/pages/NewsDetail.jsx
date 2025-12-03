import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ArrowLeft, Share2, ExternalLink } from 'lucide-react'
import { newsAPI } from '../utils/api'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export default function NewsDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsAPI.getOne(id)
        setNews(response.data)
      } catch (error) {
        console.error('Error fetching news:', error)
        navigate('/news')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!news) {
    return null
  }

  return (
    <div className="pt-20">
      <article className="section-padding bg-white dark:bg-dark-950">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-dark-500 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Все новости
            </Link>

            <div className="flex items-center gap-4 text-sm text-dark-500 dark:text-dark-400 mb-6">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(news.published_at), 'd MMMM yyyy, HH:mm', { locale: ru })}
              </span>
              {news.telegram_id && (
                <a
                  href={`https://t.me/fspchuv/${news.telegram_id.split('/').pop()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Telegram <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white mb-8">
              {news.title}
            </h1>

            {news.image_url && (
              <div className="rounded-2xl overflow-hidden mb-8">
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none">
              {news.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-dark-700 dark:text-dark-300 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                )
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-dark-200 dark:border-dark-700">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/news"
                  className="btn-secondary"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Все новости
                </Link>
                
                <a
                  href="https://t.me/fspchuv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Подписаться на Telegram
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </article>
    </div>
  )
}
