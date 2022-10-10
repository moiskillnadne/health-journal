import { AdminUsersRoles } from '../constants/permissions/admin.constants'

export interface IUserAdminModel {
  id?: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  cognitoId: string
  role?: AdminUsersRoles
  isActive?: boolean
  lastLoginAt?: Date
}

export interface IUserAdminModelResponse {
  email: string
  username: string
  firstName?: string
  lastName?: string
  cognitoId: string
  id: string
  createAt: Date
  role?: AdminUsersRoles
  isActive?: boolean
  lastLoginAt?: Date
}
