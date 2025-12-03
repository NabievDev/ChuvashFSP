import { motion } from 'framer-motion'

export default function SectionTitle({ children, subtitle, className = '', align = 'center' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-12 md:mb-16 ${align === 'center' ? 'text-center' : ''} ${className}`}
    >
      <div className={`inline-flex items-center gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
        <motion.div
          className="hidden sm:block h-px w-12 bg-gradient-to-r from-transparent via-primary-500 to-accent-orange"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        />
        <div className="relative">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="gradient-text">{children}</span>
          </h2>
          <motion.div
            className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-orange to-accent-yellow rounded-full"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ transformOrigin: align === 'center' ? 'center' : 'left' }}
          />
        </div>
        <motion.div
          className="hidden sm:block h-px w-12 bg-gradient-to-l from-transparent via-accent-yellow to-accent-orange"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        />
      </div>
      
      <motion.div
        className="mt-4 flex items-center gap-2 justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <span className="text-primary-500 text-xl">//</span>
        <span className="text-dark-500 dark:text-dark-400 text-sm uppercase tracking-widest font-medium">
          {subtitle || 'раздел'}
        </span>
        <span className="text-accent-orange text-xl">//</span>
      </motion.div>
      
      {subtitle && (
        <motion.p
          className="mt-4 text-dark-600 dark:text-dark-400 max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
        </motion.p>
      )}
    </motion.div>
  )
}
