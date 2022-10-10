import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, UpdateResult } from 'typeorm'
import { UserAdminEntity } from '../../../../database/entities/user-admin.entity'
import { IUserAdminModel } from '../../../../models/user-admin.models'
import { StorageEntity } from '../../../../database/entities/storage.entity'

@Injectable()
export class UserAdminEntityBaseService {
  constructor(
    @InjectRepository(UserAdminEntity)
    protected userRepository: Repository<UserAdminEntity>,
    protected configService: ConfigService,
  ) {}

  public async saveUser(userInfo: IUserAdminModel): Promise<UserAdminEntity> {
    return this.userRepository.save(userInfo)
  }

  public getUserById(id: string): Promise<UserAdminEntity> {
    return this.userRepository.findOne({ where: { id } })
  }

  public getUserByUsername(username: string): Promise<UserAdminEntity> {
    return this.userRepository.findOne({ where: { username } })
  }

  public getUserByEmail(email: string): Promise<UserAdminEntity> {
    return this.userRepository.createQueryBuilder('u').select('*').where({ email }).getRawOne<UserAdminEntity>()
  }

  public getUserByCognitoId(cognitoId: string): Promise<UserAdminEntity> {
    return this.userRepository.findOne({ where: { cognitoId } })
  }

  public successLoginUpdates(adminUser: IUserAdminModel): Promise<UpdateResult> {
    return this.userRepository.update(adminUser.id, {
      lastLoginAt: new Date(),
      loginFailedAttemptsCount: 0,
    })
  }

  public updateLastLoginAttemptAt(adminUser: IUserAdminModel): Promise<UpdateResult> {
    return this.userRepository.update(adminUser.id, { lastLoginAttemptAt: new Date() })
  }

  public updateUserLastLogin(adminUser: IUserAdminModel): Promise<UpdateResult> {
    return this.userRepository.update(adminUser.id, { lastLoginAt: new Date() })
  }

  public resetLoginFailedAttemptsCount(adminUser: IUserAdminModel): Promise<UpdateResult> {
    return this.userRepository.update(adminUser.id, { loginFailedAttemptsCount: 0 })
  }

  public incrementLoginFailedAttempt(adminUser: IUserAdminModel) {
    return this.userRepository.manager.transaction(async (em) => {
      return await em
        .createQueryBuilder(UserAdminEntity, 'ua')
        .select('ua.id')
        .setLock('pessimistic_write')
        .where({ id: adminUser.id })
        .getOne()
        .then(async (result) => {
          if (!result) {
            throw new Error('Storage item for updating not found')
          }
          return await em
            .createQueryBuilder(UserAdminEntity, 'ua')
            .update(UserAdminEntity)
            .set({ loginFailedAttemptsCount: () => '"loginFailedAttemptsCount" + 1' })
            .where('id=:id', { id: result.id })
            .returning(['id', 'loginFailedAttemptsCount'])
            .updateEntity(true)
            .execute()
        })
    })
  }
}
