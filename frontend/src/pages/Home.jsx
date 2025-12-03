import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Code2, Trophy, Shield, Bot, Plane, Zap, ArrowRight, Calendar, 
  Users, FileText, ChevronRight, Sparkles, Terminal, Cpu
} from 'lucide-react'
import { infoAPI, eventsAPI, newsAPI } from '../utils/api'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

const disciplineIcons = {
  algorithm: Code2,
  product: Terminal,
  security: Shield,
  robotics: Bot,
  drone: Plane,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function Home() {
  const [info, setInfo] = useState(null)
  const [events, setEvents] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoRes, eventsRes, newsRes] = await Promise.all([
          infoAPI.get(),
          eventsAPI.getUpcoming(3),
          newsAPI.getAll({ limit: 3 })
        ])
        setInfo(infoRes.data)
        setEvents(eventsRes.data)
        setNews(newsRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950" />
        <div className="absolute inset-0 bg-grid" />
        
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-yellow/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-red/10 rounded-full blur-3xl" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary-500/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative container-custom py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              Инновационный вид спорта
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-dark-900 dark:text-white">Федерация</span>
              <br />
              <span className="gradient-text">спортивного</span>
              <br />
              <span className="text-dark-900 dark:text-white">программирования</span>
            </h1>

            <p className="text-lg md:text-xl text-dark-600 dark:text-dark-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Чувашская Республика. Развиваем соревновательное программирование, 
              готовим чемпионов и создаём будущее IT-индустрии региона.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="btn-primary group">
                Мероприятия
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/team" className="btn-secondary">
                Сборная Чувашии
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[
                { value: '2021', label: 'Год основания ФСП' },
                { value: '5', label: 'Дисциплин' },
                { value: '2022', label: 'Признание спортом' },
                { value: '5+', label: 'Членов сборной' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm border border-dark-200/50 dark:border-dark-700/50"
                >
                  <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-dark-500 dark:text-dark-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-dark-300 dark:border-dark-600 flex justify-center pt-2"
          >
            <div className="w-1.5 h-3 bg-primary-500 rounded-full" />
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-dark-950">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Спортивные дисциплины</span>
            </h2>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              Спортивное программирование объединяет пять уникальных направлений, 
              каждое из которых развивает важные профессиональные компетенции
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {info?.disciplines?.map((discipline, index) => {
              const Icon = disciplineIcons[discipline.icon] || Code2
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="card-hover p-6 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-red flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-3">
                    {discipline.name}
                  </h3>
                  <p className="text-dark-600 dark:text-dark-400 text-sm leading-relaxed">
                    {discipline.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-dark-50 to-white dark:from-dark-900 dark:to-dark-950">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">История развития</span>
            </h2>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              Ключевые вехи становления спортивного программирования в России и Чувашии
            </p>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-accent-orange to-accent-yellow" />

            {info?.history?.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center gap-6 mb-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''
                }`}
              >
                <div className="absolute left-8 md:left-1/2 w-4 h-4 -translate-x-1/2 rounded-full bg-primary-500 border-4 border-white dark:border-dark-900 z-10" />
                
                <div className="flex-1 ml-16 md:ml-0">
                  <div className="card p-6">
                    <div className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-2">
                      {item.date}
                    </div>
                    <p className="text-dark-700 dark:text-dark-300">
                      {item.event}
                    </p>
                  </div>
                </div>

                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {events.length > 0 && (
        <section className="section-padding bg-white dark:bg-dark-950">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  <span className="gradient-text">Ближайшие мероприятия</span>
                </h2>
                <p className="text-dark-600 dark:text-dark-400">
                  Соревнования и события федерации
                </p>
              </div>
              <Link to="/events" className="btn-secondary group">
                Все мероприятия
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-hover p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                        {format(new Date(event.event_date), 'd MMMM yyyy', { locale: ru })}
                      </div>
                      {event.event_time && (
                        <div className="text-xs text-dark-500">{event.event_time}</div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  {event.location && (
                    <p className="text-sm text-dark-500 dark:text-dark-400">
                      {event.location}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-orange to-accent-red" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        
        <div className="relative container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Присоединяйтесь к нам
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Следите за новостями, участвуйте в соревнованиях и станьте частью 
              динамично развивающегося сообщества спортивного программирования
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://t.me/fspchuv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-white text-primary-600 hover:bg-white/90 transition-colors"
              >
                Telegram канал
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <Link
                to="/contacts"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-white/10 text-white border border-white/30 hover:bg-white/20 transition-colors"
              >
                Связаться с нами
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
