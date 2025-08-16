import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function QuestCard({ quest, onClick }) {
  return (
    <div
      className="p-4 border rounded shadow-sm cursor-pointer hover:shadow-md transition"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold">{quest.title}</h3>
      <p className="text-sm text-neutral-600">
        {quest.startDate} - {quest.endDate}
      </p>
    </div>
  );
}

function QuestModal({ quest, onClose }) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 p-6 rounded max-w-lg w-full overflow-auto max-h-full">
        <h3 className="text-2xl mb-2">{quest.title}</h3>
        <p className="text-sm mb-4 text-neutral-600 dark:text-neutral-300">
          {quest.startDate} - {quest.endDate}
        </p>
        {quest.image && (
          <img
            src={quest.image}
            alt={quest.title}
            className="mb-4 w-full object-cover rounded"
          />
        )}
        <p className="mb-4 whitespace-pre-line">{quest.description}</p>
        {quest.link && (
          <a
            href={quest.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {t('visit')}
          </a>
        )}
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [selectedQuest, setSelectedQuest] = useState(null);

  useEffect(() => {
    fetch('/experience.json')
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error('Failed to load experience', err));
  }, []);

  if (!data) {
    return <div className="p-4">{t('loading')}...</div>;
  }

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-3xl">{t('experience')}</h1>

      <section>
        <h2 className="text-xl mb-2">{t('main_quest')}</h2>
        <QuestCard quest={data.mainQuest} onClick={() => setSelectedQuest(data.mainQuest)} />
      </section>

      <section>
        <h2 className="text-xl mb-2">{t('side_quests')}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {data.sideQuests.map((quest) => (
            <QuestCard key={quest.title} quest={quest} onClick={() => setSelectedQuest(quest)} />
          ))}
        </div>
      </section>

      {selectedQuest && (
        <QuestModal quest={selectedQuest} onClose={() => setSelectedQuest(null)} />
      )}
    </div>
  );
}
