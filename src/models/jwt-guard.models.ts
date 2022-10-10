export interface JwtPayload {
  origin_jti: string
  sub: string
  event_id: string
  token_user: string
  scope: string
  auth_time: number
  iss: string
  exp: number
  iat: number
  jti: string
  client_id: string
  username: string
}
