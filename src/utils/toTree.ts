
export function toTree(items) {
  const byId: Record<string, any> = {};
  items.forEach(n => (byId[n.id] = { ...n, children: [] }));
  const roots: any[] = [];

  items.forEach(n => {
    if (n.parent) byId[n.parent].children.push(byId[n.id]);
    else roots.push(byId[n.id]);
  });
  return roots.length === 1 ? roots[0] : { id: 'root', children: roots };
}
