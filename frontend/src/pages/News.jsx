import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Newspaper, Calendar, ArrowRight, ExternalLink } from 'lucide-react'
import { newsAPI } from '../utils/api'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export default function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const limit = 12

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async (loadMore = false) => {
    try {
      const skip = loadMore ? news.length : 0
      const response = await newsAPI.getAll({ skip, limit })
      
      if (loadMore) {
        setNews(prev => [...prev, ...response.data])
      } else {
        setNews(response.data)
      }
      
      setHasMore(response.data.length === limit)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    setPage(prev => prev + 1)
    fetchNews(true)
  }

  return (
    <div className="pt-20">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-yellow/10" />
        <div className="absolute inset-0 bg-grid" />
        
        <div className="relative container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
              <Newspaper className="w-4 h-4" />
              Новости федерации
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Новости</span>
            </h1>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto text-lg">
              Актуальные новости и события ФСП Чувашии
            </p>
            <a
              href="https://t.me/fspchuv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-primary-600 dark:text-primary-400 hover:underline"
            >
              Telegram-канал @fspchuv <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-dark-950">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
            </div>
          ) : news.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-2xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-10 h-10 text-dark-400" />
              </div>
              <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
                Новости пока не загружены
              </h3>
              <p className="text-dark-600 dark:text-dark-400 mb-6">
                Следите за обновлениями в нашем Telegram-канале
              </p>
              <a
                href="https://t.me/fspchuv"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Открыть Telegram
              </a>
            </motion.div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="card-hover overflow-hidden group"
                  >
                    {item.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-dark-500 dark:text-dark-400 mb-3">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(item.published_at), 'd MMMM yyyy', { locale: ru })}
                      </div>
                      <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-dark-600 dark:text-dark-400 text-sm line-clamp-3 mb-4">
                        {item.content}
                      </p>
                      <Link
                        to={`/news/${item.id}`}
                        className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:gap-2 transition-all"
                      >
                        Читать далее <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-12">
                  <button onClick={loadMore} className="btn-secondary">
                    Загрузить ещё
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
