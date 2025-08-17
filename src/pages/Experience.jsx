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

function SideBranch({ quests, onSelect, presentText, align }) {
  return (
    <div className="mt-4 space-y-4">
      {quests.map((child) => (
        <div
          key={child.id}
          className={`relative ${align === 'left' ? 'pl-6' : 'pr-6'}`}
        >
          {align === 'left' ? (
            <>
              <div className="absolute left-0 top-2 w-6 h-px bg-neutral-500" />
              <div className="absolute left-0 top-2 bottom-0 border-l border-neutral-500" />
            </>
          ) : (
            <>
              <div className="absolute right-0 top-2 w-6 h-px bg-neutral-500" />
              <div className="absolute right-0 top-2 bottom-0 border-r border-neutral-500" />
            </>
          )}
          <QuestCard
            quest={child}
            onSelect={onSelect}
            presentText={presentText}
          />
        </div>
      ))}
    </div>
  );
}

function TimelineItem({ quest, isLeft, onSelect, presentText }) {
  const dotColor =
    quest.type === 'main' ? 'bg-yellow-500' : 'bg-neutral-500';
  return (
    <div className="flex w-full items-start">
      {isLeft && (
        <div className="w-1/2 pr-8 flex flex-col items-end">
          <QuestCard
            quest={quest}
            onSelect={onSelect}
            presentText={presentText}
          />
          {quest.children.length > 0 && (
            <SideBranch
              quests={quest.children}
              onSelect={onSelect}
              presentText={presentText}
              align="right"
            />
          )}
        </div>
      )}
      {!isLeft && <div className="w-1/2" />}
      <div className="w-8 flex justify-center">
        <div className={`w-4 h-4 rounded-full ${dotColor}`} />
      </div>
      {isLeft && <div className="w-1/2" />}
      {!isLeft && (
        <div className="w-1/2 pl-8 flex flex-col items-start">
          <QuestCard
            quest={quest}
            onSelect={onSelect}
            presentText={presentText}
          />
          {quest.children.length > 0 && (
            <SideBranch
              quests={quest.children}
              onSelect={onSelect}
              presentText={presentText}
              align="left"
            />
          )}
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

  const sorted = [...roots].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl mb-6">{t('experience_title')}</h1>
      <div className="relative w-full max-w-4xl">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-yellow-500" />
        <div className="space-y-12">
          {sorted.map((q, i) => (
            <TimelineItem
              key={q.id}
              quest={q}
              isLeft={i % 2 === 0}
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

