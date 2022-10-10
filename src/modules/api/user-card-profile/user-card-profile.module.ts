import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserCardProfileEntity } from '../../../database/entities/user-card-profile.entity'
import { UserCardProfileCrudService } from './user-card-profile.crud'

@Module({
  imports: [TypeOrmModule.forFeature([UserCardProfileEntity])],
  providers: [UserCardProfileCrudService],
  exports: [UserCardProfileCrudService],
})
export class UserCardProfileModule {}
