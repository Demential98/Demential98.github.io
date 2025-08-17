import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function QuestNode({ quest, onSelect, t }) {
  return (
    <div className="relative pl-6 mb-6">
      <span className={`absolute left-0 top-4 w-3 h-3 rounded-full ${quest.type === 'main' ? 'bg-yellow-500' : 'bg-neutral-500'}`}></span>
      <div
        className={`ml-4 p-4 border rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 ${quest.type === 'main' ? 'border-yellow-500' : 'border-neutral-500'}`}
        onClick={() => onSelect(quest)}
      >
        <h3 className="text-xl font-semibold">{quest.title}</h3>
        <p className="text-sm text-neutral-500">
          {quest.startDate} – {quest.endDate || t('experience_present')}
        </p>
        <p className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap">{quest.description}</p>
      </div>
      {quest.children && quest.children.length > 0 && (
        <div className="ml-6 border-l-2 border-neutral-500">
          {quest.children.map(child => (
            <QuestNode key={child.id} quest={child} onSelect={onSelect} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function QuestCard({ quest, onSelect, t }) {
  return (
    <div
      className={`p-4 border rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 ${quest.type === 'main' ? 'border-yellow-500' : 'border-neutral-500'}`}
      onClick={() => onSelect(quest)}
    >
      <h2 className="text-xl font-semibold">{quest.title}</h2>
      <p className="text-sm text-neutral-500">
        {quest.startDate} – {quest.endDate || t('experience_present')}
      </p>
      <p className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap">{quest.description}</p>
    </div>
  );
}

export default function Experience() {
  const { t } = useTranslation();
  const [quests, setQuests] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('/quests.json')
      .then(res => res.json())
      .then(data => {
        const list = data.quests || [];
        const map = {};
        list.forEach(q => {
          map[q.id] = { ...q, children: [] };
        });
        list.forEach(q => {
          if (q.father && map[q.father]) {
            map[q.father].children.push(map[q.id]);
          }
        });
        const chains = {};
        const others = [];
        Object.values(map).forEach(q => {
          if (q.father && map[q.father]) return;
          if (q.type === 'main') {
            const chain = q.chain || 1;
            if (!chains[chain]) chains[chain] = [];
            chains[chain].push(q);
          } else if (!q.father) {
            others.push(q);
          }
        });
        Object.values(chains).forEach(arr => arr.sort((a, b) => (a.order || 0) - (b.order || 0)));
        setQuests({ chains, others });
      })
      .catch(() => setQuests({ chains: {}, others: [] }));
  }, []);

  if (!quests) {
    return <div className="p-4">{t('experience_loading')}</div>;
  }

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl mb-6">{t('experience_title')}</h1>

      {Object.entries(quests.chains).map(([chainId, nodes]) => (
        <div key={chainId} className="w-full max-w-4xl mb-10">
          <h2 className="text-2xl mb-4">{t('experience_main', { id: chainId })}</h2>
          <div className="relative ml-4">
            <div className="absolute left-0 top-0 bottom-0 border-l-2 border-yellow-500"></div>
            {nodes.map(node => (
              <QuestNode key={node.id} quest={node} onSelect={setSelected} t={t} />
            ))}
          </div>
        </div>
      ))}

      {quests.others.length > 0 && (
        <div className="grid gap-4 w-full max-w-4xl md:grid-cols-2">
          {quests.others.map(q => (
            <QuestCard key={q.id} quest={q} onSelect={setSelected} t={t} />
          ))}
        </div>
      )}

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
