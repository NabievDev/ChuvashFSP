import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Crown, Award, User } from 'lucide-react'
import { leadershipAPI } from '../utils/api'
import SectionTitle from '../components/SectionTitle'

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

  const highestBody = members.find(m => m.position.includes('Высший орган'))
  const president = members.find(m => m.position.includes('Президент') && !m.position.includes('Вице'))
  const vicePresident = members.find(m => m.position.includes('Вице-президент'))
  const otherMembers = members.filter(m => 
    !m.position.includes('Высший орган') && 
    !m.position.includes('Президент')
  )

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
              {highestBody && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <div className="card p-8 bg-gradient-to-br from-primary-500/5 to-accent-yellow/5 border-primary-500/30 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-red flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/20">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold gradient-text mb-2">
                      {highestBody.full_name}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 font-medium">
                      {highestBody.position}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="relative">
                <svg className="absolute left-1/2 top-0 h-12 -translate-x-1/2 -translate-y-full hidden md:block" width="4" height="48">
                  <path d="M2 0 L2 48" stroke="url(#lineGradient)" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f97316"/>
                      <stop offset="100%" stopColor="#fb923c"/>
                    </linearGradient>
                  </defs>
                </svg>

                {(president || vicePresident) && (
                  <div className="relative mb-12">
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 via-accent-orange to-accent-yellow -translate-x-1/2 hidden md:block rounded-full" />
                    
                    <div className="space-y-8 relative">
                      {president && (
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          className="relative"
                        >
                          <div className="md:w-1/2 md:pr-12">
                            <div className="absolute left-1/2 top-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-orange border-4 border-white dark:border-dark-900" />
                            </div>
                            
                            <div className="hidden md:block absolute left-1/2 top-1/2 w-12 h-0.5 -translate-y-1/2 bg-gradient-to-l from-primary-500 to-transparent" style={{ transform: 'translateX(-100%) translateY(-50%)' }} />
                            
                            <div className="card p-6 bg-gradient-to-r from-accent-yellow/10 to-primary-500/5 border-accent-yellow/30 hover:shadow-xl hover:shadow-accent-yellow/10 transition-all duration-300">
                              <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-yellow to-primary-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                  <Crown className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold gradient-text">
                                    {president.full_name}
                                  </h3>
                                  <p className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                                    {president.position}
                                  </p>
                                  {president.description && (
                                    <p className="text-dark-600 dark:text-dark-400 text-sm mt-1">
                                      {president.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {vicePresident && (
                        <motion.div
                          initial={{ opacity: 0, x: 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          className="relative md:flex md:justify-end"
                        >
                          <div className="md:w-1/2 md:pl-12">
                            <div className="absolute left-1/2 top-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-accent-orange to-accent-yellow border-4 border-white dark:border-dark-900" />
                            </div>
                            
                            <div className="hidden md:block absolute left-1/2 top-1/2 w-12 h-0.5 -translate-y-1/2 bg-gradient-to-r from-accent-orange to-transparent" />
                            
                            <div className="card p-6 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300">
                              <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-orange to-primary-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                  <Award className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-dark-900 dark:text-white">
                                    {vicePresident.full_name}
                                  </h3>
                                  <p className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                                    {vicePresident.position}
                                  </p>
                                  {vicePresident.description && (
                                    <p className="text-dark-600 dark:text-dark-400 text-sm mt-1">
                                      {vicePresident.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {otherMembers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-3">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-dark-300 dark:to-dark-600" />
                        <span className="text-dark-500 dark:text-dark-400 font-medium text-sm uppercase tracking-wider">
                          Члены Федерации и Правления
                        </span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-dark-300 dark:to-dark-600" />
                      </div>
                    </div>

                    <div className="relative pl-8 md:pl-12">
                      <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-dark-300 via-dark-400 to-dark-300 dark:from-dark-600 dark:via-dark-500 dark:to-dark-600 rounded-full" />
                      
                      <div className="space-y-4">
                        {otherMembers.map((member, index) => (
                          <motion.div
                            key={member.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                          >
                            <div className="absolute -left-8 md:-left-12 top-1/2 -translate-y-1/2 flex items-center">
                              <div className="w-4 h-4 rounded-full bg-dark-300 dark:bg-dark-600 border-4 border-white dark:border-dark-900 z-10" />
                              <div className="w-4 md:w-8 h-0.5 bg-dark-300 dark:bg-dark-600 rounded-full" />
                            </div>
                            
                            <div className="card p-5 hover:shadow-lg hover:border-dark-300 dark:hover:border-dark-600 transition-all duration-300">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-dark-200 to-dark-300 dark:from-dark-700 dark:to-dark-600 flex items-center justify-center flex-shrink-0">
                                  <User className="w-6 h-6 text-dark-600 dark:text-dark-300" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-dark-900 dark:text-white">
                                    {member.full_name}
                                  </h3>
                                  <p className="text-dark-500 dark:text-dark-400 text-sm">
                                    {member.position}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
