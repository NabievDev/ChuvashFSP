import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Upload, Folder, File, X, Loader2 } from 'lucide-react'
import { documentsAPI } from '../../utils/api'
import { cn } from '../../utils/cn'

export default function AdminDocuments() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [uploadData, setUploadData] = useState({ title: '', file: null })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    try {
      const response = await documentsAPI.getCategories()
      setCategories(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return
    setIsSubmitting(true)
    try {
      await documentsAPI.createCategory({ name: newCategoryName })
      setNewCategoryName('')
      setShowCategoryModal(false)
      fetchCategories()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!confirm('Удалить категорию?')) return
    try {
      await documentsAPI.deleteCategory(id)
      fetchCategories()
    } catch (error) {
      console.error('Error:', error)
      alert('Невозможно удалить категорию с документами')
    }
  }

  const handleUpload = async () => {
    if (!uploadData.title || !uploadData.file || !selectedCategory) return
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('file', uploadData.file)
      formData.append('title', uploadData.title)
      formData.append('category_id', selectedCategory.id)
      await documentsAPI.upload(formData)
      setUploadData({ title: '', file: null })
      setShowUploadModal(false)
      fetchCategories()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteDocument = async (id) => {
    if (!confirm('Удалить документ?')) return
    try {
      await documentsAPI.delete(id)
      fetchCategories()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const openUploadModal = (category) => {
    setSelectedCategory(category)
    setShowUploadModal(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Документы</h1>
          <p className="text-dark-600 dark:text-dark-400">Управление документами и категориями</p>
        </div>
        <button onClick={() => setShowCategoryModal(true)} className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />Добавить категорию
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" /></div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 card"><p className="text-dark-500 mb-4">Категорий пока нет</p><button onClick={() => setShowCategoryModal(true)} className="btn-primary">Создать первую категорию</button></div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <motion.div key={category.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <Folder className="w-5 h-5 text-primary-500" />
                  </div>
                  <h3 className="font-semibold text-dark-900 dark:text-white">{category.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openUploadModal(category)} className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800" title="Загрузить документ">
                    <Upload className="w-5 h-5 text-primary-500" />
                  </button>
                  <button onClick={() => handleDeleteCategory(category.id)} className="p-2 rounded-lg hover:bg-red-500/10" title="Удалить категорию">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
              {category.documents?.length > 0 && (
                <div className="space-y-2 ml-13">
                  {category.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-dark-50 dark:bg-dark-800/50">
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-dark-400" />
                        <div>
                          <p className="font-medium text-dark-900 dark:text-white">{doc.title}</p>
                          <p className="text-sm text-dark-500">{doc.filename}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteDocument(doc.id)} className="p-2 rounded-lg hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white dark:bg-dark-900 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-dark-200 dark:border-dark-700">
              <h2 className="text-xl font-semibold">Новая категория</h2>
              <button onClick={() => setShowCategoryModal(false)} className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium mb-2">Название категории</label><input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="input-field" placeholder="Например: Учредительные документы" /></div>
              <div className="flex gap-3 pt-4"><button onClick={() => setShowCategoryModal(false)} className="btn-secondary flex-1">Отмена</button><button onClick={handleCreateCategory} disabled={isSubmitting || !newCategoryName.trim()} className="btn-primary flex-1">{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Создать'}</button></div>
            </div>
          </motion.div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white dark:bg-dark-900 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-dark-200 dark:border-dark-700">
              <h2 className="text-xl font-semibold">Загрузить документ</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-dark-500">Категория: <span className="font-medium text-dark-900 dark:text-white">{selectedCategory?.name}</span></p>
              <div><label className="block text-sm font-medium mb-2">Название документа</label><input value={uploadData.title} onChange={(e) => setUploadData({...uploadData, title: e.target.value})} className="input-field" placeholder="Устав организации" /></div>
              <div>
                <label className="block text-sm font-medium mb-2">Файл</label>
                <input type="file" ref={fileInputRef} onChange={(e) => setUploadData({...uploadData, file: e.target.files?.[0] || null})} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx" />
                <button onClick={() => fileInputRef.current?.click()} className={cn("w-full p-4 rounded-xl border-2 border-dashed transition-colors", uploadData.file ? "border-primary-500 bg-primary-500/5" : "border-dark-200 dark:border-dark-700 hover:border-primary-500")}>
                  {uploadData.file ? <span className="text-primary-600">{uploadData.file.name}</span> : <span className="text-dark-500">Нажмите для выбора файла</span>}
                </button>
              </div>
              <div className="flex gap-3 pt-4"><button onClick={() => setShowUploadModal(false)} className="btn-secondary flex-1">Отмена</button><button onClick={handleUpload} disabled={isSubmitting || !uploadData.title || !uploadData.file} className="btn-primary flex-1">{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Загрузить'}</button></div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
