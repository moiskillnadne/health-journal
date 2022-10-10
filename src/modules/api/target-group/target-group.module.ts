import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TargetGroupEntity } from '../../../database/entities/target-group.entity'
import { TargetGroupCrud } from './target-group.crud'
import { TargetGroupController } from './target-group.controller'

@Module({
  imports: [TypeOrmModule.forFeature([TargetGroupEntity])],
  controllers: [TargetGroupController],
  providers: [TargetGroupCrud],
  exports: [TargetGroupCrud],
})
export class TargetGroupModule {}
