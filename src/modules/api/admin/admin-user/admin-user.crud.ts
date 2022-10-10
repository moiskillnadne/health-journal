import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserAdminEntity } from '../../../../database/entities/user-admin.entity'
import { AdminUserPaginationOptionsDTO } from './admin-user.dto'
import { PaginationOptionsDTO } from '../../../../core/dtos/pagination'
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult'

@Injectable()
export class AdminUserCrud {
  constructor(
    @InjectRepository(UserAdminEntity)
    protected adminUserRepository: Repository<UserAdminEntity>,
  ) {}

  async getAdminUserById(userId: string): Promise<UserAdminEntity> {
    return this.adminUserRepository.findOneBy({ id: userId })
  }

  async updateAdminUser(user: UserAdminEntity): Promise<UpdateResult> {
    return this.adminUserRepository.update(user.id, user)
  }

  async getAdminUsersByFilterParams(
    filterParams: AdminUserPaginationOptionsDTO,
  ): Promise<{ entities: UserAdminEntity[]; totalCount: number }> {
    const queryBuilder = this.adminUserRepository.createQueryBuilder('ua')
    const totalCount = await queryBuilder.getCount()

    const preparedOrder = PaginationOptionsDTO.parseOrder(filterParams.order)

    queryBuilder
      .addSelect('ua.createAt')
      .addSelect('ua.updateAt')
      .orderBy(`ua.${preparedOrder.field}`, preparedOrder.sort)
      .skip((filterParams.page - 1) * filterParams.take)
      .take(filterParams.take)
    const entities = await queryBuilder.getMany()

    return { entities, totalCount }
  }
}
