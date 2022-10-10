import { FindManyOptions, FindOptionsRelations, Repository, UpdateResult } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

import { UserAuthParamsDto } from './dto/user.dto'
import { UserEntity } from '../../../database/entities/user.entity'
import { CryptService } from '../../../core/services/crypt.service'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

@Injectable()
export class UserCrudService extends CryptService {
  constructor(
    @InjectRepository(UserEntity)
    protected userRepository: Repository<UserEntity>,
    protected configService: ConfigService,
  ) {
    super(configService)
  }

  public async saveUser(userInfo: UserAuthParamsDto): Promise<UserEntity> {
    return this.userRepository.save(userInfo)
  }

  public getUsers(): Promise<UserEntity[]> {
    return this.userRepository.find()
  }

  public getUserById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } })
  }

  public getUsersByParams(params: FindManyOptions<UserEntity>): Promise<UserEntity[]> {
    return this.userRepository.find(params)
  }

  public getUserIds(): Promise<UserEntity[]> {
    return this.userRepository
      .createQueryBuilder('u')
      .select('u.id', 'id')
      .leftJoin('u.card', 'uc')
      .where('u.isEmailConfirmed = true')
      .andWhere('u.genderId IS NOT NULL')
      .andWhere('u.raceId IS NOT NULL')
      .andWhere('uc.id IS NOT NULL')
      .getRawMany()
  }

  public getUserInfoById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        country: true,
        city: true,
        state: true,
      },
      where: { id },
    })
  }

  public getUserShareParamsById(id: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder('u')
      .addSelect('uc.createAt')
      .leftJoinAndSelect('u.race', 'ur')
      .leftJoinAndSelect('u.gender', 'ug')
      .leftJoinAndSelect('u.conditions', 'uc')
      .leftJoinAndSelect('uc.condition', 'ucc')
      .leftJoinAndSelect('u.additionalInformation', 'ua')
      .leftJoinAndSelect('u.medications', 'um')
      .leftJoinAndSelect('um.medication', 'umm')
      .leftJoinAndSelect('u.procedures', 'up')
      .where('u.id = :id', { id })
      .getOne()
  }

  public getUserByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.createQueryBuilder('u').select('*').where({ username }).getRawOne<UserEntity>()
  }

  public getUserByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { email } })
  }

  public getUserByCognitoId(cognitoId: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { cognitoId } })
  }

  public getUserConditionsById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      relations: {
        conditions: {
          condition: true,
        },
      },
      where: { id },
    })
  }

  public getUserProceduresById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      relations: {
        procedures: {
          procedure: true,
        },
      },
      where: { id },
    })
  }

  public updateUserById(id: string, fields: QueryDeepPartialEntity<UserEntity>): Promise<UpdateResult> {
    return this.userRepository.update(id, fields)
  }

  public getUserByIdWithRelations(id: string, relations: FindOptionsRelations<UserEntity>) {
    return this.userRepository.findOne({
      relations: { ...relations },
      where: { id },
    })
  }

  public resetLoginFailedAttemptsCount(user: UserEntity): Promise<UpdateResult> {
    return this.updateUserById(user.id, { loginFailedAttemptsCount: 0 })
  }

  public updateLastLoginAttemptAt(user: UserEntity): Promise<UpdateResult> {
    return this.updateUserById(user.id, { lastLoginAttemptAt: new Date() })
  }

  public updateLastLoginAt(user: UserEntity): Promise<UpdateResult> {
    return this.updateUserById(user.id, { lastLoginAt: new Date() })
  }

  public incrementLoginFailedAttempt(user: UserEntity) {
    return this.userRepository.manager.transaction(async (em) => {
      return await em
        .createQueryBuilder(UserEntity, 'u')
        .select('u.id')
        .setLock('pessimistic_write')
        .where({ id: user.id })
        .getOne()
        .then(async (result) => {
          if (!result) {
            throw new Error('Storage item for updating not found')
          }
          return await em
            .createQueryBuilder(UserEntity, 'u')
            .update(UserEntity)
            .set({ loginFailedAttemptsCount: () => '"loginFailedAttemptsCount" + 1' })
            .where('id=:id', { id: result.id })
            .returning(['id', 'loginFailedAttemptsCount'])
            .updateEntity(true)
            .execute()
        })
    })
  }

  public successLoginUpdates(user: UserEntity): Promise<UpdateResult> {
    return this.updateUserById(user.id, {
      lastLoginAt: new Date(),
      loginFailedAttemptsCount: 0,
    })
  }

  public confirmUserEmail(user: UserEntity) {
    return this.updateUserById(user.id, {
      isEmailConfirmed: true,
      emailConfirmedAt: new Date(),
    })
  }
}
