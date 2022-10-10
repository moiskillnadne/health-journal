import { AdminUserPermissionsType } from '../../constants/permissions/admin.constants'
import { SetMetadata } from '@nestjs/common'

export const PERMISSIONS_KEY = 'permissions'
export const RequirePermissions = (...permissions: AdminUserPermissionsType[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions)
