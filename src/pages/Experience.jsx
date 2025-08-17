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
      className={`p-4 border rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
        quest.type === 'main' ? 'border-yellow-500' : 'border-neutral-500'
      }`}
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

function SideQuestNode({ quest, side, onSelect, presentText }) {
  return (
    <div className="relative w-full flex">
      {side === 'left' && (
        <div className="w-1/2 pr-8 flex justify-end">
          <div className="relative">
            <QuestCard
              quest={quest}
              onSelect={onSelect}
              presentText={presentText}
            />
            <div className="absolute top-6 right-[-32px] w-8 h-px bg-neutral-500" />
            {quest.children.length > 0 && (
              <div className="mt-4 mr-4 pr-4 border-r border-neutral-500">
                {quest.children.map((child) => (
                  <SideQuestNode
                    key={child.id}
                    quest={child}
                    side={side}
                    onSelect={onSelect}
                    presentText={presentText}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 bg-yellow-500 rounded-full" />
      </div>
      {side === 'right' && (
        <div className="w-1/2 pl-8">
          <div className="relative">
            <QuestCard
              quest={quest}
              onSelect={onSelect}
              presentText={presentText}
            />
            <div className="absolute top-6 left-[-32px] w-8 h-px bg-neutral-500" />
            {quest.children.length > 0 && (
              <div className="mt-4 ml-4 pl-4 border-l border-neutral-500">
                {quest.children.map((child) => (
                  <SideQuestNode
                    key={child.id}
                    quest={child}
                    side={side}
                    onSelect={onSelect}
                    presentText={presentText}
                  />
                ))}
              </div>
            )}
          </div>
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

  const centralRoot = roots.find((q) => q.id === 'main1');
  const sideRoots = roots.filter((q) => q.id !== 'main1');
  const sideNodes = [
    ...(centralRoot ? centralRoot.children : []),
    ...sideRoots,
  ].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl mb-6">{t('experience_title')}</h1>
      <div className="relative w-full max-w-4xl">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-yellow-500" />
        <div className="space-y-12">
          {centralRoot && (
            <div className="flex justify-center">
              <QuestCard
                quest={centralRoot}
                onSelect={setSelected}
                presentText={t('experience_present')}
              />
            </div>
          )}

          {sideNodes.map((q, idx) => (
            <SideQuestNode
              key={q.id}
              quest={q}
              side={idx % 2 === 0 ? 'left' : 'right'}
              onSelect={setSelected}
              presentText={t('experience_present')}
            />
          ))}
        </div>
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

