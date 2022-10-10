import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StorageEntity } from '../../../database/entities/storage.entity'
import { StorageController } from './storage.controller'
import { StorageCrud } from './storage.crud'
import { StorageService } from './storage.service'

@Module({
  imports: [TypeOrmModule.forFeature([StorageEntity])],
  controllers: [StorageController],
  providers: [StorageService, StorageCrud],
  exports: [StorageService, StorageCrud],
})
export class StorageModule {}
