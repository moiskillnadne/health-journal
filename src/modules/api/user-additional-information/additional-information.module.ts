import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserAdditionalInformationEntity } from '../../../database/entities/additional-information.entity'
import { AdditionalInformationController } from './additional-information.controller'
import { AdditionalInformationCrudService } from './additional-information.crud'
import { AdditionalInformationService } from './additional-information.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserAdditionalInformationEntity])],
  controllers: [AdditionalInformationController],
  providers: [AdditionalInformationService, AdditionalInformationCrudService],
  exports: [],
})
export class AdditionalInformationModule {}
