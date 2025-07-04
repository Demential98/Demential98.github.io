import { useMemo, useRef, useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import data from '../data/experience.json';
import { toTree } from '../utils/toTree';
import ResizeObserver from 'resize-observer-polyfill'; // 2 KB; vite treeshakes


export default function ExperienceTree() {
  /* flatten + sort most-recent first */
  const flat = useMemo(() => {
    const all = [];
    data.tracks.forEach(t =>
      t.items.forEach(i => all.push({ ...i, color: t.color }))
    );
    return all.sort((a, b) => new Date(b.start) - new Date(a.start));
  }, []);

  /* convert to nested shape */
  const root = useMemo(() => toTree(flat), [flat]);

  /* centre tree on mount */
  const containerRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 80 });
  
  // useEffect(() => {
    // const rect = containerRef.current?.getBoundingClientRect();
    // if (rect) setTranslate({ x: rect.width / 2, y: 80 });
  // }, []);


//   useEffect(() => {
//   const handle = () => {
//     const rect = containerRef.current?.getBoundingClientRect();
//     if (rect) setTranslate({ x: rect.width / 2, y: 80 });
//   };
//   window.addEventListener('resize', handle);
//   return () => window.removeEventListener('resize', handle);
// }, []);

  useEffect(() => {
  if (!containerRef.current) return;

  const update = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setTranslate({ x: rect.width / 2, y: 80 });
  };

  update();                               // 1) initial centre
  const ro = new ResizeObserver(update);  // 2) future resizes
  ro.observe(containerRef.current);

  return () => ro.disconnect();           // cleanup
}, []);
  

  /* card renderer */
  const renderNode = ({ nodeDatum }) => (
    <>
      {/* dot */}
      <circle r={6} fill={nodeDatum.color || '#2563eb'} />
      {/* floating card */}
      <foreignObject
        x={10}
        y={-30}
        width={240}
        height={80}
        className="pointer-events-auto"
      >
        <div
          className={`
            backdrop-blur-sm bg-white/70 dark:bg-slate-900/70
            border border-slate-300 dark:border-slate-700
            rounded-lg p-2 shadow-md
            w-56
          `}
        >
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {nodeDatum.title}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {nodeDatum.org ?? nodeDatum.track}
          </p>
          <p className="text-[10px] italic text-slate-500">
            {format(nodeDatum.start)} –{' '}
            {nodeDatum.end ? format(nodeDatum.end) : 'now'}
          </p>
          {/* skill chips */}
          <div className="mt-1 flex flex-wrap gap-1">
            {(nodeDatum.skills || []).map(sk => (
              <span
                key={sk}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                style={{
                  backgroundColor: (data.skillColors || {})[sk] ?? '#ccc',
                  color: '#fff'
                }}
              >
                {sk}
              </span>
            ))}
          </div>
        </div>
      </foreignObject>
    </>
  );

  return (
    // <div ref={containerRef} className="w-full h-[80vh]">
    <div
        ref={containerRef}
        className="w-full h-[80vh] flex justify-center overflow-y-auto"
    >
      {translate.x !== 0 && (
        <Tree
          data={root}
          translate={translate}
          orientation="vertical"
          pathFunc="step"           /* ← the Git-style elbow */
          separation={{ siblings: 1, nonSiblings: 2 }}
          nodeSize={{ x: 300, y: 140 }}
          renderCustomNodeElement={renderNode}
          collapsible={false}       /* always expanded */
          zoomable={false}      /* ⬅︎ no wheel-zoom, no drag-pan */
          panOnDrag={false}     /* ⬅︎ newer prop in react-d3-tree ≥3.4 */
          enableLegacyTransitions={false}  /* snappier scroll performance */
        />
      )}
    </div>
  );
}

function format(d) {
  return new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}
