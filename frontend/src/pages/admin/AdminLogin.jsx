import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Lock, User, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { authAPI } from '../../utils/api'
import { cn } from '../../utils/cn'
import logoImage from '@assets/лого_1764723945323.png'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      authAPI.me()
        .then(() => navigate('/admin'))
        .catch(() => localStorage.removeItem('admin_token'))
        .finally(() => setCheckingAuth(false))
    } else {
      setCheckingAuth(false)
    }
  }, [navigate])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = isLogin
        ? await authAPI.login(data)
        : await authAPI.register(data)
      
      localStorage.setItem('admin_token', response.data.access_token)
      navigate('/admin')
    } catch (err) {
      const message = err.response?.data?.detail || 'Произошла ошибка'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 p-4">
      <div className="absolute inset-0 bg-grid opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="card p-8">
          <div className="text-center mb-8">
            <img src={logoImage} alt="ФСП Чувашии" className="h-16 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
              {isLogin ? 'Вход в админ-панель' : 'Регистрация'}
            </h1>
            <p className="text-dark-500 dark:text-dark-400">
              {isLogin
                ? 'Введите данные для входа'
                : 'Создайте первого администратора'}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Логин
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  {...register('username', { required: 'Введите логин' })}
                  type="text"
                  className={cn(
                    'input-field pl-12',
                    errors.username && 'border-red-500 focus:ring-red-500'
                  )}
                  placeholder="admin"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  {...register('password', {
                    required: 'Введите пароль',
                    minLength: isLogin ? undefined : { value: 6, message: 'Минимум 6 символов' }
                  })}
                  type="password"
                  className={cn(
                    'input-field pl-12',
                    errors.password && 'border-red-500 focus:ring-red-500'
                  )}
                  placeholder="••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isLogin ? 'Вход...' : 'Регистрация...'}
                </>
              ) : (
                isLogin ? 'Войти' : 'Зарегистрироваться'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              {isLogin
                ? 'Первый вход? Создать администратора'
                : 'Уже есть аккаунт? Войти'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-dark-200 dark:border-dark-700 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-dark-500 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться на сайт
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
