export enum ReferralType {
  PhysicianOrHealthCareProvider = 'PHYSICIAN_OR_HEALTH_CARE_PROVIDER',
  InsuranceCompany = 'INSURANCE_COMPANY',
  Friend = 'FRIEND',
  SocalMediaOrOnlineAdvertising = 'SOCIAL_MEDIA_OR_ONLINE_ADVERTISING',
  NoOneIAmAwesome = 'NO_ONE_I_AM_AWESOME',
  Other = 'OTHER',
}

export interface IReferralDTOModel {
  userId: string
  referralType: ReferralType
  referralValue?: string
}

export interface IReferralModel {
  type: ReferralType
  value?: string
}

export interface IReferralResponse {
  id: string
  type: ReferralType
  value?: string
  createAt: Date
}
