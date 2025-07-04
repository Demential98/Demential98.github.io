import { useMemo } from 'react';
import { scaleTime } from 'd3-scale';
import { extent } from 'd3-array';

import data from '../data/experience.json';   // Vite alias “@/”

export default function ExperienceGraph() {
  /* —— flatten items with track info —— */
  const { nodes, lanes, timeScale } = useMemo(() => {
    const tracks = data.tracks;
    const flat = [];
    tracks.forEach((track, laneIndex) => {
      track.items.forEach(item => {
        flat.push({ ...item, lane: laneIndex, trackColor: track.color });
      });
    });

    const allDates = flat.flatMap(i =>
      i.end ? [new Date(i.start), new Date(i.end)] : [new Date(i.start), new Date()]
    );
    const timeScale = scaleTime()
        .domain(extent(allDates))
        .range([60, 1000]); // px width (will be overwritten by `viewBox`)

    return { nodes: flat, lanes: tracks.length, timeScale };
  }, []);

  /* —— SVG props —— */
  const height = lanes * 110; // 100 for track + 10 gap
  const laneY = lane => lane * 110 + 50; // center of each lane

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 1100 ${height}`}      // 1100 = 1000 graph + 100 padding
        className="w-[1100px] max-w-none"
      >
        {/* horizontal track lines */}
        {Array.from({ length: lanes }).map((_, i) => (
          <line
            key={i}
            x1="50"
            x2="1050"
            y1={laneY(i)}
            y2={laneY(i)}
            stroke="#e5e7eb" strokeWidth="2"
          />
        ))}

        {/* experience bars + dots */}
        {nodes.map(n => {
          const x1 = timeScale(new Date(n.start));
          const x2 = timeScale(n.end ? new Date(n.end) : new Date());
          const y  = laneY(n.lane);

          return (
            <g key={n.id}>
              {/* duration bar */}
              <line
                x1={x1}
                x2={x2}
                y1={y}
                y2={y}
                stroke={n.trackColor}
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* start dot */}
              <circle cx={x1} cy={y} r="10" fill={n.trackColor} />
              {/* label */}
              <text
                x={x1}
                y={y - 18}
                fill={n.trackColor}
                className="text-sm font-semibold"
              >
                {n.title}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
