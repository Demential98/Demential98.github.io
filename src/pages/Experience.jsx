import { useTranslation } from 'react-i18next';
import ExperienceGraph from '../components/ExperienceGraph';

export default function Experience() {
  const { t } = useTranslation();
  return (
    <div className="p-4 flex flex-col h-full">
      <h1 className="text-3xl mb-6 text-center">{t('experience_title')}</h1>
      <div className="flex-1 min-h-[500px]">
        <ExperienceGraph />
      </div>
    </div>
  );
}
