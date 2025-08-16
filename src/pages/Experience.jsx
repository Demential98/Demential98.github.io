import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function QuestCard({ quest, onClick }) {
  const { t } = useTranslation();
  const period = `${quest.startDate} - ${quest.endDate || t('present')}`;
  const snippet =
    quest.description.length > 80
      ? `${quest.description.slice(0, 80)}...`
      : quest.description;

  return (
    <div
      onClick={onClick}
      className="border rounded p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <h3 className="text-xl font-semibold">{quest.title}</h3>
      <p className="text-sm text-gray-500">{period}</p>
      <p className="mt-2 text-sm">{snippet}</p>
    </div>
  );
}

function QuestModal({ quest, onClose }) {
  const { t } = useTranslation();
  const period = `${quest.startDate} - ${quest.endDate || t('present')}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--bg-color)] text-[var(--text-color)] p-6 rounded max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="mb-4 underline">
          {t('close')}
        </button>
        <h2 className="text-2xl font-bold mb-2">{quest.title}</h2>
        <p className="text-sm text-gray-500 mb-4">{period}</p>
        {quest.image && (
          <img src={quest.image} alt={quest.title} className="mb-4 rounded" />
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
      </div>
    </div>
  );
}

export default function Experience() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('/experience.json')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div className="p-6">{t('loading')}</div>;

  return (
    <div className="p-6 overflow-y-auto">
      <h1 className="text-3xl mb-6">{t('experience')}</h1>

      <section className="mb-8">
        <h2 className="text-2xl mb-4">{t('main_quest')}</h2>
        <QuestCard quest={data.mainQuest} onClick={() => setSelected(data.mainQuest)} />
      </section>

      <section>
        <h2 className="text-2xl mb-4">{t('side_quests')}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {data.sideQuests.map((q, idx) => (
            <QuestCard key={idx} quest={q} onClick={() => setSelected(q)} />
          ))}
        </div>
      </section>

      {selected && <QuestModal quest={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

