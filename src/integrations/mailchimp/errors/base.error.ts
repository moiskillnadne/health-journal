export class BaseError extends Error {
  originalError: any
  constructor(originalError: any, message?: string) {
    super(message)
    this.originalError = originalError
  }
}
