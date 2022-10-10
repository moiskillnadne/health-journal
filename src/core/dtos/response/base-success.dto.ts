export class BaseSuccessResponse {
  code: string
  httpCode: number
  message?: string
  details?: Record<string, unknown>
}
