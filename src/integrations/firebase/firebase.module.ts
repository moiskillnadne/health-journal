import { Module } from '@nestjs/common'
import { UserDeviceModule } from '../../modules/api/user-device/user-device.module'
import { S3Module } from '../s3/s3.module'
import { FirebaseHelperService } from './firebase.helper'
import { FirebaseService } from './firebase.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StorageEntity } from '../../database/entities/storage.entity'

@Module({
  imports: [UserDeviceModule, S3Module, TypeOrmModule.forFeature([StorageEntity])],
  controllers: [],
  providers: [FirebaseHelperService, FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
