import { UserEntity } from './../../database/entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CognitoModule } from './../../integrations/cognito/cognito.module'
import { ConfigModule } from '@nestjs/config'
import { AuthService } from './services/auth.service'
import { AuthController } from './auth.controller'
import { Module } from '@nestjs/common'
import { AuthUserService } from './services/entity/user-entity.service'
import { UserSettingsNotificationsModule } from '../api/user-settings-notifications/user-settings-notifications.module'
import { UserSettingsModule } from '../api/user-settings/user-settings.module'
import { UserTargetGroupsModule } from '../api/user-target-groups/user-target-groups.module'
import { MailchimpModule } from '../../integrations/mailchimp/mailchimp.module'
import { FailedLoginService } from './services/failed-login.service'
import { SesModule } from '../../integrations/ses/ses.module'

@Module({
  imports: [
    CognitoModule,
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    UserSettingsNotificationsModule,
    UserSettingsModule,
    UserTargetGroupsModule,
    MailchimpModule,
    SesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthUserService, FailedLoginService],
})
export class AuthModule {}
