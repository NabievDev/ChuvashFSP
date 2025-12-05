import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Trophy, User, Users, Star, Medal, ChevronDown } from 'lucide-react'
import { teamAPI } from '../utils/api'
import SectionTitle from '../components/SectionTitle'

function CollapsibleTeamSection({ title, discipline, members, isMainRoster, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border border-dark-200 dark:border-dark-700 rounded-2xl overflow-hidden bg-white dark:bg-dark-900/50"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-5 hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors"
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${
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
        <div className="flex-1 text-left">
          <h2 className="text-lg font-bold text-dark-900 dark:text-white">
            {title}
          </h2>
          <p className="text-primary-600 dark:text-primary-400 text-sm">
            {discipline}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 text-sm font-medium">
          {members.length} чел.
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-dark-400"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-dark-200 dark:border-dark-700">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-5">
                {members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="group"
                  >
                    <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-50 dark:bg-dark-800/50 border border-dark-200 dark:border-dark-700 hover:border-primary-500/50 hover:bg-primary-500/5 dark:hover:bg-primary-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-accent-yellow/20 dark:from-dark-700 dark:to-dark-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-dark-900 dark:text-white text-sm truncate">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

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
            <div className="space-y-6 max-w-5xl mx-auto">
              {Object.entries(groupedMembers).map(([group, groupMembers], groupIndex) => {
                const [category, discipline] = group.split(' | ')
                const isMainRoster = category.includes('Основной')
                const isJuniorTeam = hasJuniors(groupMembers)
                
                const displayTitle = isJuniorTeam 
                  ? `${category} (юниоры)` 
                  : category

                return (
                  <CollapsibleTeamSection
                    key={group}
                    title={displayTitle}
                    discipline={discipline}
                    members={groupMembers}
                    isMainRoster={isMainRoster}
                    defaultOpen={groupIndex === 0}
                  />
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
