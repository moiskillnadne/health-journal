import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserProceduresEntity } from '../../../database/entities/user-procedures.entity'

import { UserRemindersModule } from '../user-reminders/user-reminders.module'

import { UserProceduresCrudService } from './user-procedures.crud'
import { UserProceduresService } from './user-procedures.service'
import { UserProceduresController } from './user-procedures.controller'

@Module({
  imports: [TypeOrmModule.forFeature([UserProceduresEntity]), UserRemindersModule],
  providers: [UserProceduresCrudService, UserProceduresService],
  controllers: [UserProceduresController],
  exports: [UserProceduresCrudService, UserProceduresService],
})
export class UserProceduresModule {}
