import { AuditLogger } from './audit/logger';
import { TraceValidator, ValidationResult } from './audit/traceValidator';
import { generateCTID, ConsentTransactionID } from './consent/ctid';
import { ConsentState, ConsentStateMachine } from './consent/stateMachine';
import { EmotionalSignal, ToleranceConfig, ToleranceWindow } from './consent/toleranceWindow';
import { TrustDeltaCalculator, RepairMetrics, TrustSurveyResponse } from './repair/trustDelta';

export interface EISConfig {
  secretKey: string;
  autoLog?: boolean;
  auditLogPath?: string;
  tolerance?: ToleranceConfig;
}

export class EISClient {
  private readonly logger: AuditLogger;

  private readonly stateMachine: ConsentStateMachine;

  private readonly toleranceWindow?: ToleranceWindow;

  private ctid?: ConsentTransactionID;

  constructor(private readonly config: EISConfig) {
    this.logger = new AuditLogger();
    this.stateMachine = new ConsentStateMachine();
    this.toleranceWindow = config.tolerance
      ? new ToleranceWindow(config.tolerance)
      : undefined;
  }

  public initializeConsent(tiers: number[]): Promise<ConsentTransactionID> {
    this.ctid = generateCTID(this.config.secretKey, tiers);
    this.logEvent('consent_initialized', { tiers, state: this.stateMachine.state });
    return Promise.resolve(this.ctid);
  }

  public grantConsent(): Promise<ConsentState> {
    const transition = this.stateMachine.transition('active');
    this.logEvent('consent_granted', { state: transition.to });
    return Promise.resolve(this.stateMachine.state);
  }

  public renewConsent(): Promise<ConsentState> {
    const transition = this.stateMachine.transition('renewed');
    this.logEvent('consent_renewed', { state: transition.to });
    return Promise.resolve(this.stateMachine.state);
  }

  public revokeConsent(): Promise<ConsentState> {
    const transition = this.stateMachine.transition('revoked');
    this.logEvent('consent_revoked', { state: transition.to });
    return Promise.resolve(this.stateMachine.state);
  }

  public monitorSignal(signal: EmotionalSignal): Promise<boolean> {
    if (!this.toleranceWindow) {
      return Promise.resolve(true);
    }
    const within = this.toleranceWindow.record(signal);
    if (!within) {
      this.logEvent('tolerance_exceeded', { state: this.stateMachine.state, signal });
    }
    return Promise.resolve(within);
  }

  public validateTrace(states?: ConsentState[]): ValidationResult {
    const validator = new TraceValidator(
      this.logger.getEvents().map((event) => ({ ...event })),
    );
    return validator.validate(states);
  }

  public assessTrustDelta(
    baseline: TrustSurveyResponse[],
    postIncident: TrustSurveyResponse[],
    incidentAt: Date,
    resolvedAt: Date,
    resolvedCount: number,
    totalCount: number,
  ): RepairMetrics {
    const calculator = new TrustDeltaCalculator();
    const metrics = calculator.assessRepairMetrics(
      baseline,
      postIncident,
      incidentAt,
      resolvedAt,
      resolvedCount,
      totalCount,
    );
    return metrics;
  }

  public getAuditLines(): string[] {
    return this.logger.getLines();
  }

  public getCurrentState(): ConsentState {
    return this.stateMachine.state;
  }

  public getCTID(): ConsentTransactionID | undefined {
    return this.ctid;
  }

  private logEvent(event_type: string, details?: Record<string, unknown>): void {
    const ctid = this.ctid?.id ?? 'unknown';
    this.logger.log({ event_type, ctid, details });
  }
}

export function createEISClient(config: EISConfig): EISClient {
  return new EISClient(config);
}
