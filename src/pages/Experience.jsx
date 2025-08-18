import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
} from 'd3-force';

export default function Experience() {
  const { t } = useTranslation();
  const [graph, setGraph] = useState(null);
  const [selected, setSelected] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

  useEffect(() => {
    fetch('/pages.json')
      .then((res) => res.json())
      .then((data) => {
        const nodes = data.nodes.map((n) => ({ ...n }));
        const links = data.links.map((l) => ({ ...l }));
        const sim = forceSimulation(nodes)
          .force('charge', forceManyBody().strength(-200))
          .force('link', forceLink(links).id((d) => d.id).distance(120))
          .force('center', forceCenter(0, 0))
          .stop();
        for (let i = 0; i < 300; i += 1) sim.tick();
        setGraph({ nodes, links });
      })
      .catch(() => setGraph({ nodes: [], links: [] }));
  }, []);

  const handlePointerDown = (e) => {
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current) return;
    setOffset({
      x: dragRef.current.ox + e.clientX - dragRef.current.x,
      y: dragRef.current.oy + e.clientY - dragRef.current.y,
    });
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  if (!graph) {
    return <div className="p-4">{t('experience_loading')}</div>;
  }

  return (
    <div className="flex h-full">
      <div className="w-48 p-4 border-r overflow-y-auto">
        {graph.nodes.map((n) => (
          <div
            key={n.id}
            className="cursor-pointer hover:underline mb-2"
            onClick={() => setSelected(n)}
          >
            {n.title}
          </div>
        ))}
      </div>
      <div
        className="flex-1 relative overflow-hidden cursor-move"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <svg
          className="absolute inset-0"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        >
          {graph.links.map((l, i) => {
            const source =
              typeof l.source === 'object'
                ? l.source
                : graph.nodes.find((n) => n.id === l.source);
            const target =
              typeof l.target === 'object'
                ? l.target
                : graph.nodes.find((n) => n.id === l.target);
            return (
              <line
                key={i}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="gray"
              />
            );
          })}
          {graph.nodes.map((n) => (
            <g
              key={n.id}
              transform={`translate(${n.x},${n.y})`}
              onClick={() => setSelected(n)}
            >
              <circle r={8} fill="skyblue" />
              <text
                y="-10"
                textAnchor="middle"
                className="text-xs select-none fill-current"
              >
                {n.title}
              </text>
            </g>
          ))}
        </svg>
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
            <p className="whitespace-pre-line">{selected.content}</p>
          </div>
        </div>
      )}
    </div>
  );
}
