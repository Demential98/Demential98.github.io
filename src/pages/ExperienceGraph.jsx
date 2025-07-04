import { useMemo } from 'react';
import data from '../data/experience.json';

export default function ExperienceGraph() {

    const skillColors = data.skillColors || {};

  /* 1.  flatten + sort */
  const nodes = useMemo(() => {
    const flat = [];
    data.tracks.forEach(t => t.items.forEach(i => flat.push({ ...i, color: t.color })));
    flat.sort((a, b) => new Date(b.start) - new Date(a.start));
    return flat;
  }, []);

  /* 2.  compute layout (row / lane) */
  const centerX = 450, laneGap = 120, rowGap = 120;
  const idMap = new Map();
  nodes.forEach((n, idx) => idMap.set(n.id, n));

  nodes.forEach((n, idx) => {
    n.row = idx;
    if (!n.parent) {
      n.lane = 0;
    } else {
      const p = idMap.get(n.parent);
      const dir = p.lastDir === 'right' ? -1 : 1;
      p.lastDir = dir === 1 ? 'right' : 'left';
      n.lane = p.lane + dir;
    }
    n.x = centerX + n.lane * laneGap;
    n.y = idx * rowGap + 60;
  });

  /* svg size */
  const height = nodes.length * rowGap + 100;
  const width  = centerX * 2;

  /* util */
  const format = d =>
    new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

  return (
    <div className="w-full overflow-x-auto">

      <svg className="max-w-none" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0"/>
            <stop offset="100%" stopColor="#fff" stopOpacity="0.15"/>
          </linearGradient>
        </defs>
        {/* central spine */}
        <line
          x1={centerX}
          y1={nodes[0].y - rowGap}
          x2={centerX}
          y2={nodes[nodes.length - 1].y + 40}
          stroke="#e5e7eb"
          strokeWidth="4"
        />

        {/* connectors (parent → child) */}
        {nodes.map(n => {
          if (!n.parent) return null;
          const p = idMap.get(n.parent);
          const pathD = `
                M ${p.x} ${p.y}
                Q ${p.x} ${(p.y + n.y) / 2} ${centerX} ${(p.y + n.y) / 2}
                T ${n.x} ${n.y}
            `;
          return (
            <path
                key={n.id + '-link'}
                d={pathD}
                fill="none"
                stroke={n.color}
                strokeWidth="3"
            />
          );
        })}

        {/* nodes */}
        {nodes.map(n => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="10" fill={n.color} />
            <text
              x={n.x + (n.lane >= 0 ? 16 : -16)}
              y={n.y + 4}
              textAnchor={n.lane >= 0 ? 'start' : 'end'}
              className="text-sm font-medium fill-slate-900 dark:fill-slate-100"
            >
              {n.title}
            </text>
            <text
              x={n.x + (n.lane >= 0 ? 16 : -16)}
              y={n.y + 20}
              textAnchor={n.lane >= 0 ? 'start' : 'end'}
              className="text-xs fill-slate-500"
            >
              {format(n.start)} – {n.end ? format(n.end) : 'now'}
            </text>
            {/* skill petals */}
            {n.skills?.map((sk, idx) => (
              <circle
                key={sk}
                cx={n.x + 18 * Math.cos((idx / n.skills.length) * 2 * Math.PI)}
                cy={n.y + 18 * Math.sin((idx / n.skills.length) * 2 * Math.PI)}
                r="5"
                fill={skillColors[sk] || '#a3a3a3'}
              >
                {/* tooltip */}
                <title>{sk}</title>
              </circle>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
