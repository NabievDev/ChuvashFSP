import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Trophy, User, ChevronDown, Users, Star } from 'lucide-react'
import { teamAPI } from '../utils/api'
import SectionTitle from '../components/SectionTitle'

export default function Team() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState({})

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await teamAPI.getAll()
        setMembers(response.data)
        const groups = response.data.reduce((acc, member) => {
          const key = `${member.category} | ${member.discipline}`
          acc[key] = true
          return acc
        }, {})
        setExpandedGroups(groups)
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

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }))
  }

  const hasJuniors = (groupMembers) => {
    return groupMembers.some(m => m.position?.toLowerCase().includes('юниор'))
  }

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
            <div className="max-w-4xl mx-auto space-y-6">
              {Object.entries(groupedMembers).map(([group, groupMembers], groupIndex) => {
                const [category, discipline] = group.split(' | ')
                const isExpanded = expandedGroups[group]
                const isMainRoster = category.includes('Основной')
                const showJuniorsLabel = hasJuniors(groupMembers)
                
                return (
                  <motion.div
                    key={group}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="card overflow-hidden"
                  >
                    <button
                      onClick={() => toggleGroup(group)}
                      className="w-full p-6 flex items-center justify-between hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                          isMainRoster 
                            ? 'bg-gradient-to-br from-primary-500 to-accent-red shadow-primary-500/20'
                            : 'bg-gradient-to-br from-accent-yellow to-accent-orange shadow-accent-yellow/20'
                        }`}>
                          {isMainRoster ? (
                            <Trophy className="w-7 h-7 text-white" />
                          ) : (
                            <Users className="w-7 h-7 text-white" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-dark-900 dark:text-white">
                              {category}
                            </h2>
                            {showJuniorsLabel && (
                              <span className="px-3 py-1 rounded-full bg-accent-yellow/20 text-accent-yellow text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                Юниоры
                              </span>
                            )}
                          </div>
                          <p className="text-primary-600 dark:text-primary-400 text-sm">
                            {discipline}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 text-sm font-medium">
                          {groupMembers.length} чел.
                        </span>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-dark-400" />
                        </motion.div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <div className="relative pl-8 border-l-2 border-dashed border-primary-500/30">
                              {groupMembers.map((member, index) => (
                                <motion.div
                                  key={member.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="relative py-4 first:pt-0 last:pb-0"
                                >
                                  <div className="absolute -left-[25px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary-500 border-2 border-white dark:border-dark-900" />
                                  
                                  <div className="absolute -left-[9px] top-1/2 w-6 h-px bg-primary-500/50" />
                                  
                                  <div className="flex items-center gap-4 p-4 rounded-xl bg-dark-50 dark:bg-dark-800/50 hover:bg-primary-500/5 dark:hover:bg-primary-500/10 transition-colors">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-yellow/20 dark:from-dark-700 dark:to-dark-600 flex items-center justify-center flex-shrink-0">
                                      <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    
                                    <div className="flex-grow min-w-0">
                                      <h3 className="font-semibold text-dark-900 dark:text-white">
                                        {member.full_name}
                                      </h3>
                                      
                                      <div className="flex flex-wrap items-center gap-3 mt-1">
                                        {member.position && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent-yellow/20 text-accent-yellow text-xs font-medium">
                                            <Star className="w-3 h-3" />
                                            {member.position}
                                          </span>
                                        )}
                                        
                                        {member.city && (
                                          <span className="flex items-center gap-1 text-sm text-dark-500 dark:text-dark-400">
                                            <MapPin className="w-3.5 h-3.5" />
                                            г. {member.city}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
