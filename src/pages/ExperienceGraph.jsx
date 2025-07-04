import { useMemo } from 'react';

import data from '../data/experience.json';   // Vite alias “@/”



/* config */
const MAIN_X = 140;          // px – x-pos of the vertical backbone
const MIN_BAR = 40;          // px – shortest visible duration bar
const BAR_X_OFFSET = 40;     // px – how far a bar sticks out from backbone

export default function ExperienceGraph() {
  /* flatten & sort items by start date DESC (recent first) */
  const nodes = useMemo(() => {
    const flat = [];
    data.tracks.forEach(track =>
      track.items.forEach(it =>
        flat.push({ ...it, color: track.color, track: track.id })
      )
    );

    flat.sort(
      (a, b) => new Date(b.start).valueOf() - new Date(a.start).valueOf()
    );
    return flat;
  }, []);

  /* Y-scale : 0 → … based on order (simpler than date scale) */
  const nodeGap = 110;
  const height = nodes.length * nodeGap + 100;
  const yOf = idx => idx * nodeGap + 60;

  /* helper: date diff in days → bar length px */
  const barLength = (start, end) => {
    const ms = (end ?? new Date()) - new Date(start);
    const days = ms / 86_400_000;
    return Math.max(MIN_BAR, days / 365 * 80); // 80 px ≈ 1 year
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 900 ${height}`}
        className="w-[900px] max-w-none"
        aria-label="Experience timeline"
      >
        {/* ─── backbone ─────────────────────────────────────── */}
        <line
          x1={MAIN_X}
          x2={MAIN_X}
          y1={yOf(0) - nodeGap}
          y2={yOf(nodes.length - 1) + 20}
          stroke="#e5e7eb"
          strokeWidth="4"
        />

        {/* ─── bars + dots ─────────────────────────────────── */}
        {nodes.map((n, i) => {
          const y = yOf(i);
          const len = barLength(n.start, n.end);
          const dir = i % 2 === 0 ? 1 : -1;            // zig-zag L / R
          const x2 = MAIN_X + dir * (BAR_X_OFFSET + len);

          return (
            <g key={n.id}>
              {/* branch bar */}
              <line
                x1={MAIN_X}
                y1={y}
                x2={x2}
                y2={y}
                stroke={n.color}
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* connector dot */}
              <circle cx={MAIN_X} cy={y} r="10" fill={n.color} />

              {/* label block */}
              <foreignObject
                x={dir === 1 ? MAIN_X + 24 : x2 - 260}
                y={y - 22}
                width="240"
                height="64"
              >
                <div className="flex flex-col text-sm leading-tight">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {n.title}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {n.org ?? n.track}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatDate(n.start)} – {n.end ? formatDate(n.end) : 'now'}
                  </span>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* util: 2024-06 → Jun 2024 */
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short'
  });
}
