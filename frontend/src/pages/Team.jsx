import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Code2, Trophy, User } from 'lucide-react'
import { teamAPI } from '../utils/api'

export default function Team() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await teamAPI.getAll()
        setMembers(response.data)
      } catch (error) {
        console.error('Error fetching team:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [])

  const groupedMembers = members.reduce((acc, member) => {
    const key = `${member.category} | ${member.discipline}`
    if (!acc[key]) acc[key] = []
    acc[key].push(member)
    return acc
  }, {})

  return (
    <div className="pt-20">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-yellow/10 via-transparent to-primary-500/10" />
        <div className="absolute inset-0 bg-grid" />
        
        <div className="relative container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
              <Trophy className="w-4 h-4" />
              Наша гордость
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Сборная Чувашии</span>
            </h1>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto text-lg">
              Спортсмены, представляющие Чувашскую Республику на соревнованиях 
              по спортивному программированию
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
            Object.entries(groupedMembers).map(([group, groupMembers], groupIndex) => (
              <motion.div
                key={group}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16 last:mb-0"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-red flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark-900 dark:text-white">
                      {group.split(' | ')[0]}
                    </h2>
                    <p className="text-primary-600 dark:text-primary-400">
                      {group.split(' | ')[1]}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="card-hover p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-yellow/20 dark:from-dark-700 dark:to-dark-600 flex items-center justify-center flex-shrink-0">
                          <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <h3 className="font-semibold text-dark-900 dark:text-white mb-1 truncate">
                            {member.full_name}
                          </h3>
                          
                          {member.position && (
                            <span className="inline-block px-2 py-0.5 rounded-md bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium mb-2">
                              {member.position}
                            </span>
                          )}
                          
                          {member.city && (
                            <div className="flex items-center gap-1.5 text-sm text-dark-500 dark:text-dark-400">
                              <MapPin className="w-4 h-4" />
                              <span>г. {member.city}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
