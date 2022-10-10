import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CognitoAdminService } from './services/cognito-admin.service'
import { CognitoService } from './services/cognito.service'

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [CognitoService, CognitoAdminService],
  exports: [CognitoService, CognitoAdminService],
})
export class CognitoModule {}
