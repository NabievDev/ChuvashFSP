import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Mail, Send, MapPin, Phone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { contactAPI } from '../utils/api'
import { cn } from '../utils/cn'

export default function Contacts() {
  const [submitStatus, setSubmitStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSubmitStatus(null)
    
    try {
      await contactAPI.send(data)
      setSubmitStatus('success')
      reset()
    } catch (error) {
      console.error('Error sending message:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
              <Mail className="w-4 h-4" />
              Связь с федерацией
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Контакты</span>
            </h1>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto text-lg">
              Свяжитесь с нами для сотрудничества, вопросов или предложений
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-dark-950">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-8">
                Свяжитесь с нами
              </h2>

              <div className="space-y-6 mb-12">
                <a
                  href="mailto:chuvashia@fsp-russia.ru"
                  className="flex items-start gap-4 p-6 card-hover group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-accent-red flex items-center justify-center flex-shrink-0">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      Email
                    </h3>
                    <p className="text-dark-600 dark:text-dark-400">
                      chuvashia@fsp-russia.ru
                    </p>
                  </div>
                </a>

                <a
                  href="https://t.me/fspchuv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-6 card-hover group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-yellow to-primary-500 flex items-center justify-center flex-shrink-0">
                    <Send className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      Telegram
                    </h3>
                    <p className="text-dark-600 dark:text-dark-400">
                      @fspchuv
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-6 card">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-dark-400 to-dark-600 dark:from-dark-600 dark:to-dark-800 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900 dark:text-white mb-1">
                      Регион
                    </h3>
                    <p className="text-dark-600 dark:text-dark-400">
                      Чувашская Республика, Россия
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6 bg-gradient-to-br from-primary-500/5 to-accent-yellow/5 border-primary-500/20">
                <h3 className="font-semibold text-dark-900 dark:text-white mb-2">
                  Официальное наименование
                </h3>
                <p className="text-dark-600 dark:text-dark-400 text-sm leading-relaxed">
                  Региональная физкультурно-спортивная общественная организация 
                  «Федерация спортивного программирования по Чувашской Республике»
                </p>
                <p className="text-primary-600 dark:text-primary-400 text-sm mt-2 font-medium">
                  РФСОО «ФСП по Чувашской Республике»
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">
                  Напишите нам
                </h2>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <p className="text-green-700 dark:text-green-400">
                      Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.
                    </p>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 dark:text-red-400">
                      Произошла ошибка. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую.
                    </p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Ваше имя *
                    </label>
                    <input
                      {...register('name', { required: 'Введите ваше имя' })}
                      type="text"
                      className={cn(
                        'input-field',
                        errors.name && 'border-red-500 focus:ring-red-500'
                      )}
                      placeholder="Иван Иванов"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Email *
                    </label>
                    <input
                      {...register('email', {
                        required: 'Введите email',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Неверный формат email'
                        }
                      })}
                      type="email"
                      className={cn(
                        'input-field',
                        errors.email && 'border-red-500 focus:ring-red-500'
                      )}
                      placeholder="ivan@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Тема
                    </label>
                    <input
                      {...register('subject')}
                      type="text"
                      className="input-field"
                      placeholder="Тема сообщения"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Сообщение *
                    </label>
                    <textarea
                      {...register('message', { required: 'Введите сообщение' })}
                      rows={5}
                      className={cn(
                        'input-field resize-none',
                        errors.message && 'border-red-500 focus:ring-red-500'
                      )}
                      placeholder="Ваше сообщение..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        Отправить сообщение
                        <Send className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
