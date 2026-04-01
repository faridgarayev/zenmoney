// ─── Utility: Goal time calculator ───
export function goalCalc(monthly: number) {
  const r = 0.08,
    n = 12,
    mr = r / n;
  const calcMonths = (target: number): number => {
    if (monthly <= 0) return Infinity;
    return Math.ceil(Math.log(1 + (target * mr) / monthly) / Math.log(1 + mr));
  };
  const formatTime = (m: number): string => {
    if (!isFinite(m)) return "—";
    const y = Math.floor(m / 12),
      mo = m % 12;
    return y === 0 ? `${mo} ay` : mo === 0 ? `${y} il` : `${y} il ${mo} ay`;
  };
  return { calcMonths, formatTime };
}
