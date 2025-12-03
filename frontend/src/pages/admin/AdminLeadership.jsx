import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Plus, Edit2, Trash2, X, Eye, EyeOff, Loader2, Crown } from 'lucide-react'
import { leadershipAPI } from '../../utils/api'
import { cn } from '../../utils/cn'

export default function AdminLeadership() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => { fetchMembers() }, [])

  const fetchMembers = async () => {
    try {
      const response = await leadershipAPI.getAll({ include_hidden: true })
      setMembers(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (item = null) => {
    setEditingItem(item)
    if (item) {
      reset({ full_name: item.full_name, position: item.position, description: item.description || '', order: item.order, is_visible: item.is_visible })
    } else {
      reset({ full_name: '', position: '', description: '', order: 0, is_visible: true })
    }
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditingItem(null); reset() }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      data.order = parseInt(data.order) || 0
      if (editingItem) { await leadershipAPI.update(editingItem.id, data) } else { await leadershipAPI.create(data) }
      fetchMembers(); closeModal()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить?')) return
    try { await leadershipAPI.delete(id); fetchMembers() } catch (error) { console.error('Error:', error) }
  }

  const toggleVisibility = async (item) => {
    try { await leadershipAPI.update(item.id, { is_visible: !item.is_visible }); fetchMembers() } catch (error) { console.error('Error:', error) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Руководство</h1>
          <p className="text-dark-600 dark:text-dark-400">Управление составом руководства</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary"><Plus className="w-5 h-5 mr-2" />Добавить</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" /></div>
      ) : members.length === 0 ? (
        <div className="text-center py-20 card"><p className="text-dark-500 mb-4">Руководства пока нет</p><button onClick={() => openModal()} className="btn-primary">Добавить</button></div>
      ) : (
        <div className="space-y-4">
          {members.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-yellow to-primary-500 flex items-center justify-center flex-shrink-0">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={cn("font-semibold", item.is_visible ? "text-dark-900 dark:text-white" : "text-dark-400")}>{item.full_name}</h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400">{item.position}</p>
                    {item.description && <p className="text-sm text-dark-500 mt-1">{item.description}</p>}
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
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg bg-white dark:bg-dark-900 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-dark-200 dark:border-dark-700">
              <h2 className="text-xl font-semibold">{editingItem ? 'Редактировать' : 'Новый член руководства'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium mb-2">ФИО / Название</label><input {...register('full_name', { required: true })} className={cn('input-field', errors.full_name && 'border-red-500')} placeholder="Иванов Иван Иванович" /></div>
              <div><label className="block text-sm font-medium mb-2">Должность</label><input {...register('position', { required: true })} className={cn('input-field', errors.position && 'border-red-500')} placeholder="Президент" /></div>
              <div><label className="block text-sm font-medium mb-2">Описание</label><textarea {...register('description')} rows={3} className="input-field resize-none" placeholder="Дополнительная информация" /></div>
              <div><label className="block text-sm font-medium mb-2">Порядок отображения</label><input type="number" {...register('order')} className="input-field" /></div>
              <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" {...register('is_visible')} className="w-5 h-5 rounded border-dark-300 text-primary-500 focus:ring-primary-500" /><span className="text-sm">Показывать на сайте</span></label>
              <div className="flex gap-3 pt-4"><button type="button" onClick={closeModal} className="btn-secondary flex-1">Отмена</button><button type="submit" disabled={isSubmitting} className="btn-primary flex-1">{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Сохранить'}</button></div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
