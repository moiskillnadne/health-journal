import { AuthTokensResponseDto } from '../../auth/auth-response.dto'
import { UserAdminEntity } from './../../../database/entities/user-admin.entity'

export class PostAdminUserSignUpResponse extends UserAdminEntity {}

export class PostAdminUserLoginResponse extends AuthTokensResponseDto {
  user: PostAdminUserSignUpResponse
}
