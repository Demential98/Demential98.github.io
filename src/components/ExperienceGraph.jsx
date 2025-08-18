import { useEffect, useRef, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';

export default function ExperienceGraph() {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const fgRef = useRef();

  useEffect(() => {
    fetch('/experiencePages.json')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => setData({ nodes: [], links: [] }));
  }, []);

  if (!data) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex h-full">
      <div className="w-56 p-4 border-r overflow-y-auto">
        {data.nodes.map((n) => (
          <div
            key={n.id}
            className="mb-2 cursor-pointer hover:underline"
            onClick={() => {
              setSelected(n);
              if (fgRef.current) {
                fgRef.current.centerAt(n.x, n.y, 1000);
                fgRef.current.zoom(4, 1000);
              }
            }}
          >
            {n.title}
          </div>
        ))}
      </div>
      <div className="flex-1 relative">
        <ForceGraph2D
          ref={fgRef}
          graphData={data}
          nodeId="id"
          nodeLabel="title"
          onNodeClick={(node) => setSelected(node)}
        />
        {selected && (
          <div className="absolute top-0 right-0 w-64 h-full bg-white dark:bg-neutral-900 p-4 overflow-y-auto">
            <button
              className="mb-4 text-sm hover:underline"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
            <h2 className="text-xl font-bold mb-2">{selected.title}</h2>
            <p>{selected.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}
