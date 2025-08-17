import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Experience() {
  const { t } = useTranslation();
  const [quests, setQuests] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('/quests.json')
      .then((res) => res.json())
      .then((data) => setQuests([data.mainQuest, ...data.sideQuests]))
      .catch(() => setQuests([]));
  }, []);

  if (!quests) {
    return <div className="p-4">{t('experience_loading')}</div>;
  }

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl mb-6">{t('experience_title')}</h1>
      <div className="grid gap-4 w-full max-w-4xl md:grid-cols-2">
        {quests.map((q) => (
          <div
            key={q.id}
            className={`p-4 border rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 ${q.type === 'main' ? 'border-yellow-500' : 'border-neutral-500'}`}
            onClick={() => setSelected(q)}
          >
            <h2 className="text-xl font-semibold">{q.title}</h2>
            <p className="text-sm text-neutral-500">
              {q.startDate} – {q.endDate || t('experience_present')}
            </p>
            <p className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap">{q.description}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded max-w-lg w-full overflow-y-auto max-h-full">
            <button
              className="mb-4 text-sm text-right w-full hover:underline"
              onClick={() => setSelected(null)}
            >
              {t('experience_close')}
            </button>
            <h2 className="text-2xl font-bold mb-2">{selected.title}</h2>
            <p className="text-sm text-neutral-500 mb-2">
              {selected.startDate} – {selected.endDate || t('experience_present')}
            </p>
            {selected.image && (
              <img
                src={selected.image}
                alt={selected.title}
                className="mb-4 rounded w-full object-cover"
              />
            )}
            <p className="mb-4 whitespace-pre-line">{selected.description}</p>
            {selected.url && (
              <a
                className="text-blue-500 hover:underline"
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('experience_visit')}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
