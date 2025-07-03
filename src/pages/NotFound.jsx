import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
    >
      <AlertTriangle className="w-16 h-16 text-red-500 dark:text-red-400 mb-4 animate-bounce" />
      <h1 className="text-5xl font-bold text-[var(--text-color)]">404</h1>
      <p className="text-lg mt-2 text-[var(--text-color)] opacity-70">
        {t('not_found_message', 'Oops! The page you\'re looking for doesn\'t exist.')}
      </p>

      <Button to="/" variant="primary" className="mt-6">
        {t('go_home', 'Go back home')}
      </Button>
    </motion.div>
  );
}