export interface AppError {
  message: string;
  status?: number;
  statusText?: string;
  timestamp: Date;
  url?: string;
  stack?: string;
}

export enum ErrorType {
  CLIENT = 'CLIENT_ERROR',
  SERVER = 'SERVER_ERROR',
  NETWORK = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

export class CustomError extends Error {
  constructor(
    public override message: string,
    public type: ErrorType = ErrorType.UNKNOWN,
    public status?: number
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
