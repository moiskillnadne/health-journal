import { Injectable } from '@nestjs/common'
import {
  failedLoginAttemptsBlockPeriod,
  failedLoginAttemptsLimit,
  FailedLoginAttemptsMail,
} from '../../../constants/enums/auth.constants'
import { UserEntity } from '../../../database/entities/user.entity'
import { SesService } from '../../../integrations/ses/ses.service'
import { I18nContext } from 'nestjs-i18n'

@Injectable()
export class FailedLoginService {
  constructor(private sesService: SesService) {}

  public async notifyUserFailedLoginAttempts(user: UserEntity, i18n: I18nContext): Promise<void> {
    if (user.email) {
      await this.sesService.sendEmail({
        to: user.email,
        subject: i18n.t(FailedLoginAttemptsMail.subject),
        message: i18n.t(FailedLoginAttemptsMail.body),
      })
    }
  }

  public isUserBlocked(user: UserEntity): boolean {
    return (user.loginFailedAttemptsCount ?? 0) >= failedLoginAttemptsLimit
  }

  public isBlockTimeOver(lastLoginAttemptAt: Date | null) {
    return (
      lastLoginAttemptAt &&
      Math.floor(new Date().getTime() / 1000) - Math.floor(lastLoginAttemptAt.getTime() / 1000) >
        failedLoginAttemptsBlockPeriod
    )
  }

  public isLimitFailedLogin(user: UserEntity): boolean {
    return user.loginFailedAttemptsCount + 1 === failedLoginAttemptsLimit
  }
}
