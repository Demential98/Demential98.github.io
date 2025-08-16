import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function QuestCard({ quest, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-neutral-800 rounded p-4 hover:bg-neutral-700 transition-colors flex flex-col"
    >
      {quest.image && (
        <img
          src={quest.image}
          alt=""
          className="mb-2 h-40 w-full object-cover rounded"
        />
      )}
      <h3 className="text-lg font-bold mb-1">{quest.title}</h3>
      <p className="text-sm text-neutral-400">
        {quest.start} – {quest.end}
      </p>
    </div>
  );
}

function QuestModal({ quest, onClose, t }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-6 rounded max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl leading-none"
        >
          ×
        </button>
        <h3 className="text-xl font-bold mb-2">{quest.title}</h3>
        <p className="text-sm mb-4 text-neutral-400">
          {quest.start} – {quest.end}
        </p>
        {quest.image && (
          <img
            src={quest.image}
            alt=""
            className="mb-4 w-full object-cover rounded"
          />
        )}
        <p className="mb-4 whitespace-pre-line">{quest.description}</p>
        {quest.url && (
          <a
            href={quest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            {t('experience_view_more')}
          </a>
        )}
      </div>
    </div>
  );
}

export default function Experience() {
  const { t } = useTranslation();
  const [quests, setQuests] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('/data/experience.json')
      .then((res) => res.json())
      .then((data) => setQuests(data.quests))
      .catch((err) => console.error('Failed to load quests', err));
  }, []);

  const mainQuests = quests.filter((q) => q.type === 'main');
  const sideQuests = quests.filter((q) => q.type === 'side');

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <h1 className="text-3xl mb-6 text-center">{t('experience_title')}</h1>

      <section className="mb-10">
        <h2 className="text-2xl mb-4">{t('experience_main_quests')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {mainQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onClick={() => setSelected(quest)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl mb-4">{t('experience_side_quests')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {sideQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onClick={() => setSelected(quest)}
            />
          ))}
        </div>
      </section>

      {selected && (
        <QuestModal quest={selected} onClose={() => setSelected(null)} t={t} />
      )}
    </div>
  );
}
