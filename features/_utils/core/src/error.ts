/* eslint-disable @typescript-eslint/no-parameter-properties */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
export type ErrorState = { message: string; data?: unknown; error?: unknown; retryCallback?: () => void };

export class AppError extends Error implements ErrorState {
  constructor(public message: string, public data?: unknown) {
    super();
  }
}

export class ApiError extends Error implements ErrorState {
  constructor(public message: string, public data?: unknown) {
    super();
  }
}

export class MockError extends Error implements ErrorState {
  constructor(public message: string, public data?: unknown) {
    super();
  }
}

export class NotImplementedError extends Error implements ErrorState {
  constructor(public message: string = `Not Implemented`, public data?: unknown) {
    super();
  }
}
