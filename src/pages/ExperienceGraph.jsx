import { useMemo, useRef, useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import { linkVertical } from 'd3-shape';
import { motion } from 'framer-motion';
import ResizeObserver from 'resize-observer-polyfill';

import data from '../data/experience.json';
import { toTree } from '../utils/toTree';

/**
 * Seconds to wait between every depth level (root → depth 1 → depth 2 …).
 * Tweak this to get faster / slower cascades.
 */
const ANIMATION_DELAY = 0.25; // s

export default function ExperienceTreeAnimated() {
  /* 1. flatten + sort most‑recent first */
  const flat = useMemo(() => {
    const all = [];
    data.tracks.forEach(t =>
      t.items.forEach(i => all.push({ ...i, color: t.color }))
    );
    return all.sort(
      (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
    );
  }, []);

  /* 2. convert to nested shape for react‑d3‑tree */
  const root = useMemo(() => toTree(flat), [flat]);

  /* 3. centre tree inside its container */
  const containerRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 80 });

  useEffect(() => {
    if (!containerRef.current) return;

    const update = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      setTranslate({ x: rect.width / 2, y: 80 });
    };

    update(); // initial
    const ro = new ResizeObserver(update); // on resize
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  /* 4. Animated node renderer */
  /**
  * @param {{ nodeDatum: { depth?: number, __rd3t?: any, color?: string, skills?: string[] } }} props
  */
  const renderNode = ({ nodeDatum }) => {
    // Stagger children by depth (root depth = 0)
    const depthDelay = (nodeDatum.depth ?? 0) * ANIMATION_DELAY;

    // Place cards to the left or right of the dot depending on branch side
    const isRight = (nodeDatum.__rd3t?.x ?? 0) >= 0;
    const cardX = isRight ? 10 : -250; // 240‑px card + 10‑px gutter

    return (
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: depthDelay, duration: 0.5 }}
      >
        {/* dot */}
        <circle r={6} fill={nodeDatum.color || '#2563eb'} />

        {/* floating card */}
        <foreignObject
          x={cardX}
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
              {format(nodeDatum.start)} – {nodeDatum.end ? format(nodeDatum.end) : 'now'}
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
      </motion.g>
    );
  };

  /* 5. Animated link (elbow) renderer */
  const pathGenerator = linkVertical()
    .x(d => (d?.x ?? 0))
    .y(d => (d?.y ?? 0));

  /**
  * @param {{ linkDatum: { source: object, target: { depth?: number } } }} props
  */
  const renderLink = ({ linkDatum }) => {
    const depthDelay = (linkDatum.target.depth ?? 0) * ANIMATION_DELAY;
    return (
      <motion.path
        d={pathGenerator(linkDatum)}
        fill="none"
        stroke="#94a3b8" /* slate‑400 */
        strokeWidth={1}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: depthDelay, duration: 0.6, ease: 'easeInOut' }}
      />
    );
  };

  /* 6. The tree itself */
  return (
    <div ref={containerRef} className="w-full h-screen flex justify-center overflow-y-auto">
      {translate.x !== 0 && (
        <Tree
          data={root}
          translate={translate}
          orientation="vertical"
          pathFunc="step" /* Git‑style elbows */
          separation={{ siblings: 1, nonSiblings: 2 }}
          nodeSize={{ x: 300, y: 140 }}
          renderCustomNodeElement={renderNode}
          renderCustomLinkPath={renderLink}
          draggable
          collapsible={false} /* always expanded */
          panOnDrag
          enableLegacyTransitions
          zoomable
        />
      )}
    </div>
  );
}

function format(d) {
  return new Date(d).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric'
  });
}
