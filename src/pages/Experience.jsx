import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

export default function Experience() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState(null);
  const [active, setActive] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    fetch('/quests.json')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
        setActive(data.categories?.[0] || null);
      })
      .catch(() => setCategories([]));
  }, []);

  const { nodes, edges } = useMemo(() => {
    if (!active) return { nodes: [], edges: [] };
    const map = active.nodes.reduce((acc, n) => {
      acc[n.id] = n;
      return acc;
    }, {});
    const children = new Set();
    active.nodes.forEach((n) => (n.next || []).forEach((id) => children.add(id)));
    const starts = active.nodes.filter((n) => !children.has(n.id));
    const queue = starts.map((n) => ({ id: n.id, depth: 0 }));
    const visited = new Set();
    const depthMap = {};
    while (queue.length) {
      const { id, depth } = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);
      if (!depthMap[depth]) depthMap[depth] = [];
      depthMap[depth].push(id);
      (map[id].next || []).forEach((nextId) => queue.push({ id: nextId, depth: depth + 1 }));
    }
    const nodes = [];
    Object.entries(depthMap).forEach(([depthStr, ids]) => {
      const depth = Number(depthStr);
      ids.forEach((id, index) => {
        nodes.push({
          id,
          data: { label: map[id].title },
          position: { x: index * 200, y: depth * 100 },
        });
      });
    });
    const edges = [];
    active.nodes.forEach((n) =>
      (n.next || []).forEach((nextId) =>
        edges.push({ id: `${n.id}-${nextId}`, source: n.id, target: nextId })
      )
    );
    return { nodes, edges };
  }, [active]);

  if (!categories) {
    return <div className="p-4">{t('experience_loading')}</div>;
  }

  return (
    <div className="p-4 flex flex-col h-full">
      <h1 className="text-3xl mb-4 text-center">{t('experience_title')}</h1>
      <div className="flex flex-1 min-h-[500px]">
        <div className="w-48 mr-4 border-r pr-4 space-y-2">
          {categories.map((c) => (
            <button
              key={c.id}
              className={`block w-full text-left p-2 rounded ${
                active?.id === c.id
                  ? 'bg-neutral-200 dark:bg-neutral-700'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              onClick={() => setActive(c)}
            >
              {c.title}
            </button>
          ))}
        </div>
        <div className="flex-1 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            onNodeClick={(_, node) => setSelectedNode(active.nodes.find((n) => n.id === node.id))}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>

      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-200/70 bg-[var(--bg-color)] text-[var(--text-color)] shadow-2xl transition dark:border-neutral-800">
            <button
              type="button"
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-transparent bg-[var(--button-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--interactive-text)] transition hover:bg-[var(--button-bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-600"
              onClick={() => setSelectedNode(null)}
            >
              {t('experience_close')}
            </button>
            <div className="space-y-4 p-6 sm:p-8">
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-heading)]">
                  {selectedNode.title}
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  {selectedNode.startDate} – {selectedNode.endDate || t('experience_present')}
                </p>
              </div>
              {selectedNode.image && (
                <img
                  src={selectedNode.image}
                  alt={selectedNode.title}
                  className="w-full rounded-xl border border-neutral-200/70 object-cover shadow-sm dark:border-neutral-800"
                />
              )}
              <p className="whitespace-pre-line text-base leading-relaxed text-[var(--text-body)]">
                {selectedNode.description}
              </p>
              {selectedNode.url && (
                <a
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  href={selectedNode.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('experience_visit')}
                  <span aria-hidden>{'->'}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
