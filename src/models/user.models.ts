import { IReferralModel } from './referral.models'

export interface IUserModel {
  email: string
  username: string
  firstName?: string
  lastName?: string
  cognitoId: string
  dateOfBirth?: Date
  gender?: string
  race?: string
  city?: string
  state?: string
  country?: string
}

export interface IUserModelResponse {
  email: string
  username: string
  firstName?: string
  lastName?: string
  cognitoId: string
  dateOfBirth?: Date
  gender?: string
  race?: string
  city?: string
  state?: string
  country?: string
  id: string
  createAt: Date
  referral?: IReferralModel
}
