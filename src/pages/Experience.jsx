import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Experience() {
  const { t } = useTranslation();
  const [mainQuests, setMainQuests] = useState(null);
  const [sideQuests, setSideQuests] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('/quests.json')
      .then((res) => res.json())
      .then((data) => {
        setMainQuests(data.mainQuests || []);
        setSideQuests(data.sideQuests || []);
      })
      .catch(() => {
        setMainQuests([]);
        setSideQuests([]);
      });
  }, []);

  if (!mainQuests || !sideQuests) {
    return <div className="p-4">{t('experience_loading')}</div>;
  }

  const grouped = sideQuests.reduce((acc, q) => {
    const key = q.father || 'unlinked';
    if (!acc[key]) acc[key] = [];
    acc[key].push(q);
    return acc;
  }, {});

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl mb-6">{t('experience_title')}</h1>
      <div className="relative w-full max-w-4xl overflow-x-auto pb-8">
        <div className="absolute top-8 left-0 h-0.5 w-full bg-yellow-500" />
        <div className="flex justify-between items-start gap-8">
          {mainQuests.map((mq) => (
            <div key={mq.id} className="flex flex-col items-center flex-1 min-w-[200px]">
              <div
                className="relative mb-4 cursor-pointer"
                onClick={() => setSelected(mq)}
              >
                <div className="p-4 border-2 border-yellow-500 rounded-lg bg-white dark:bg-neutral-900">
                  <h2 className="text-xl font-semibold">{mq.title}</h2>
                  <p className="text-sm text-neutral-500">
                    {mq.startDate} – {mq.endDate || t('experience_present')}
                  </p>
                  <p className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    {mq.description}
                  </p>
                </div>
              </div>
              {(grouped[mq.id] || []).map((sq) => (
                <div key={sq.id} className="relative mt-4">
                  <span className="absolute -top-4 left-1/2 w-px h-4 bg-yellow-500" />
                  <div
                    className="p-4 border rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-500"
                    onClick={() => setSelected(sq)}
                  >
                    <h3 className="font-semibold">{sq.title}</h3>
                    <p className="text-sm text-neutral-500">
                      {sq.startDate} – {sq.endDate || t('experience_present')}
                    </p>
                    <p className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
                      {sq.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {grouped.unlinked && (
        <div className="grid gap-4 w-full max-w-4xl md:grid-cols-2">
          {grouped.unlinked.map((q) => (
            <div
              key={q.id}
              className="p-4 border rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-500"
              onClick={() => setSelected(q)}
            >
              <h2 className="text-xl font-semibold">{q.title}</h2>
              <p className="text-sm text-neutral-500">
                {q.startDate} – {q.endDate || t('experience_present')}
              </p>
              <p className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
                {q.description}
              </p>
            </div>
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
