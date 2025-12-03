import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Crown, Award, User, Briefcase, FileText, Building } from 'lucide-react'
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
  const boardMembers = members.filter(m => 
    m.position.includes('Член') || m.position.includes('Правлени')
  )
  const otherMembers = members.filter(m => 
    !m.position.includes('Высший орган') && 
    !m.position.includes('Президент') &&
    !m.position.includes('Член') &&
    !m.position.includes('Правлени')
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
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
                <div className="relative">
                  <div className="absolute left-6 top-0 h-full w-0.5 bg-gradient-to-b from-indigo-500 via-indigo-400 to-indigo-300 rounded-full" />

                  <div className="space-y-8 pl-16">
                    {highestBody && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                      >
                        <div className="absolute -left-[52px] top-4 flex items-center">
                          <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-dark-950 z-10" />
                          <div className="w-10 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-1">
                            {highestBody.full_name}
                          </h3>
                          <p className="text-dark-500 dark:text-dark-400 text-sm">
                            {highestBody.position}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {president && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="relative"
                      >
                        <div className="absolute -left-[52px] top-4 flex items-center">
                          <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-dark-950 z-10" />
                          <div className="w-10 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-1">
                            {president.position}
                          </h3>
                          <p className="text-dark-500 dark:text-dark-400 text-sm">
                            {president.full_name}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {boardMembers.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                      >
                        <div className="absolute -left-[52px] top-4 flex items-center">
                          <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-dark-950 z-10" />
                          <div className="w-10 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-3">
                            Члены правления
                          </h3>
                          <div className="space-y-1">
                            {boardMembers.map((member, idx) => (
                              <p key={member.id} className="text-dark-500 dark:text-dark-400 text-sm">
                                {member.full_name}
                              </p>
                            ))}
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 text-xs text-dark-400 dark:text-dark-500 max-w-sm"
                  >
                    Организационная структура региональной физкультурно-спортивной общественной организации «Федерация спортивного программирования»
                  </motion.p>
                </div>

                <div className="relative">
                  <div className="absolute right-6 top-0 h-full w-0.5 bg-gradient-to-b from-indigo-500 to-indigo-300 rounded-full" />

                  <div className="space-y-8 pr-16 text-right">
                    {vicePresident && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                      >
                        <div className="absolute -right-[52px] top-4 flex items-center flex-row-reverse">
                          <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-dark-950 z-10" />
                          <div className="w-10 h-0.5 bg-gradient-to-l from-indigo-500 to-transparent" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-1">
                            Первый Вице-Президент
                          </h3>
                          <p className="text-dark-500 dark:text-dark-400 text-sm">
                            {vicePresident.full_name}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="relative"
                    >
                      <div className="absolute -right-[52px] top-4 flex items-center flex-row-reverse">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-dark-950 z-10" />
                        <div className="w-10 h-0.5 bg-gradient-to-l from-indigo-500 to-transparent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-1">
                          Исполнительный директор
                        </h3>
                        <p className="text-dark-500 dark:text-dark-400 text-sm">
                          {otherMembers.find(m => m.position.includes('Исполнительный'))?.full_name || 'Формируется'}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="relative"
                    >
                      <div className="absolute -right-[52px] top-4 flex items-center flex-row-reverse">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-dark-950 z-10" />
                        <div className="w-10 h-0.5 bg-gradient-to-l from-indigo-500 to-transparent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-1">
                          Административный директор
                        </h3>
                        <p className="text-dark-500 dark:text-dark-400 text-sm">
                          {otherMembers.find(m => m.position.includes('Административный'))?.full_name || 'Формируется'}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="relative"
                    >
                      <div className="absolute -right-[52px] top-4 flex items-center flex-row-reverse">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-dark-950 z-10" />
                        <div className="w-10 h-0.5 bg-gradient-to-l from-indigo-500 to-transparent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-1">
                          Экспертный совет
                        </h3>
                        <p className="text-dark-500 dark:text-dark-400 text-sm italic">
                          формируется
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className="relative"
                    >
                      <div className="absolute -right-[52px] top-4 flex items-center flex-row-reverse">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-dark-950 z-10" />
                        <div className="w-10 h-0.5 bg-gradient-to-l from-indigo-500 to-transparent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-1">
                          Попечительский совет
                        </h3>
                        <p className="text-dark-500 dark:text-dark-400 text-sm italic">
                          формируется
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
