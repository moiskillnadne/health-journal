import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TrackEntity } from '../../../database/entities/track.entity'
import { UserTracksEntity } from '../../../database/entities/user-tracks.entity'

import { UserModule } from '../user/user.module'
import { S3Module } from '../../../integrations/s3/s3.module'

import { TrackCrud } from '../admin/track/crud/track.crud'

import { UserTracksCrudService } from './user-tracks.crud'
import { UserTracksService } from './user-tracks.service'
import { UserTracksController } from './user-tracks.controller'
import { TrackGroupEntity } from '../../../database/entities/track-group.entity'

@Module({
  imports: [TypeOrmModule.forFeature([TrackEntity, UserTracksEntity, TrackGroupEntity]), UserModule, S3Module],
  controllers: [UserTracksController],
  providers: [UserTracksCrudService, UserTracksService, TrackCrud],
  exports: [UserTracksCrudService, UserTracksService],
})
export class UserTracksModule {}
