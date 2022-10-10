import { DeleteResult } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { differenceInYears } from 'date-fns'

import { Gender } from '../../../constants/enums/gender.constants'
import { TargetGroup } from '../../../constants/enums/target-group.constants'
import { Condition, conditionToTargetGroup } from '../../../constants/enums/condition.constants'

import { UserCrudService } from '../user/user.crud'
import { UserCardBmiCrudService } from '../user-card-bmi/user-card-bmi.crud'
import { TargetGroupCrud } from '../target-group/target-group.crud'

import {
  getUserTargetGroupTags,
  getUserConditionsTargetGroupTags,
  getUserConditionsTags,
} from './user-target-groups.helper'
import { UserTargetGroupsCrudService } from './user-target-groups.crud'
import { UserTargetGroupsEntity } from '../../../database/entities/user-target-groups.entity'

@Injectable()
export class UserTargetGroupsService {
  constructor(
    private userCrudService: UserCrudService,
    private userTargetGroupsCrudService: UserTargetGroupsCrudService,
    private userCardBmiCrudService: UserCardBmiCrudService,
    private targetGroupCrudService: TargetGroupCrud,
  ) {}

  public async assignUserTargetGroupsByConditions(
    userId: string,
  ): Promise<Awaited<UserTargetGroupsEntity | DeleteResult>[]> {
    const [user, targetGroupsTags] = await Promise.all([
      this.userCrudService.getUserByIdWithRelations(userId, {
        conditions: {
          condition: true,
        },
        targetGroups: {
          targetGroup: true,
        },
      }),
      this.targetGroupCrudService.getTargetGroupTags(),
    ])

    const userTargetGroupTags = getUserTargetGroupTags(user.targetGroups)
    const assignTargetGroupTags = getUserConditionsTargetGroupTags(user.conditions)

    const promises = Object.keys(conditionToTargetGroup).reduce(
      (result: Promise<UserTargetGroupsEntity | DeleteResult>[], condition) => {
        const tag = conditionToTargetGroup[condition]

        if (assignTargetGroupTags.includes(tag)) {
          if (!userTargetGroupTags.includes(tag)) {
            result.push(this.userTargetGroupsCrudService.addUserTargetGroupByUserId(userId, targetGroupsTags[tag]))
          }

          return result
        }

        if (userTargetGroupTags.includes(tag)) {
          result.push(this.userTargetGroupsCrudService.deleteUserTargetGroupByUserId(userId, targetGroupsTags[tag]))
        }

        return result
      },
      [],
    )

    return Promise.all(promises)
  }

  public async assignUserTargetGroupsByGenderAndAge(
    userId: string,
  ): Promise<Awaited<UserTargetGroupsEntity | DeleteResult>[]> {
    const [user, targetGroupsTags] = await Promise.all([
      this.userCrudService.getUserByIdWithRelations(userId, {
        gender: true,
        targetGroups: {
          targetGroup: true,
        },
      }),
      this.targetGroupCrudService.getTargetGroupTags(),
    ])

    const userTargetGroupTags = getUserTargetGroupTags(user.targetGroups)

    const isMale = user.gender.name === Gender.Male
    const isFemale = user.gender.name === Gender.Female

    const promises = []

    if (isMale || isFemale) {
      if (!userTargetGroupTags.includes(isMale ? TargetGroup.Males : TargetGroup.Females)) {
        promises.push(
          this.userTargetGroupsCrudService.addUserTargetGroupByUserId(
            userId,
            targetGroupsTags[isMale ? TargetGroup.Males : TargetGroup.Females],
          ),
        )
      }

      if (differenceInYears(new Date(user.dateOfBirth), new Date()) >= 45) {
        if (!userTargetGroupTags.includes(isMale ? TargetGroup.MalesMore45 : TargetGroup.FemalesMore45)) {
          promises.push(
            this.userTargetGroupsCrudService.addUserTargetGroupByUserId(
              userId,
              targetGroupsTags[isMale ? TargetGroup.MalesMore45 : TargetGroup.FemalesMore45],
            ),
          )
        }
        if (userTargetGroupTags.includes(isMale ? TargetGroup.MalesBelow45 : TargetGroup.FemalesBelow45)) {
          promises.push(
            this.userTargetGroupsCrudService.deleteUserTargetGroupByUserId(
              userId,
              targetGroupsTags[isMale ? TargetGroup.MalesBelow45 : TargetGroup.FemalesBelow45],
            ),
          )
        }
      }

      if (differenceInYears(new Date(user.dateOfBirth), new Date()) < 45) {
        if (!userTargetGroupTags.includes(isMale ? TargetGroup.MalesBelow45 : TargetGroup.FemalesBelow45)) {
          promises.push(
            this.userTargetGroupsCrudService.addUserTargetGroupByUserId(
              userId,
              targetGroupsTags[isMale ? TargetGroup.MalesBelow45 : TargetGroup.FemalesBelow45],
            ),
          )
        }
        if (userTargetGroupTags.includes(isMale ? TargetGroup.MalesMore45 : TargetGroup.FemalesMore45)) {
          promises.push(
            this.userTargetGroupsCrudService.deleteUserTargetGroupByUserId(
              userId,
              targetGroupsTags[isMale ? TargetGroup.MalesMore45 : TargetGroup.FemalesMore45],
            ),
          )
        }
      }
    }

    return Promise.all(promises)
  }

  public async assignUserTargetGroupsByBmi(userId: string): Promise<void> {
    const [user, targetGroupsTags] = await Promise.all([
      this.userCrudService.getUserByIdWithRelations(userId, {
        card: true,
        targetGroups: {
          targetGroup: true,
        },
        conditions: {
          condition: true,
        },
      }),
      this.targetGroupCrudService.getTargetGroupTags(),
    ])

    const userTargetGroupTags = getUserTargetGroupTags(user.targetGroups)
    const userConditionsTags = getUserConditionsTags(user.conditions)

    const { bmi } = await this.userCardBmiCrudService.getUserLastBmiByUserId(userId)

    if (bmi >= 25 && !userTargetGroupTags.includes(TargetGroup.BmiMore25)) {
      await this.userTargetGroupsCrudService.addUserTargetGroupByUserId(userId, targetGroupsTags[TargetGroup.BmiMore25])
    }

    if (
      bmi < 25 &&
      userTargetGroupTags.includes(TargetGroup.BmiMore25) &&
      !userConditionsTags.includes(Condition.OverweightOrObese)
    ) {
      await this.userTargetGroupsCrudService.deleteUserTargetGroupByUserId(
        userId,
        targetGroupsTags[TargetGroup.BmiMore25],
      )
    }
  }

  public async assignTargetGroupByUserId(userId: string, targetGroup: TargetGroup): Promise<UserTargetGroupsEntity> {
    const targetGroupsTags = await this.targetGroupCrudService.getTargetGroupTags()

    return this.userTargetGroupsCrudService.addUserTargetGroupByUserId(userId, targetGroupsTags[targetGroup])
  }
}
