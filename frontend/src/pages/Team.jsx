import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Trophy, User, Users, Star, Medal } from 'lucide-react'
import { teamAPI } from '../utils/api'
import SectionTitle from '../components/SectionTitle'

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
            <SectionTitle subtitle="Наша гордость">
              Сборная Чувашии
            </SectionTitle>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto text-lg -mt-8">
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
            <div className="space-y-12">
              {Object.entries(groupedMembers).map(([group, groupMembers], groupIndex) => {
                const [category, discipline] = group.split(' | ')
                const isMainRoster = category.includes('Основной')
                
                return (
                  <motion.div
                    key={group}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: groupIndex * 0.1 }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                        isMainRoster 
                          ? 'bg-gradient-to-br from-primary-500 to-accent-red shadow-primary-500/20'
                          : 'bg-gradient-to-br from-accent-yellow to-accent-orange shadow-accent-yellow/20'
                      }`}>
                        {isMainRoster ? (
                          <Trophy className="w-6 h-6 text-white" />
                        ) : (
                          <Users className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-dark-900 dark:text-white">
                          {category}
                        </h2>
                        <p className="text-primary-600 dark:text-primary-400 text-sm">
                          {discipline}
                        </p>
                      </div>
                      <span className="ml-auto px-3 py-1 rounded-full bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 text-sm font-medium">
                        {groupMembers.length} чел.
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {groupMembers.map((member, index) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05 }}
                          className="group"
                        >
                          <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-50 dark:bg-dark-800/50 border border-dark-200 dark:border-dark-700 hover:border-primary-500/50 hover:bg-primary-500/5 dark:hover:bg-primary-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-accent-yellow/20 dark:from-dark-700 dark:to-dark-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            
                            <div className="min-w-0">
                              <h3 className="font-semibold text-dark-900 dark:text-white text-sm whitespace-nowrap">
                                {member.full_name}
                              </h3>
                              
                              <div className="flex items-center gap-2 mt-0.5">
                                {member.position && (
                                  <span className="inline-flex items-center gap-1 text-xs text-accent-yellow font-medium">
                                    <Star className="w-3 h-3" />
                                    {member.position}
                                  </span>
                                )}
                                
                                {member.city && (
                                  <span className="flex items-center gap-1 text-xs text-dark-500 dark:text-dark-400">
                                    <MapPin className="w-3 h-3" />
                                    г. {member.city}
                                  </span>
                                )}
                              </div>
                            </div>

                            {member.position?.toLowerCase().includes('капитан') && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-accent-yellow to-accent-orange flex items-center justify-center shadow-lg">
                                <Medal className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}

              {members.length === 0 && (
                <div className="text-center py-20">
                  <Users className="w-16 h-16 text-dark-300 dark:text-dark-600 mx-auto mb-4" />
                  <p className="text-dark-500 dark:text-dark-400">
                    Информация о сборной появится в ближайшее время
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
