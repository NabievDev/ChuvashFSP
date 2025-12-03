import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ArrowLeft, ExternalLink, Image } from 'lucide-react'
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

  const images = news.images || []
  const hasMultipleImages = images.length > 0

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
              <div className="rounded-2xl overflow-hidden mb-8 bg-dark-100 dark:bg-dark-800">
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}

            {hasMultipleImages && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {images.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="aspect-square rounded-xl overflow-hidden bg-dark-100 dark:bg-dark-800"
                  >
                    <img
                      src={img}
                      alt={`${news.title} - изображение ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-accent-orange/20"><svg class="w-12 h-12 text-primary-500/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></div>`
                      }}
                    />
                  </motion.div>
                ))}
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
