import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  return <h1 className="text-3xl">{t('welcome_message')}</h1>;
}
