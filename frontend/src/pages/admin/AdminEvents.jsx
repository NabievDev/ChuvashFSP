import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Plus, Edit2, Trash2, X, Eye, EyeOff, Loader2, Calendar, MapPin, Clock } from 'lucide-react'
import { eventsAPI } from '../../utils/api'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { cn } from '../../utils/cn'

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => { fetchEvents() }, [])

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll({ include_hidden: true, limit: 100 })
      setEvents(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (item = null) => {
    setEditingItem(item)
    if (item) {
      reset({
        title: item.title,
        description: item.description || '',
        event_date: item.event_date,
        event_time: item.event_time || '',
        location: item.location || '',
        event_type: item.event_type || '',
        is_visible: item.is_visible
      })
    } else {
      reset({ title: '', description: '', event_date: '', event_time: '', location: '', event_type: '', is_visible: true })
    }
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditingItem(null); reset() }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      if (editingItem) {
        await eventsAPI.update(editingItem.id, data)
      } else {
        await eventsAPI.create(data)
      }
      fetchEvents()
      closeModal()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить мероприятие?')) return
    try { await eventsAPI.delete(id); fetchEvents() } catch (error) { console.error('Error:', error) }
  }

  const toggleVisibility = async (item) => {
    try { await eventsAPI.update(item.id, { is_visible: !item.is_visible }); fetchEvents() } catch (error) { console.error('Error:', error) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Мероприятия</h1>
          <p className="text-dark-600 dark:text-dark-400">Управление календарём мероприятий</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary"><Plus className="w-5 h-5 mr-2" />Добавить</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" /></div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 card"><p className="text-dark-500 mb-4">Мероприятий пока нет</p><button onClick={() => openModal()} className="btn-primary">Добавить первое мероприятие</button></div>
      ) : (
        <div className="space-y-4">
          {events.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-accent-red flex flex-col items-center justify-center text-white flex-shrink-0">
                    <span className="text-xs font-medium">{format(new Date(item.event_date), 'MMM', { locale: ru })}</span>
                    <span className="text-lg font-bold leading-none">{format(new Date(item.event_date), 'd')}</span>
                  </div>
                  <div>
                    <h3 className={cn("font-semibold mb-1", item.is_visible ? "text-dark-900 dark:text-white" : "text-dark-400")}>{item.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-dark-500">
                      {item.event_time && <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{item.event_time}</span>}
                      {item.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{item.location}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleVisibility(item)} className={cn("p-2 rounded-lg transition-colors", item.is_visible ? "hover:bg-dark-100 dark:hover:bg-dark-800" : "bg-dark-100 dark:bg-dark-800")}>
                    {item.is_visible ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-dark-400" />}
                  </button>
                  <button onClick={() => openModal(item)} className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800"><Edit2 className="w-5 h-5 text-primary-500" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-500/10"><Trash2 className="w-5 h-5 text-red-500" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg bg-white dark:bg-dark-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-dark-200 dark:border-dark-700">
              <h2 className="text-xl font-semibold">{editingItem ? 'Редактировать' : 'Новое мероприятие'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium mb-2">Название</label><input {...register('title', { required: true })} className={cn('input-field', errors.title && 'border-red-500')} placeholder="Название мероприятия" /></div>
              <div><label className="block text-sm font-medium mb-2">Описание</label><textarea {...register('description')} rows={3} className="input-field resize-none" placeholder="Описание" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-2">Дата</label><input type="date" {...register('event_date', { required: true })} className={cn('input-field', errors.event_date && 'border-red-500')} /></div>
                <div><label className="block text-sm font-medium mb-2">Время</label><input type="time" {...register('event_time')} className="input-field" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-2">Место проведения</label><input {...register('location')} className="input-field" placeholder="Город, место" /></div>
              <div><label className="block text-sm font-medium mb-2">Тип мероприятия</label><input {...register('event_type')} className="input-field" placeholder="Соревнование, мастер-класс..." /></div>
              <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" {...register('is_visible')} className="w-5 h-5 rounded border-dark-300 text-primary-500 focus:ring-primary-500" /><span className="text-sm">Показывать на сайте</span></label>
              <div className="flex gap-3 pt-4"><button type="button" onClick={closeModal} className="btn-secondary flex-1">Отмена</button><button type="submit" disabled={isSubmitting} className="btn-primary flex-1">{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Сохранить'}</button></div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
