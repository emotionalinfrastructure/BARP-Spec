export class EISError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EISError';
  }
}

export class ConsentError extends EISError {
  constructor(message: string) {
    super(message);
    this.name = 'ConsentError';
  }
}

export class AuditError extends EISError {
  constructor(message: string) {
    super(message);
    this.name = 'AuditError';
  }
}

export class ValidationError extends EISError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
