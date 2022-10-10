import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { UserSettingsEntityService } from './services/entity/user-settings-entity.service'
import { UserSettingsService } from './services/user-settings.service'
import { UserSettingsController } from './user-settings.controller'
import { UserSettingsEntity } from '../../../database/entities/user-settings.entity'
import { UserCrudService } from '../user/user.crud'
import { UserEntity } from '../../../database/entities/user.entity'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UserSettingsEntity, UserEntity])],
  controllers: [UserSettingsController],
  providers: [UserSettingsService, UserSettingsEntityService, UserCrudService],
  exports: [UserSettingsEntityService],
})
export class UserSettingsModule {}
