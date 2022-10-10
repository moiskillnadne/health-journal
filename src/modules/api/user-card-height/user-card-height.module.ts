import { Module } from '@nestjs/common'
import { UserCardModule } from '../user-card/user-card.module'
import { UserCardHeightController } from './user-card-height.controller'
import { UserCardHeightService } from './user-card-height.service'

@Module({
  imports: [UserCardModule],
  controllers: [UserCardHeightController],
  providers: [UserCardHeightService],
  exports: [],
})
export class UserCardHeightModule {}
