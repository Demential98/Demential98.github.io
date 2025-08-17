import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function buildQuestTree(list) {
  const map = {};
  list.forEach((q) => {
    map[q.id] = { ...q, children: [] };
  });
  const roots = [];
  list.forEach((q) => {
    if (q.father && map[q.father]) {
      map[q.father].children.push(map[q.id]);
    } else {
      roots.push(map[q.id]);
    }
  });
  return roots;
}

function QuestCard({ quest, onSelect, presentText }) {
  return (
    <div
      className={`p-4 border rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 ${quest.type === 'main' ? 'border-yellow-500' : 'border-neutral-500'}`}
      onClick={() => onSelect(quest)}
    >
      <h2 className="text-xl font-semibold">{quest.title}</h2>
      <p className="text-sm text-neutral-500">
        {quest.startDate} – {quest.endDate || presentText}
      </p>
      <p className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap">{quest.description}</p>
    </div>
  );
}

function MainQuestItem({ quest, index, onSelect, presentText }) {
  const side = index % 2 === 0 ? 'left' : 'right';
  return (
    <div className="relative flex items-start">
      {side === 'left' && (
        <>
          <div className="w-1/2 pr-8 flex flex-col items-end">
            <QuestCard quest={quest} onSelect={onSelect} presentText={presentText} />
            {quest.children.length > 0 && (
              <div className="mt-4 space-y-4 border-r-2 border-neutral-500 pr-4">
                {quest.children.map((child) => (
                  <QuestCard
                    key={child.id}
                    quest={child}
                    onSelect={onSelect}
                    presentText={presentText}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="w-1/2" />
        </>
      )}
      {side === 'right' && (
        <>
          <div className="w-1/2" />
          <div className="w-1/2 pl-8 flex flex-col items-start">
            <QuestCard quest={quest} onSelect={onSelect} presentText={presentText} />
            {quest.children.length > 0 && (
              <div className="mt-4 space-y-4 border-l-2 border-neutral-500 pl-4">
                {quest.children.map((child) => (
                  <QuestCard
                    key={child.id}
                    quest={child}
                    onSelect={onSelect}
                    presentText={presentText}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
      <div className="absolute left-1/2 top-6 -translate-x-1/2 w-3 h-3 rounded-full bg-yellow-500" />
      <div
        className={`absolute top-7 h-px w-8 bg-yellow-500 ${
          side === 'left' ? 'left-1/2 -translate-x-full' : 'left-1/2'
        }`}
      />
    </div>
  );
}

export default function Experience() {
  const { t } = useTranslation();
  const [roots, setRoots] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('/quests.json')
      .then((res) => res.json())
      .then((data) => setRoots(buildQuestTree(data.quests)))
      .catch(() => setRoots([]));
  }, []);

  if (!roots) {
    return <div className="p-4">{t('experience_loading')}</div>;
  }

  const mainRoots = roots.filter((q) => q.type === 'main');
  const otherRoots = roots.filter((q) => q.type !== 'main');

  mainRoots.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl mb-6">{t('experience_title')}</h1>
      <div className="w-full max-w-4xl space-y-8">
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-yellow-500" />
          <div className="space-y-12">
            {mainRoots.map((q, idx) => (
              <MainQuestItem
                key={q.id}
                quest={q}
                index={idx}
                onSelect={setSelected}
                presentText={t('experience_present')}
              />
            ))}
          </div>
        </div>

        {otherRoots.length > 0 && (
          <div className="space-y-4">
            {otherRoots.map((q) => (
              <QuestCard
                key={q.id}
                quest={q}
                onSelect={setSelected}
                presentText={t('experience_present')}
              />
            ))}
          </div>
        )}
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


