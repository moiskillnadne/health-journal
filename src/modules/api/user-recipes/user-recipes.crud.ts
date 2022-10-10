import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, Repository } from 'typeorm'
import { UserRecipesEntity } from '../../../database/entities/user-recipes.entity'

@Injectable()
export class UserRecipesCrudService {
  constructor(
    @InjectRepository(UserRecipesEntity)
    private userRecipesRepository: Repository<UserRecipesEntity>,
  ) {}

  public getQuery(userId: string) {
    return this.userRecipesRepository
      .createQueryBuilder('ur')
      .select(['"isFavorite"', '"isVisited"', '"userId"', '"galleryItemId"'])
      .addSelect('ur.id', 'id')
      .where(`ur.userId = ${userId}`)
      .getQuery()
  }

  public async findByRecipeIdAndUserIdOrCreate(
    userId: string,
    recipeId: string,
    params?: Partial<UserRecipesEntity>,
  ): Promise<UserRecipesEntity> {
    const userRecipeItem = await this.userRecipesRepository.findOne({
      where: {
        userId,
        galleryItemId: recipeId,
      },
    })

    if (!userRecipeItem) {
      let saveOptions: Partial<UserRecipesEntity> = {
        userId,
        galleryItemId: recipeId,
      }

      if (params) {
        saveOptions = { ...saveOptions, ...params }
      }

      return this.userRecipesRepository.save(saveOptions)
    }

    return userRecipeItem
  }

  public async findManyByUserIdWithParams(userId: string, params: FindManyOptions<UserRecipesEntity> = {}) {
    return this.userRecipesRepository.find({
      ...params,
      where: {
        userId,
        ...params.where,
      },
    })
  }

  public updateById(id: string, params: Partial<UserRecipesEntity>) {
    return this.userRecipesRepository.update({ id }, { ...params })
  }
}
