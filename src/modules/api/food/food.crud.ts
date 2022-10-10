import { FoodEntity } from './../../../database/entities/food.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PaginationOptionsDTO } from '../../../core/dtos/pagination'

@Injectable()
export class FoodCrudService {
  constructor(
    @InjectRepository(FoodEntity)
    private foodRepo: Repository<FoodEntity>,
  ) {}

  public async getAllWithParams(params: PaginationOptionsDTO): Promise<{
    entities: FoodEntity[]
    totalCount: number
  }> {
    const queryBuilder = this.foodRepo.createQueryBuilder('food')

    queryBuilder.leftJoinAndSelect('food.videoPreview', 'videoPreview')

    queryBuilder.skip((params.page - 1) * params.take).take(params.take)

    const [entities, totalCount] = await queryBuilder.getManyAndCount()

    return { entities, totalCount }
  }
}
