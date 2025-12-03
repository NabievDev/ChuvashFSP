import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  Plus, Edit2, Trash2, X, Eye, EyeOff, Loader2, Calendar, Image
} from 'lucide-react'
import { newsAPI } from '../../utils/api'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { cn } from '../../utils/cn'

export default function AdminNews() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await newsAPI.getAll({ include_hidden: true, limit: 100 })
      setNews(response.data)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (item = null) => {
    setEditingItem(item)
    if (item) {
      reset({
        title: item.title,
        content: item.content,
        image_url: item.image_url || '',
        is_visible: item.is_visible
      })
    } else {
      reset({
        title: '',
        content: '',
        image_url: '',
        is_visible: true
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
    reset()
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      if (editingItem) {
        await newsAPI.update(editingItem.id, data)
      } else {
        await newsAPI.create(data)
      }
      fetchNews()
      closeModal()
    } catch (error) {
      console.error('Error saving news:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить эту новость?')) return
    try {
      await newsAPI.delete(id)
      fetchNews()
    } catch (error) {
      console.error('Error deleting news:', error)
    }
  }

  const toggleVisibility = async (item) => {
    try {
      await newsAPI.update(item.id, { is_visible: !item.is_visible })
      fetchNews()
    } catch (error) {
      console.error('Error updating visibility:', error)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
            Новости
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            Управление новостями сайта
          </p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          Добавить
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-20 card">
          <p className="text-dark-500 dark:text-dark-400 mb-4">Новостей пока нет</p>
          <button onClick={() => openModal()} className="btn-primary">
            Добавить первую новость
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-4"
            >
              <div className="flex items-start gap-4">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt=""
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={cn(
                        "font-semibold mb-1",
                        item.is_visible
                          ? "text-dark-900 dark:text-white"
                          : "text-dark-400"
                      )}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-dark-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(item.published_at), 'd MMM yyyy, HH:mm', { locale: ru })}
                        {item.telegram_id && (
                          <span className="px-2 py-0.5 text-xs rounded bg-blue-500/10 text-blue-600">
                            Telegram
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleVisibility(item)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          item.is_visible
                            ? "hover:bg-dark-100 dark:hover:bg-dark-800"
                            : "bg-dark-100 dark:bg-dark-800"
                        )}
                        title={item.is_visible ? 'Скрыть' : 'Показать'}
                      >
                        {item.is_visible ? (
                          <Eye className="w-5 h-5 text-green-500" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-dark-400" />
                        )}
                      </button>
                      <button
                        onClick={() => openModal(item)}
                        className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                      >
                        <Edit2 className="w-5 h-5 text-primary-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-dark-600 dark:text-dark-400 mt-2 line-clamp-2">
                    {item.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white dark:bg-dark-900 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-dark-200 dark:border-dark-700">
              <h2 className="text-xl font-semibold text-dark-900 dark:text-white">
                {editingItem ? 'Редактировать новость' : 'Новая новость'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Заголовок</label>
                <input
                  {...register('title', { required: true })}
                  className={cn('input-field', errors.title && 'border-red-500')}
                  placeholder="Заголовок новости"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Содержание</label>
                <textarea
                  {...register('content', { required: true })}
                  rows={5}
                  className={cn('input-field resize-none', errors.content && 'border-red-500')}
                  placeholder="Текст новости"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">URL изображения</label>
                <input
                  {...register('image_url')}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_visible')}
                  className="w-5 h-5 rounded border-dark-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">Показывать на сайте</span>
              </label>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Отмена
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Сохранить'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
