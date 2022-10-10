import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProceduresEntity } from '../../../database/entities/procedures.entity'

import { ProceduresCrudService } from './procedures.crud'
import { ProceduresController } from './procedures.controller'
import { ProceduresService } from './procedures.service'

@Module({
  imports: [TypeOrmModule.forFeature([ProceduresEntity])],
  providers: [ProceduresCrudService, ProceduresService],
  controllers: [ProceduresController],
  exports: [ProceduresCrudService, ProceduresService],
})
export class ProceduresModule {}
