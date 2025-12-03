import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { eventsAPI } from '../utils/api'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns'
import { ru } from 'date-fns/locale'
import { cn } from '../utils/cn'
import SectionTitle from '../components/SectionTitle'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventsAPI.getAll({
          month: currentMonth.getMonth() + 1,
          year: currentMonth.getFullYear()
        })
        setEvents(response.data)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [currentMonth])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDay = monthStart.getDay()
  const paddingDays = startDay === 0 ? 6 : startDay - 1

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.event_date)
      return isSameDay(eventDate, date)
    })
  }

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : events

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date())
    setSelectedDate(null)
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
            <SectionTitle subtitle="Расписание">
              Календарь мероприятий
            </SectionTitle>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto text-lg -mt-8">
              Соревнования, турниры и события федерации спортивного программирования
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-dark-950">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-dark-900 dark:text-white capitalize">
                    {format(currentMonth, 'LLLL yyyy', { locale: ru })}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={goToCurrentMonth}
                      className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                      title="Текущий месяц"
                    >
                      <CalendarDays className="w-5 h-5 text-primary-500" />
                    </button>
                    <button
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
                    <div
                      key={day}
                      className="py-2 text-center text-sm font-medium text-dark-500 dark:text-dark-400"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {[...Array(paddingDays)].map((_, i) => (
                    <div key={`pad-${i}`} className="aspect-square" />
                  ))}
                  
                  {days.map((day) => {
                    const dayEvents = getEventsForDate(day)
                    const hasEvents = dayEvents.length > 0
                    const isSelected = selectedDate && isSameDay(day, selectedDate)
                    const isTodayDate = isToday(day)
                    
                    return (
                      <button
                        key={day.toString()}
                        onClick={() => setSelectedDate(isSelected ? null : day)}
                        className={cn(
                          'aspect-square p-1 rounded-xl flex flex-col items-center justify-center transition-all relative',
                          isTodayDate && 'ring-2 ring-primary-500',
                          isSelected && 'bg-primary-500 text-white',
                          !isSelected && hasEvents && 'bg-primary-500/10 hover:bg-primary-500/20',
                          !isSelected && !hasEvents && 'hover:bg-dark-100 dark:hover:bg-dark-800'
                        )}
                      >
                        <span className={cn(
                          'text-sm font-medium',
                          !isSelected && 'text-dark-900 dark:text-white'
                        )}>
                          {format(day, 'd')}
                        </span>
                        {hasEvents && (
                          <div className={cn(
                            'absolute bottom-1 flex gap-0.5',
                            isSelected ? 'text-white' : 'text-primary-500'
                          )}>
                            {dayEvents.slice(0, 3).map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  'w-1.5 h-1.5 rounded-full',
                                  isSelected ? 'bg-white' : 'bg-primary-500'
                                )}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  {selectedDate
                    ? format(selectedDate, 'd MMMM yyyy', { locale: ru })
                    : 'Все мероприятия'}
                </h3>

                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                  </div>
                ) : selectedEvents.length === 0 ? (
                  <div className="card p-6 text-center">
                    <Calendar className="w-12 h-12 text-dark-300 dark:text-dark-600 mx-auto mb-3" />
                    <p className="text-dark-500 dark:text-dark-400">
                      {selectedDate ? 'Нет мероприятий на эту дату' : 'Нет запланированных мероприятий'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="card-hover p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-red flex flex-col items-center justify-center text-white flex-shrink-0">
                            <span className="text-xs font-medium">
                              {format(new Date(event.event_date), 'MMM', { locale: ru })}
                            </span>
                            <span className="text-lg font-bold leading-none">
                              {format(new Date(event.event_date), 'd')}
                            </span>
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="font-semibold text-dark-900 dark:text-white mb-1 line-clamp-2">
                              {event.title}
                            </h4>
                            <div className="flex flex-wrap gap-3 text-sm text-dark-500 dark:text-dark-400">
                              {event.event_time && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {event.event_time}
                                </span>
                              )}
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {event.description && (
                          <p className="mt-3 text-sm text-dark-600 dark:text-dark-400 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
