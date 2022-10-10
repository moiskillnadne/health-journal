import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserAdminEntity } from '../../database/entities/user-admin.entity'
import { CognitoModule } from '../../integrations/cognito/cognito.module'
import { AdminAuthController } from './admin-auth.controller'
import { AuthAdminService } from './services/admin-auth.service'
import { UserAdminEntityBaseService } from './services/entity/admin-auth.entity.service'
import { FailedLoginService } from './services/failed-login.service'
import { SesModule } from '../../integrations/ses/ses.module'

@Module({
  imports: [CognitoModule, ConfigModule, TypeOrmModule.forFeature([UserAdminEntity]), SesModule],
  controllers: [AdminAuthController],
  providers: [AuthAdminService, UserAdminEntityBaseService, FailedLoginService],
})
export class AdminAuthModule {}
