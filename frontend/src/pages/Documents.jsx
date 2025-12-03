import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Folder, FolderOpen, ChevronRight, File } from 'lucide-react'
import { documentsAPI } from '../utils/api'

function formatFileSize(bytes) {
  if (!bytes) return ''
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

function CategoryItem({ category, level = 0 }) {
  const [isOpen, setIsOpen] = useState(true)
  const hasContent = category.documents?.length > 0 || category.children?.length > 0

  return (
    <div className={`${level > 0 ? 'ml-6 border-l-2 border-dark-200 dark:border-dark-700 pl-4' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-yellow/10 flex items-center justify-center">
          {isOpen ? (
            <FolderOpen className="w-5 h-5 text-primary-500" />
          ) : (
            <Folder className="w-5 h-5 text-primary-500" />
          )}
        </div>
        <span className="flex-grow text-left font-medium text-dark-900 dark:text-white">
          {category.name}
        </span>
        {hasContent && (
          <ChevronRight
            className={`w-5 h-5 text-dark-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          />
        )}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2">
          {category.children?.map((child) => (
            <CategoryItem key={child.id} category={child} level={level + 1} />
          ))}

          {category.documents?.map((doc) => (
            <motion.a
              key={doc.id}
              href={`/api/documents/${doc.id}/download`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-4 ml-6 rounded-xl bg-white dark:bg-dark-800/50 border border-dark-200/50 dark:border-dark-700/50 hover:border-primary-500/30 hover:shadow-lg transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-dark-100 dark:bg-dark-700 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors">
                <File className="w-5 h-5 text-dark-500 dark:text-dark-400 group-hover:text-primary-500" />
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-medium text-dark-900 dark:text-white truncate">
                  {doc.title}
                </p>
                <p className="text-sm text-dark-500">
                  {doc.filename} {doc.file_size && `• ${formatFileSize(doc.file_size)}`}
                </p>
              </div>
              <Download className="w-5 h-5 text-dark-400 group-hover:text-primary-500 transition-colors flex-shrink-0" />
            </motion.a>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Documents() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await documentsAPI.getCategories()
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching documents:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              Официальные материалы
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Документы</span>
            </h1>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto text-lg">
              Учредительные и нормативные документы федерации
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-dark-950">
        <div className="container-custom max-w-4xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-2xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-dark-400" />
              </div>
              <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
                Документы пока не загружены
              </h3>
              <p className="text-dark-600 dark:text-dark-400">
                Раздел находится в процессе наполнения
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="card p-2"
                >
                  <CategoryItem category={category} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
