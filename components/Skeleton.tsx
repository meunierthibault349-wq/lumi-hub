// Skeleton loader components — used across dashboard, taches, chrono

type LineProps = { w?: string | number; h?: number; radius?: number; style?: React.CSSProperties };

export function SkeletonLine({ w = '100%', h = 13, radius = 5, style }: LineProps) {
  return (
    <div
      className="skeleton"
      style={{ width: w, height: h, borderRadius: radius, flexShrink: 0, ...style }}
    />
  );
}

export function SkeletonMetricCard() {
  return (
    <div className="metric-card" style={{ gap: 10, display: 'flex', flexDirection: 'column' }}>
      <SkeletonLine w="55%" h={11} />
      <SkeletonLine w="38%" h={28} radius={8} />
      <SkeletonLine w="75%" h={11} />
    </div>
  );
}

export function SkeletonTableRow({ cols = 5 }: { cols?: number }) {
  const widths = ['16px', '20px', '42%', '90px', '60px', '55px', '26px'];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `16px 20px 1fr 110px 80px 60px 28px`,
      gap: 12,
      padding: '12px 18px',
      borderTop: '1px solid rgba(255,255,255,.07)',
      alignItems: 'center',
    }}>
      {widths.slice(0, cols).map((w, i) => (
        <SkeletonLine key={i} w={w} h={13} />
      ))}
    </div>
  );
}

export function SkeletonListRow() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,.07)',
    }}>
      <SkeletonLine w={16} h={16} radius={4} />
      <SkeletonLine w="50%" h={13} />
      <SkeletonLine w={70} h={20} radius={20} style={{ marginLeft: 'auto' }} />
      <SkeletonLine w={36} h={20} radius={20} />
    </div>
  );
}

export function SkeletonChronoRow() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '12px 1fr auto auto', gap: 12,
      padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,.07)', alignItems: 'center',
    }}>
      <SkeletonLine w={8} h={8} radius={99} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <SkeletonLine w="55%" h={13} />
        <SkeletonLine w="40%" h={11} />
      </div>
      <SkeletonLine w={52} h={20} radius={6} />
      <SkeletonLine w={24} h={24} radius={6} />
    </div>
  );
}
