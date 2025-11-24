export interface TrustMetrics {
  [metric: string]: number;
}

export interface TrustDeltaResult {
  deltas: Record<string, number>;
  percentageChange: Record<string, number>;
  overallDelta: number;
}

/**
 * Compute the difference between baseline and current trust metrics. Metrics
 * are treated as numeric values and differences are computed per metric along
 * with an aggregate overall delta (mean of individual deltas).
 */
export function computeTrustDelta(baseline: TrustMetrics, current: TrustMetrics): TrustDeltaResult {
  const metrics = new Set([...Object.keys(baseline), ...Object.keys(current)]);
  const deltas: Record<string, number> = {};
  const percentageChange: Record<string, number> = {};

  metrics.forEach((metric) => {
    const baseValue = baseline[metric] ?? 0;
    const currentValue = current[metric] ?? 0;
    const delta = currentValue - baseValue;
    deltas[metric] = delta;
    percentageChange[metric] = baseValue === 0 ? (currentValue === 0 ? 0 : Infinity) : (delta / baseValue) * 100;
  });

  const overallDelta =
    metrics.size === 0
      ? 0
      : Array.from(metrics).reduce((sum, metric) => sum + deltas[metric], 0) / metrics.size;

  return { deltas, percentageChange, overallDelta };
}
