export interface TrustSurveyResponse {
  dimension: string;
  score: number;
}

export interface TrustDeltaResult {
  deltas: Record<string, number>;
  percentageChange: Record<string, number>;
  overallDelta: number;
}

export interface RepairMetrics extends TrustDeltaResult {
  repairLatencyMs: number;
  closureRate: number;
}

export class TrustDeltaCalculator {
  public calculateDelta(
    baseline: TrustSurveyResponse[],
    postIncident: TrustSurveyResponse[],
  ): TrustDeltaResult {
    const metrics = new Set([
      ...baseline.map((item) => item.dimension),
      ...postIncident.map((item) => item.dimension),
    ]);

    const deltas: Record<string, number> = {};
    const percentageChange: Record<string, number> = {};

    metrics.forEach((metric) => {
      const baseScore = baseline.find((item) => item.dimension === metric)?.score ?? 0;
      const postScore = postIncident.find((item) => item.dimension === metric)?.score ?? 0;
      const delta = postScore - baseScore;
      deltas[metric] = delta;
      percentageChange[metric] =
        baseScore === 0 ? (postScore === 0 ? 0 : Infinity) : (delta / baseScore) * 100;
    });

    const overallDelta =
      metrics.size === 0
        ? 0
        : Array.from(metrics).reduce((sum, metric) => sum + deltas[metric], 0) /
          metrics.size;

    return { deltas, percentageChange, overallDelta };
  }

  public assessRepairMetrics(
    baseline: TrustSurveyResponse[],
    postIncident: TrustSurveyResponse[],
    incidentAt: Date,
    resolvedAt: Date,
    resolvedCount: number,
    totalCount: number,
  ): RepairMetrics {
    const trustDelta = this.calculateDelta(baseline, postIncident);
    const repairLatencyMs = resolvedAt.getTime() - incidentAt.getTime();
    const closureRate = totalCount === 0 ? 0 : resolvedCount / totalCount;
    return { ...trustDelta, repairLatencyMs, closureRate };
  }

  public generateComplianceReport(metrics: RepairMetrics): string {
    return [
      'Trust Repair Compliance Report',
      `Overall Delta: ${metrics.overallDelta.toFixed(2)}`,
      `Repair Latency (ms): ${metrics.repairLatencyMs}`,
      `Closure Rate: ${(metrics.closureRate * 100).toFixed(1)}%`,
    ].join('\n');
  }
}
