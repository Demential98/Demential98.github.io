import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Experience() {
  const { t } = useTranslation();
  const [pages, setPages] = useState(null);
  const [selected, setSelected] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

  useEffect(() => {
    fetch('/pages.json')
      .then((res) => res.json())
      .then((data) => {
        const radius = 200;
        const nodes = data.pages.map((p, i) => {
          const angle = (2 * Math.PI * i) / data.pages.length;
          return { ...p, x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
        });
        setPages(nodes);
      })
      .catch(() => setPages([]));
  }, []);

  const edges =
    pages?.flatMap((p) => p.links.map((l) => ({ from: p.id, to: l }))) || [];

  const handleMouseDown = (e) => {
    dragRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current) return;
    setOffset({ x: e.clientX - dragRef.current.x, y: e.clientY - dragRef.current.y });
  };

  const handleMouseUp = () => {
    dragRef.current = null;
  };

  if (!pages) {
    return <div className="p-4">{t('experience_loading')}</div>;
  }

  return (
    <div className="flex h-full">
      <aside className="w-48 p-4 border-r overflow-y-auto">
        <h2 className="font-bold mb-2">{t('experience_pages')}</h2>
        <ul className="space-y-1">
          {pages.map((p) => (
            <li key={p.id}>
              <button
                className="text-left hover:underline"
                onClick={() => setSelected(p)}
              >
                {p.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div
        className="flex-1 relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          className="absolute inset-0"
          width="100%"
          height="100%"
          style={{
            cursor: dragRef.current ? 'grabbing' : 'grab',
            transform: `translate(${offset.x}px, ${offset.y}px)`
          }}
          viewBox="-250 -250 500 500"
        >
          {edges.map((e, i) => {
            const a = pages.find((p) => p.id === e.from);
            const b = pages.find((p) => p.id === e.to);
            if (!a || !b) return null;
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                className="stroke-neutral-500"
              />
            );
          })}
          {pages.map((p) => (
            <g key={p.id} onClick={() => setSelected(p)} className="cursor-pointer">
              <circle cx={p.x} cy={p.y} r="20" className="fill-yellow-400" />
            </g>
          ))}
        </svg>
        {pages.map((p) => (
          <div
            key={p.id}
            style={{ left: p.x + offset.x + 250, top: p.y + offset.y + 250 }}
            className="absolute text-center text-xs pointer-events-none"
          >
            {p.title}
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
            <p className="mb-4 whitespace-pre-line">{selected.content}</p>
          </div>
        </div>
      )}
    </div>
  );
}
