import { ReferralEntityService } from './referral-entity.service'
import { ReferralEntity } from './../../../database/entities/referral.entity'
import { ProfilePhotoEntity } from './../../../database/entities/profile-photo.entity'
import { S3Module } from './../../../integrations/s3/s3.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'

import { CognitoModule } from '../../../integrations/cognito/cognito.module'

import { UserEntity } from '../../../database/entities/user.entity'
import { UserController } from './user.controller'
import { UserCrudService } from './user.crud'
import { UserService } from './user.service'
import { ProfileImageCrud } from './profile-image.crud'
import { MailchimpModule } from '../../../integrations/mailchimp/mailchimp.module'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, ProfilePhotoEntity, ReferralEntity]),
    CognitoModule,
    S3Module,
    MailchimpModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserCrudService, ProfileImageCrud, ReferralEntityService],
  exports: [UserCrudService],
})
export class UserModule {}
