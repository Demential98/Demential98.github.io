import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  return <h1 className="text-3xl">{t('about')} Page</h1>;
}
