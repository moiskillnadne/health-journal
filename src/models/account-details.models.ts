export interface IUserDetails {
  firstName?: string
  lastName?: string
  city?: string
  state?: string
  country?: string
}

export interface IUpdateEmailDeails {
  email: string
  accessToken: string
}

export interface IVerifyEmail {
  accessToken: string
  code: string
}
