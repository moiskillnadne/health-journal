import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { S3Module } from '../../../integrations/s3/s3.module'

import { UserVideosEntity } from '../../../database/entities/user-videos.entity'

import { UserVideosCrudService } from './user-videos.crud'
import { UserVideosService } from './user-videos.service'
import { UserVideosController } from './user-videos.controller'

@Module({
  imports: [TypeOrmModule.forFeature([UserVideosEntity]), S3Module],
  controllers: [UserVideosController],
  providers: [UserVideosCrudService, UserVideosService],
  exports: [UserVideosCrudService, UserVideosService],
})
export class UserVideosModule {}
