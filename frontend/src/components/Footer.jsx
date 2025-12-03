import { Link } from 'react-router-dom'
import { Mail, Send, MapPin, ExternalLink } from 'lucide-react'
import logoImage from '@assets/лого_1764723945323.png'

const footerLinks = {
  navigation: [
    { name: 'Главная', href: '/' },
    { name: 'Руководство', href: '/leadership' },
    { name: 'Сборная', href: '/team' },
    { name: 'Документы', href: '/documents' },
  ],
  resources: [
    { name: 'Мероприятия', href: '/events' },
    { name: 'Новости', href: '/news' },
    { name: 'Контакты', href: '/contacts' },
  ],
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-dark-950 text-dark-300 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-yellow/10 rounded-full blur-3xl" />

      <div className="relative container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img src={logoImage} alt="ФСП Чувашии" className="h-14" />
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed mb-6">
              Федерация спортивного программирования по Чувашской Республике — развитие инновационного вида спорта в регионе.
            </p>
            <div className="flex gap-3">
              <a
                href="https://t.me/fspchuv"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-dark-800/50 hover:bg-primary-500/20 hover:text-primary-400 transition-all duration-200"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="mailto:chuvashia@fsp-russia.ru"
                className="p-3 rounded-xl bg-dark-800/50 hover:bg-primary-500/20 hover:text-primary-400 transition-all duration-200"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Навигация</h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-dark-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Ресурсы</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-dark-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Контакты</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-dark-500">Email</p>
                  <a
                    href="mailto:chuvashia@fsp-russia.ru"
                    className="text-dark-300 hover:text-primary-400 transition-colors"
                  >
                    chuvashia@fsp-russia.ru
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Send className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-dark-500">Telegram</p>
                  <a
                    href="https://t.me/fspchuv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-300 hover:text-primary-400 transition-colors flex items-center gap-1"
                  >
                    @fspchuv <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-dark-500">Регион</p>
                  <p className="text-dark-300">Чувашская Республика</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-dark-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-dark-500 text-sm">
              &copy; {currentYear} РФСОО «ФСП по Чувашской Республике». Все права защищены.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a
                href="https://fsp-russia.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-500 hover:text-primary-400 transition-colors flex items-center gap-1"
              >
                ФСП России <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
