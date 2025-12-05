import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Crown, User } from 'lucide-react'
import { leadershipAPI } from '../utils/api'
import SectionTitle from '../components/SectionTitle'

export default function Leadership() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await leadershipAPI.getAll()
        setMembers(response.data)
      } catch (error) {
        console.error('Error fetching leadership:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [])

  const highestBody = members.find(m => m.position.includes('Высший орган'))
  const president = members.find(m => m.position.includes('Президент') && !m.position.includes('Вице'))
  const vicePresident = members.find(m => m.position.includes('Вице-президент'))

  const orgStructure = [
    {
      title: 'Общее собрание членов',
      subtitle: 'Высший орган управления',
      icon: Users,
      color: 'from-indigo-500 to-indigo-600',
      shadowColor: 'shadow-indigo-500/20'
    },
    {
      title: 'Президент',
      subtitle: president?.full_name || 'Набиев Александр Эльдарович',
      description: 'Руководитель организации',
      icon: Crown,
      color: 'from-primary-500 to-accent-red',
      shadowColor: 'shadow-primary-500/20'
    },
    {
      title: 'Вице-президент',
      subtitle: vicePresident?.full_name || 'Спиридонов Михаил Юрьевич',
      description: 'Заместитель руководителя',
      icon: User,
      color: 'from-accent-orange to-accent-yellow',
      shadowColor: 'shadow-accent-orange/20'
    }
  ]

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
            <SectionTitle subtitle="Органы управления">
              Руководство
            </SectionTitle>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto text-lg -mt-8">
              РФСОО «Федерация спортивного программирования по Чувашской Республике»
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-dark-950">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {orgStructure.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-6 rounded-2xl bg-dark-50 dark:bg-dark-800/50 border border-dark-200 dark:border-dark-700 hover:border-primary-500/30 transition-all duration-300 hover:shadow-xl ${item.shadowColor}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg ${item.shadowColor} flex-shrink-0`}>
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-primary-500 font-mono text-sm">{String(index + 1).padStart(2, '0')}</span>
                          <h3 className="text-xl font-bold text-dark-900 dark:text-white">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-dark-600 dark:text-dark-300 font-medium">
                          {item.subtitle}
                        </p>
                        {item.description && (
                          <p className="text-dark-500 dark:text-dark-400 text-sm mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {index < orgStructure.length - 1 && (
                      <div className="absolute left-1/2 -bottom-6 w-0.5 h-6 bg-gradient-to-b from-dark-300 dark:from-dark-600 to-transparent" />
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center text-sm text-dark-400 dark:text-dark-500 max-w-lg mx-auto"
              >
                Организационная структура региональной физкультурно-спортивной общественной организации «Федерация спортивного программирования по Чувашской Республике»
              </motion.p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
