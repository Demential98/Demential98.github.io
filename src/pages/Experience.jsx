import { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useTranslation } from 'react-i18next';

export default function Experience() {
  const { t } = useTranslation();
  const [graph, setGraph] = useState(null);
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    fetch('/experience.json')
      .then((res) => res.json())
      .then((data) => setGraph(data))
      .catch(() => setGraph({ nodes: [], links: [] }));
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (!graph) {
    return <div className="p-4">{t('experience_loading')}</div>;
  }

  return (
    <div className="flex h-full">
      <aside className="w-64 p-4 border-r overflow-y-auto">
        <h1 className="text-3xl mb-6">{t('experience_title')}</h1>
        <ul className="space-y-2">
          {graph.nodes.map((n) => (
            <li key={n.id}>
              <button
                className="text-left w-full hover:underline"
                onClick={() => setSelected(n)}
              >
                {n.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className="flex-1 relative" ref={containerRef}>
        {graph.nodes.length > 0 && (
          <ForceGraph2D
            graphData={graph}
            width={size.width}
            height={size.height}
            nodeLabel="title"
            onNodeClick={(node) => setSelected(node)}
          />
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
