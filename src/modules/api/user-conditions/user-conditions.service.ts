import { HttpStatus, Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { ConditionStatus } from '../../../constants/enums/condition.constants'
import { IBaseResponse } from '../../../models/response.models'

import { ConditionsParamsDto } from '../assessment/services/assessment-health/dto/assessment-health-conditions.dto'

import { UserConditionsCrudService } from './user-conditions.crud'

import { PatchUserConditionParamsDto } from './dto/user-condition.dto'
import { UserConditionsResponseDto } from './dto/user-condition.response.dto'
import { PageDTO, PageMetaDTO, PaginationOptionsDTO } from '../../../core/dtos/pagination'

@Injectable()
export class UserConditionsService {
  constructor(private userConditionsCrudService: UserConditionsCrudService) {}

  public async saveUserCondition(
    userId: string,
    params: ConditionsParamsDto[],
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    if (params?.length > 0) {
      await this.userConditionsCrudService.addUserConditionsByParams(
        params.map(({ id, info }) => ({
          userId,
          conditionId: id,
          info: info || null,
        })),
      )
    }

    return {
      code: SuccessCodes.UserConditionSaved,
      httpCode: HttpStatus.CREATED,
      message: i18n.t(DictionaryPathToken.UserConditionWasAdded),
    }
  }

  public async makeUserConditionResolved(
    { conditionId }: PatchUserConditionParamsDto,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const resolveParams = {
      status: ConditionStatus.Resolved,
      conditionResolvedDate: new Date(),
    }

    await this.userConditionsCrudService.updateByConditionId(conditionId, resolveParams)

    return {
      code: SuccessCodes.UserConditionResolved,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.UpdatedSuccessfully),
    }
  }

  public async getUserCurrentConditions(id: string): Promise<UserConditionsResponseDto[]> {
    const conditions = await this.userConditionsCrudService.getUserConditionsByParams(id, {
      where: { status: ConditionStatus.Current },
    })

    return conditions.entities.map(({ condition, ...rest }) => ({
      name: condition.name,
      ...rest,
    }))
  }

  public async getUserResolvedConditions(
    id: string,
    paginationParams: PaginationOptionsDTO,
  ): Promise<PageDTO<UserConditionsResponseDto>> {
    const { entities, totalCount } = await this.userConditionsCrudService.getUserConditionsByParams(id, {
      where: { status: ConditionStatus.Resolved },
    })

    const formatedConditions = entities.map(({ condition, ...rest }) => ({
      name: condition.name,
      ...rest,
    }))

    const pageMetaDto = new PageMetaDTO({ paginationOptionsDto: paginationParams, itemCount: totalCount })

    return new PageDTO(formatedConditions, pageMetaDto)
  }
}
