import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserCardEntity } from '../../../database/entities/user-card.entity'
import { UserCardCrudService } from './user-card.crud'

@Module({
  imports: [TypeOrmModule.forFeature([UserCardEntity])],
  providers: [UserCardCrudService],
  exports: [UserCardCrudService],
})
export class UserCardModule {}
