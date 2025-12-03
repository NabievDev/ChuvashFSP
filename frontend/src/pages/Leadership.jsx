import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Crown, Award, User } from 'lucide-react'
import { leadershipAPI } from '../utils/api'

const positionIcons = {
  'Высший орган управления': Users,
  'Президент': Crown,
  'Первый Вице-президент': Award,
}

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

  const getIcon = (position) => {
    for (const [key, Icon] of Object.entries(positionIcons)) {
      if (position.includes(key)) return Icon
    }
    return User
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Руководство</span>
            </h1>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto text-lg">
              Органы управления РФСОО «Федерация спортивного программирования 
              по Чувашской Республике»
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
            <div className="max-w-4xl mx-auto space-y-6">
              {members.map((member, index) => {
                const Icon = getIcon(member.position)
                const isPresident = member.position.includes('Президент')
                const isHighestBody = member.position.includes('Высший орган')
                
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative ${isHighestBody ? 'mb-12' : ''}`}
                  >
                    {index > 0 && !isHighestBody && (
                      <div className="absolute -top-3 left-10 w-0.5 h-6 bg-gradient-to-b from-primary-500/50 to-transparent" />
                    )}
                    
                    <div
                      className={`card p-6 ${
                        isPresident || isHighestBody
                          ? 'bg-gradient-to-r from-primary-500/5 to-accent-yellow/5 border-primary-500/30'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-5">
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                            isHighestBody
                              ? 'bg-gradient-to-br from-primary-500 to-accent-red'
                              : isPresident
                              ? 'bg-gradient-to-br from-accent-yellow to-primary-500'
                              : 'bg-gradient-to-br from-dark-200 to-dark-300 dark:from-dark-700 dark:to-dark-600'
                          }`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className={`text-xl font-bold mb-1 ${
                            isPresident || isHighestBody
                              ? 'gradient-text'
                              : 'text-dark-900 dark:text-white'
                          }`}>
                            {member.full_name}
                          </h3>
                          <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                            {member.position}
                          </p>
                          {member.description && (
                            <p className="text-dark-600 dark:text-dark-400 text-sm">
                              {member.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
