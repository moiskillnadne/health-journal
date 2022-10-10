import { Injectable } from '@nestjs/common'
import {
  failedLoginAttemptsBlockPeriod,
  failedLoginAttemptsLimit,
  FailedLoginAttemptsMail,
} from '../../../constants/enums/admin/auth.constants'
import { UserAdminEntity } from '../../../database/entities/user-admin.entity'
import { SesService } from '../../../integrations/ses/ses.service'

@Injectable()
export class FailedLoginService {
  constructor(private sesService: SesService) {}

  public async notifyUserFailedLoginAttempts(user: UserAdminEntity): Promise<void> {
    await this.sesService.sendEmail({
      to: user.email,
      subject: FailedLoginAttemptsMail.subject,
      message: FailedLoginAttemptsMail.body,
    })
  }

  public isUserBlocked(user: UserAdminEntity): boolean {
    return user.loginFailedAttemptsCount >= failedLoginAttemptsLimit
  }

  public isBlockTimeOver(lastLoginAttemptAt: Date | null) {
    return (
      lastLoginAttemptAt &&
      Math.floor(new Date().getTime() / 1000) - Math.floor(lastLoginAttemptAt.getTime() / 1000) >
        failedLoginAttemptsBlockPeriod
    )
  }

  public isLimitFailedLogin(user: UserAdminEntity): boolean {
    return user.loginFailedAttemptsCount + 1 === failedLoginAttemptsLimit
  }
}
