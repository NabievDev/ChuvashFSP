import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Calendar, ChevronRight, Newspaper,
  Cpu, Database, Shield, Cog, Rocket
} from 'lucide-react'
import { infoAPI, eventsAPI, newsAPI } from '../utils/api'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import SectionTitle from '../components/SectionTitle'

const disciplineIcons = {
  algorithm: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 5h16M4 12h10M4 19h6" strokeLinecap="round"/>
      <path d="M18 14l3 3-3 3M15 17h6" strokeLinecap="round"/>
    </svg>
  ),
  product: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <path d="M3 9h18M9 9v12" strokeLinecap="round"/>
      <circle cx="15" cy="15" r="2"/>
    </svg>
  ),
  security: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3L4 7v5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V7l-8-4z"/>
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  robotics: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="8" width="14" height="12" rx="2"/>
      <circle cx="9" cy="13" r="1.5" fill="currentColor"/>
      <circle cx="15" cy="13" r="1.5" fill="currentColor"/>
      <path d="M9 17h6M12 8V5M8 5h8" strokeLinecap="round"/>
    </svg>
  ),
  drone: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="12" rx="3" ry="2"/>
      <path d="M5 5m-2 0a2 2 0 104 0 2 2 0 10-4 0M19 5m-2 0a2 2 0 104 0 2 2 0 10-4 0M5 19m-2 0a2 2 0 104 0 2 2 0 10-4 0M19 19m-2 0a2 2 0 104 0 2 2 0 10-4 0"/>
      <path d="M7 7l2.5 3.5M17 7l-2.5 3.5M7 17l2.5-3.5M17 17l-2.5-3.5"/>
    </svg>
  ),
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
          newsAPI.getAll({ limit: 4 })
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

  const scrollToAbout = () => {
    document.getElementById('disciplines')?.scrollIntoView({ behavior: 'smooth' })
  }

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
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-dark-900 dark:text-white">Федерация</span>
              <br />
              <span className="gradient-text">спортивного</span>
              <br />
              <span className="text-dark-900 dark:text-white">программирования</span>
            </h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="w-32 h-1 bg-gradient-to-r from-primary-500 via-accent-orange to-accent-yellow mx-auto mb-6 rounded-full"
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <span className="text-2xl md:text-3xl font-semibold text-primary-600 dark:text-primary-400 tracking-wide">
                Чувашская Республика
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-lg md:text-xl text-dark-600 dark:text-dark-300 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Код. Скорость. Победа. Присоединяйся к элите IT-спорта региона!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <button 
                onClick={scrollToAbout}
                className="btn-primary group text-lg px-8 py-4"
              >
                О нас
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
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

      <section id="disciplines" className="section-padding bg-white dark:bg-dark-950">
        <div className="container-custom">
          <SectionTitle subtitle="Направления">
            Спортивные дисциплины
          </SectionTitle>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {info?.disciplines?.map((discipline, index) => {
              const IconComponent = disciplineIcons[discipline.icon] || disciplineIcons.algorithm
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="card-hover p-6 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
                  
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-red flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-primary-500/20">
                      <div className="text-white">
                        <IconComponent />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-3">
                      {discipline.name}
                    </h3>
                    <p className="text-dark-600 dark:text-dark-400 text-sm leading-relaxed">
                      {discipline.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-dark-50 to-white dark:from-dark-900 dark:to-dark-950 overflow-hidden">
        <div className="container-custom">
          <SectionTitle subtitle="Хронология">
            История развития
          </SectionTitle>

          <div className="relative max-w-4xl mx-auto">
            <svg className="absolute left-8 md:left-1/2 top-0 h-full w-20 -translate-x-1/2 overflow-visible hidden md:block" preserveAspectRatio="none">
              <defs>
                <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              <path
                d="M 40 0 C 40 80, 10 120, 10 200 S 70 280, 70 360 S 10 440, 10 520 S 70 600, 70 680 S 10 760, 10 840"
                stroke="url(#timelineGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            <div className="md:hidden absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 via-accent-orange to-accent-yellow rounded-full" />

            {info?.history?.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className={`relative flex items-center gap-6 mb-12 ${
                  index % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''
                }`}
              >
                <motion.div 
                  className="absolute left-6 md:left-1/2 w-5 h-5 -translate-x-1/2 z-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.2 }}
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-accent-orange border-4 border-white dark:border-dark-900 shadow-lg" />
                </motion.div>
                
                <div className="flex-1 ml-14 md:ml-0">
                  <div className="card p-6 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-orange/20 text-primary-600 dark:text-primary-400 text-sm font-bold">
                        {item.date}
                      </div>
                    </div>
                    <p className="text-dark-700 dark:text-dark-300 leading-relaxed text-lg font-medium group-hover:text-dark-900 dark:group-hover:text-white transition-colors">
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
              <SectionTitle subtitle="Расписание" className="mb-0">
                Ближайшие мероприятия
              </SectionTitle>
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

      {news.length > 0 && (
        <section className="section-padding bg-gradient-to-b from-dark-50 to-white dark:from-dark-900 dark:to-dark-950">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
              <SectionTitle subtitle="Лента" className="mb-0">
                Последние новости
              </SectionTitle>
              <Link to="/news" className="btn-secondary group">
                Все новости
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {news.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-hover overflow-hidden group"
                >
                  {item.image_url ? (
                    <div className="aspect-video overflow-hidden bg-dark-100 dark:bg-dark-800">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary-500/20 to-accent-orange/20 flex items-center justify-center">
                      <Newspaper className="w-12 h-12 text-primary-500/50" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="text-xs text-dark-500 dark:text-dark-400 mb-2">
                      {format(new Date(item.published_at), 'd MMMM yyyy', { locale: ru })}
                    </div>
                    <h3 className="font-semibold text-dark-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {item.title}
                    </h3>
                    <Link
                      to={`/news/${item.id}`}
                      className="inline-flex items-center gap-1 mt-3 text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:gap-2 transition-all"
                    >
                      Читать <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-950" />
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary-500/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
          
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 50 30 M 50 70 L 50 100 M 0 50 L 30 50 M 70 50 L 100 50" stroke="#f97316" strokeWidth="1" fill="none"/>
                <circle cx="50" cy="50" r="5" fill="none" stroke="#f97316" strokeWidth="1"/>
                <circle cx="50" cy="30" r="3" fill="#f97316"/>
                <circle cx="50" cy="70" r="3" fill="#f97316"/>
                <circle cx="30" cy="50" r="3" fill="#f97316"/>
                <circle cx="70" cy="50" r="3" fill="#f97316"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)"/>
          </svg>

          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-orange/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-orange flex items-center justify-center shadow-2xl shadow-primary-500/30"
            >
              <Rocket className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Стань частью{' '}
              <span className="gradient-text">будущего</span>
            </h2>
            <p className="text-dark-300 max-w-2xl mx-auto mb-10 text-lg">
              Развивай навыки, соревнуйся с лучшими и создавай технологии завтрашнего дня вместе с нами
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://t.me/fspchuv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-primary-500 to-accent-orange text-white hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300"
              >
                Telegram канал
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <Link
                to="/contacts"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
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
