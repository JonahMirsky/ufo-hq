interface ShapeEntry {
  name: string;
  count: number;
}

// Glyph SVGs keyed by shape enum value.
const SHAPE_GLYPHS: Record<string, string> = {
  "tic-tac": '<ellipse cx="32" cy="32" rx="26" ry="10"/><line x1="6" y1="32" x2="58" y2="32"/>',
  triangle: '<polygon points="32,8 56,52 8,52"/><circle cx="32" cy="40" r="3"/>',
  orb: '<circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="14"/>',
  sphere: '<circle cx="32" cy="32" r="22"/>',
  disk: '<ellipse cx="32" cy="36" rx="26" ry="6"/><path d="M14 36 Q 32 12 50 36"/>',
  cigar: '<rect x="6" y="28" width="52" height="8" rx="4"/><circle cx="32" cy="32" r="2"/>',
  diamond: '<polygon points="32,4 60,32 32,60 4,32"/><polygon points="32,18 46,32 32,46 18,32"/>',
  cylinder: '<rect x="20" y="8" width="24" height="48" rx="2"/><ellipse cx="32" cy="8" rx="12" ry="4"/>',
  cube: '<rect x="14" y="14" width="36" height="36"/><line x1="14" y1="14" x2="22" y2="6"/><line x1="50" y1="14" x2="58" y2="6"/><line x1="22" y1="6" x2="58" y2="6"/>',
  rectangle: '<rect x="8" y="22" width="48" height="20" rx="2"/>',
  formation: '<circle cx="20" cy="20" r="5"/><circle cx="44" cy="20" r="5"/><circle cx="32" cy="42" r="5"/><line x1="20" y1="20" x2="44" y2="20"/><line x1="20" y1="20" x2="32" y2="42"/><line x1="44" y1="20" x2="32" y2="42"/>',
  light: '<circle cx="32" cy="32" r="4" fill="currentColor"/><line x1="32" y1="6" x2="32" y2="14"/><line x1="32" y1="50" x2="32" y2="58"/><line x1="6" y1="32" x2="14" y2="32"/><line x1="50" y1="32" x2="58" y2="32"/><line x1="13" y1="13" x2="19" y2="19"/><line x1="45" y1="45" x2="51" y2="51"/><line x1="13" y1="51" x2="19" y2="45"/><line x1="45" y1="19" x2="51" y2="13"/>',
  boomerang: '<path d="M8 50 L 32 14 L 56 50 L 32 38 Z"/>',
  unknown: '<circle cx="32" cy="32" r="22" stroke-dasharray="3 3"/><circle cx="32" cy="32" r="6"/>',
};

const TITLE: Record<string, string> = {
  "tic-tac": "Tic-Tac",
  triangle: "Triangle",
  orb: "Orb",
  sphere: "Sphere",
  disk: "Disk",
  cigar: "Cigar",
  diamond: "Diamond",
  cylinder: "Cylinder",
  cube: "Cube",
  rectangle: "Rectangle",
  formation: "Formation",
  light: "Light",
  boomerang: "Boomerang",
  unknown: "Unknown",
};

export function ShapePictogram({
  entries,
  total,
}: {
  entries: ShapeEntry[];
  total: number;
}) {
  if (entries.length === 0) return null;
  const sorted = [...entries].sort((a, b) => b.count - a.count);
  const max = sorted[0].count;
  return (
    <div className="shape-pict">
      {sorted.map((e, i) => {
        const pct = total > 0 ? Math.round((e.count / total) * 100) : 0;
        const ratio = max > 0 ? e.count / max : 0;
        // Glyph size scales 24–64 px by share
        const sz = Math.round(24 + ratio * 40);
        const isTop = i === 0;
        const id = `02.1.${String.fromCharCode(65 + i)}`;
        const glyph = SHAPE_GLYPHS[e.name] ?? SHAPE_GLYPHS.unknown;
        return (
          <div key={e.name} className={`item ${isTop ? "am" : ""}`}>
            <div className="id-tag">{id}</div>
            <div className="pct">{pct}%</div>
            <svg
              width={sz}
              height={sz}
              viewBox="0 0 64 64"
              dangerouslySetInnerHTML={{ __html: glyph }}
            />
            <div className="lb">{TITLE[e.name] ?? e.name}</div>
            <div className="c">{e.count}</div>
          </div>
        );
      })}
    </div>
  );
}
