import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { ProfilePhotoEntity } from '../../../database/entities/profile-photo.entity'
import { ProfileImageSaveDTO } from './dto/profile-image.dto'

@Injectable()
export class ProfileImageCrud {
  constructor(
    @InjectRepository(ProfilePhotoEntity)
    protected profileImageRepo: Repository<ProfilePhotoEntity>,
  ) {}

  public async saveProfileImage(profileImage: ProfileImageSaveDTO, userId: string): Promise<ProfilePhotoEntity> {
    const profilePhotoByUserId = await this.getProfileImageByUserId(userId)

    if (profilePhotoByUserId) {
      await this.updateProfilePhotoById(profilePhotoByUserId.id, profileImage)
      return this.getProfileImageByUserId(userId)
    }

    return this.profileImageRepo.save({ user: { id: userId }, base64: profileImage.data, mimeType: profileImage.mime })
  }

  public getProfileImageByUserId(id: string): Promise<ProfilePhotoEntity> {
    return this.profileImageRepo.findOne({ where: { user: { id } } })
  }

  public getProfileImageById(id: string): Promise<ProfilePhotoEntity> {
    return this.profileImageRepo.findOne({ where: { id } })
  }

  public async updateProfilePhotoById(id: string, profileImage: ProfileImageSaveDTO) {
    return this.profileImageRepo.update(id, { base64: profileImage.data, mimeType: profileImage.mime })
  }
}
