import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function QuestItem({ quest, onSelect, isChild, isLast, t }) {
  return (
    <div className="relative pl-8 pb-8">
      {!isLast && (
        <span className="absolute left-0 top-4 bottom-0 w-px bg-neutral-300" />
      )}
      {isChild && (
        <span className="absolute left-0 top-4 w-8 border-t border-neutral-300" />
      )}
      <span
        className={`absolute left-0 top-3 w-4 h-4 rounded-full ${
          quest.type === 'main' ? 'bg-yellow-500' : 'bg-neutral-500'
        }`}
      />
      <div className="ml-4">
        <div
          className={`p-4 border rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
            quest.type === 'main' ? 'border-yellow-500' : 'border-neutral-500'
          }`}
          onClick={() => onSelect(quest)}
        >
          <h2 className="text-xl font-semibold">{quest.title}</h2>
          <p className="text-sm text-neutral-500">
            {quest.startDate} – {quest.endDate || t('experience_present')}
          </p>
          <p className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
            {quest.description}
          </p>
        </div>
        {quest.children.length > 0 && (
          <div className="mt-4">
            {quest.children.map((child, idx) => (
              <QuestItem
                key={child.id}
                quest={child}
                onSelect={onSelect}
                isChild
                isLast={idx === quest.children.length - 1}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Experience() {
  const { t } = useTranslation();
  const [groups, setGroups] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('/quests.json')
      .then((res) => res.json())
      .then((data) => {
        const map = new Map();
        data.quests.forEach((q) => map.set(q.id, { ...q, children: [] }));
        map.forEach((q) => {
          if (q.father && map.has(q.father)) {
            map.get(q.father).children.push(q);
          }
        });
        const g = {};
        map.forEach((q) => {
          if (!q.father) {
            const groupId = q.group || 0;
            if (!g[groupId]) g[groupId] = [];
            g[groupId].push(q);
          }
        });
        Object.values(g).forEach((arr) =>
          arr.sort(
            (a, b) => new Date(a.startDate) - new Date(b.startDate)
          )
        );
        setGroups(g);
      })
      .catch(() => setGroups({}));
  }, []);

  if (!groups) {
    return <div className="p-4">{t('experience_loading')}</div>;
  }

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl mb-6">{t('experience_title')}</h1>
      <div className="flex flex-col gap-10 w-full max-w-3xl">
        {Object.entries(groups).map(([groupId, quests]) => (
          <div key={groupId} className="relative pl-4">
            <span className="absolute left-1 top-0 bottom-0 w-px bg-yellow-500" />
            {quests.map((q, idx) => (
              <QuestItem
                key={q.id}
                quest={q}
                onSelect={setSelected}
                isLast={idx === quests.length - 1}
                t={t}
              />
            ))}
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

