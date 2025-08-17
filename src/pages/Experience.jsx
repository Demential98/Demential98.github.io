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

  function sortNodes(nodes) {
    nodes.sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate),
    );
    nodes.forEach((n) => sortNodes(n.children));
  }

  sortNodes(roots);
  return roots;
}

function QuestNode({ quest, onSelect, presentText, isChild = false }) {
  return (
    <div className={isChild ? 'relative pl-6 mt-6' : 'relative'}>
      {isChild && (
        <>
          <div className="absolute left-0 top-6 w-6 h-px bg-neutral-500" />
          <div className="absolute left-0 top-6 bottom-0 border-l border-neutral-500" />
        </>
      )}
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
      {quest.children.length > 0 && (
        <div className="ml-6">
          {quest.children.map((child) => (
            <QuestNode
              key={child.id}
              quest={child}
              onSelect={onSelect}
              presentText={presentText}
              isChild
            />
          ))}
        </div>
      )}
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

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="mb-6 text-3xl">{t('experience_title')}</h1>
      <div className="relative w-full max-w-4xl">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-yellow-500" />
        <div className="space-y-12">
          {roots.map((q, idx) => (
            <div key={q.id} className="relative flex w-full">
              {idx % 2 === 0 ? (
                <div className="w-1/2 pr-8 flex justify-end">
                  <QuestNode
                    quest={q}
                    onSelect={setSelected}
                    presentText={t('experience_present')}
                  />
                </div>
              ) : (
                <div className="w-1/2" />
              )}

              <div
                className={`absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-neutral-900 ${
                  q.type === 'main' ? 'bg-yellow-500' : 'bg-neutral-500'
                }`}
              />
              <div
                className={`absolute top-6 left-1/2 w-1/2 h-px ${
                  q.type === 'main' ? 'bg-yellow-500' : 'bg-neutral-500'
                } ${idx % 2 === 0 ? '-translate-x-full' : ''}`}
              />

              {idx % 2 === 0 ? (
                <div className="w-1/2" />
              ) : (
                <div className="w-1/2 pl-8 flex justify-start">
                  <QuestNode
                    quest={q}
                    onSelect={setSelected}
                    presentText={t('experience_present')}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-lg w-full max-h-full overflow-y-auto rounded bg-white p-6 dark:bg-neutral-900">
            <button
              className="mb-4 w-full text-right text-sm hover:underline"
              onClick={() => setSelected(null)}
            >
              {t('experience_close')}
            </button>
            <h2 className="mb-2 text-2xl font-bold">{selected.title}</h2>
            <p className="mb-2 text-sm text-neutral-500">
              {selected.startDate} – {selected.endDate || t('experience_present')}
            </p>
            {selected.image && (
              <img
                src={selected.image}
                alt={selected.title}
                className="mb-4 w-full rounded object-cover"
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

