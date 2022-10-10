import { UserDeviceEntity } from './../../../database/entities/user-dervice.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { UserDeviceController } from './user-device.controller'
import { UserDeviceCrudService } from './user-device.crud'
import { UserDeviceService } from './user-device.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserDeviceEntity])],
  controllers: [UserDeviceController],
  providers: [UserDeviceCrudService, UserDeviceService],
  exports: [UserDeviceCrudService],
})
export class UserDeviceModule {}
