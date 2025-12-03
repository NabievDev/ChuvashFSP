import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Download, Folder, FolderOpen, ChevronDown, File } from 'lucide-react'
import { documentsAPI } from '../utils/api'
import SectionTitle from '../components/SectionTitle'

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
    <div className={level > 0 ? 'ml-6' : ''}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors group"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-yellow/20 flex items-center justify-center group-hover:scale-105 transition-transform">
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? 'open' : 'closed'}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? (
                <FolderOpen className="w-6 h-6 text-primary-500" />
              ) : (
                <Folder className="w-6 h-6 text-primary-500" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <span className="flex-grow text-left font-semibold text-dark-900 dark:text-white text-lg">
          {category.name}
        </span>
        {hasContent && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-dark-400" />
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && hasContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="relative ml-6 pl-6 border-l-2 border-dashed border-primary-500/30">
              {category.children?.map((child, index) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CategoryItem category={child} level={level + 1} />
                </motion.div>
              ))}

              {category.documents?.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (category.children?.length || 0) * 0.05 + index * 0.05 }}
                  className="relative py-2"
                >
                  <div className="absolute -left-[25px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-primary-500 to-accent-orange border-2 border-white dark:border-dark-900" />
                  
                  <div className="absolute -left-[9px] top-1/2 w-6 h-px bg-gradient-to-r from-primary-500/50 to-transparent" />
                  
                  <a
                    href={`/api/documents/${doc.id}/download`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-dark-800/50 border border-dark-200/50 dark:border-dark-700/50 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-dark-100 dark:bg-dark-700 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors">
                      <File className="w-5 h-5 text-dark-500 dark:text-dark-400 group-hover:text-primary-500 transition-colors" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-medium text-dark-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {doc.title}
                      </p>
                      <p className="text-sm text-dark-500">
                        {doc.filename} {doc.file_size && `• ${formatFileSize(doc.file_size)}`}
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-dark-400 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
            <SectionTitle subtitle="Официальные материалы">
              Документы
            </SectionTitle>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto text-lg -mt-8">
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
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
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
