import { OptionsResponseDto } from './../../../core/dtos/response/options.dto'
import { In, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { defaultOrder } from '../../../constants/enums/pagination.constants'
import { defaultMedicationsGroupColumn } from '../../../constants/enums/medications.constants'

import { MedicationsEntity } from '../../../database/entities/medications.entity'
import { PageDTO, PageMetaDTO } from '../../../core/dtos/pagination'

import { MedicationsPaginationOptionalParamsDto } from './dto/medications.dto'
import { MedicationsAdminSearchDto } from './dto/medications-response.dto'

@Injectable()
export class MedicationsCrudService {
  constructor(
    @InjectRepository(MedicationsEntity)
    protected medicationsRepository: Repository<MedicationsEntity>,
  ) {}

  async getMedicationNamesByParams(
    params: MedicationsPaginationOptionalParamsDto,
  ): Promise<PageDTO<MedicationsEntity>> {
    const queryBuilder = this.medicationsRepository.createQueryBuilder()

    queryBuilder
      .select(defaultMedicationsGroupColumn)
      .addSelect(`COUNT(*) OVER ()`, 'total')
      .groupBy(defaultMedicationsGroupColumn)
      .orderBy(defaultMedicationsGroupColumn)
      .skip((params.page - 1) * params.take)
      .take(params.take)

    if (params.name) {
      queryBuilder.where('name ilike :name', { name: `${params.name}%` })
    }

    const entities = await queryBuilder.getRawMany()
    const total = entities[0]?.total || 0
    const medications = entities.reduce((acc, item) => {
      acc.push(item.name)
      return acc
    }, [])

    const pageMetaDto = new PageMetaDTO({
      paginationOptionsDto: { ...params, order: `${defaultMedicationsGroupColumn} ${defaultOrder}` },
      itemCount: Number(total),
    })

    return new PageDTO(medications, pageMetaDto)
  }

  /**
   * This method searches medications by keyword match if given, group by name and returns in format [{name: <medication name>, productId: <medication productId>}]
   * Note that the “productId” of a set is unpredictable.
   */
  async getMedicationNamesIdsByParams(
    params: MedicationsPaginationOptionalParamsDto,
  ): Promise<PageDTO<Array<MedicationsAdminSearchDto>>> {
    const queryBuilder = this.medicationsRepository.createQueryBuilder()
    queryBuilder
      .select(`DISTINCT ON (${defaultMedicationsGroupColumn}) name`)
      .addSelect(`"productId"`)
      .addSelect(`COUNT(*) OVER ()`, 'total')
      .orderBy(defaultMedicationsGroupColumn)
      .skip((params.page - 1) * params.take)
      .take(params.take)

    if (params.name) {
      queryBuilder.where('name ilike :name', { name: `${params.name}%` })
    }

    const entities = await queryBuilder.getRawMany()
    const total = entities[0]?.total || 0
    const medications = entities.reduce((acc, item) => {
      acc.push({ name: item.name, productId: item.productId })
      return acc
    }, [])

    const pageMetaDto = new PageMetaDTO({
      paginationOptionsDto: { ...params, order: `${defaultMedicationsGroupColumn} ${defaultOrder}` },
      itemCount: Number(total),
    })

    return new PageDTO(medications, pageMetaDto)
  }

  async getMedicationDosesByName(name: string): Promise<OptionsResponseDto[]> {
    const medications = await this.medicationsRepository
      .createQueryBuilder()
      .select('array_agg("productId")', 'id')
      .addSelect(['dose', 'units'])
      .where('name = :name', { name })
      .groupBy('dose')
      .addGroupBy('units')
      .getRawMany()

    return medications.map((item) => ({
      value: item.id[0],
      label: `${item.dose.join('/')} ${item.units}`,
    }))
  }

  async upsertMedicationsWithParams(params: Partial<MedicationsEntity>[]) {
    return this.medicationsRepository.upsert(params, {
      conflictPaths: ['productId'],
      skipUpdateIfNoValuesChanged: true,
    })
  }

  getMedicationsByProductIds(productIds: string[]): Promise<MedicationsEntity[]> {
    return this.medicationsRepository.findBy({ productId: In(productIds) })
  }
}
