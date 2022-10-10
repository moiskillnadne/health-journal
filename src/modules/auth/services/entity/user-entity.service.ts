import { Injectable } from '@nestjs/common'
import { UserCrudService } from '../../../api/user/user.crud'

@Injectable()
export class AuthUserService extends UserCrudService {}
