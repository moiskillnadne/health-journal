import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../../../../../database/entities/user.entity'
import { Brackets, Repository } from 'typeorm'
import { ConditionsEntity } from '../../../../../database/entities/conditions.entity'
import { RaceEntity } from '../../../../../database/entities/race.entity'
import { AnalyticReportFilter, MaxUserInactivePeriod } from '../../../../../constants/enums/admin/analytics.constants'
import { GenderEntity } from '../../../../../database/entities/gender.entity'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { v4 as uniq } from 'uuid'
import { Procedure } from '../../../../../constants/enums/procedures.constants'
import { ConditionStatus } from '../../../../../constants/enums/condition.constants'
import { Status } from '../../../../../constants/enums/medications.constants'
import { Currency } from '../../../../../constants/enums/currency.constants'

@Injectable()
export class AnalyticCrud {
  constructor(
    @InjectRepository(UserEntity)
    protected userRepository: Repository<UserEntity>,
    @InjectRepository(ConditionsEntity)
    protected conditionsEntityRepository: Repository<ConditionsEntity>,
    @InjectRepository(RaceEntity)
    protected raceEntityRepository: Repository<RaceEntity>,
    @InjectRepository(GenderEntity)
    protected genderEntityRepository: Repository<GenderEntity>,
  ) {}

  public getAgeRangeUsersCount(
    ageRange: { minYears?: number; maxYears?: number },
    analyticReportFilter: AnalyticReportFilter,
  ): Promise<number> {
    const reportDate = analyticReportFilter.reportDate ? analyticReportFilter.reportDate : new Date()

    const qb = this.userRepository.createQueryBuilder('u')
    this.applyUserFilter('u', qb, analyticReportFilter)

    if (ageRange.minYears !== undefined) {
      qb.andWhere('EXTRACT(YEAR FROM AGE(:calcMinReportDate, u."dateOfBirth")) >= :minYears', {
        calcMinReportDate: reportDate,
        minYears: ageRange.minYears,
      })
    }

    if (ageRange.maxYears !== undefined) {
      qb.andWhere('EXTRACT(YEAR FROM AGE(:calcMaxReportDate, u."dateOfBirth")) <= :maxYears', {
        calcMaxReportDate: reportDate,
        maxYears: ageRange.maxYears,
      })
    }

    return qb.getCount()
  }

  public getUserGendersCounts(
    analyticReportFilter: AnalyticReportFilter,
  ): Promise<{ gender: string; count: number }[]> {
    const qb = this.genderEntityRepository
      .createQueryBuilder('g')
      .select(['g.name gender', 'coalesce(user_genders_count.count, 0) count'])
      .leftJoin(
        (qb) => {
          qb.select(['_g.id id', '_g.name name', 'COUNT(*) count'])
            .from(UserEntity, '_u')
            .leftJoin('_u.gender', '_g')
            .andWhere('_g.id IS NOT NULL')
            .groupBy('_g.id')
          return this.applyUserFilter('_u', qb, analyticReportFilter)
        },
        'user_genders_count',
        'g.id = user_genders_count.id',
      )

    return qb.execute()
  }

  public getUserRacesCounts(analyticReportFilter: AnalyticReportFilter): Promise<{ race: string; count: number }[]> {
    const qb = this.raceEntityRepository
      .createQueryBuilder('r')
      .select(['r.name race', 'coalesce(user_races_count.count, 0) count'])
      .leftJoin(
        (qb) => {
          qb.select(['_r.id id', '_r.name name', 'COUNT(*) count'])
            .from(UserEntity, '_u')
            .leftJoin('_u.race', '_r')
            .andWhere('_r.id IS NOT NULL')
            .groupBy('_r.id')
          return this.applyUserFilter('_u', qb, analyticReportFilter)
        },
        'user_races_count',
        'r.id = user_races_count.id',
      )

    return qb.execute()
  }

  public getUsersLocationsCount(
    analyticReportFilter: AnalyticReportFilter,
  ): Promise<{ country: string | null; state: string | null; city: string | null; count: number | null }[]> {
    const qb = this.userRepository
      .createQueryBuilder('u')
      .select(['u.country country', 'u.state state', 'u.city city', 'COUNT(u.*) count'])
      .groupBy('u.city, u.state, u.country')
      .orderBy('u.country', 'ASC', 'NULLS LAST')
    this.applyUserFilter('u', qb, analyticReportFilter)

    return qb.execute()
  }

  public async getConditionsUsersCount(
    analyticReportFilter: AnalyticReportFilter,
  ): Promise<{ name: string; users_count: number }[]> {
    const qb = this.conditionsEntityRepository
      .createQueryBuilder('c')
      .select(['c.name name', 'coalesce(user_conditions_count.users_count, 0) users_count'])
      .leftJoin(
        (qb) => {
          qb.select(['_c.id id', 'COUNT(DISTINCT _u.id) users_count'])
            .from(UserEntity, '_u')
            .leftJoin('_u.conditions', '_uc')
            .leftJoin('_uc.condition', '_c')
            .andWhere('_c.id IS NOT NULL')
            .groupBy('_c.id')

          if (analyticReportFilter.reportDate) {
            qb.andWhere(`_uc."createAt" <= to_timestamp(:reportDate)::date`, {
              reportDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
            }).andWhere(
              new Brackets((qb) =>
                qb.where('_uc.status = :currentStatus', { currentStatus: ConditionStatus.Current }).orWhere(
                  new Brackets((qb) =>
                    qb
                      .where('_uc.status = :resolvedStatus', { resolvedStatus: ConditionStatus.Resolved })
                      .andWhere('_uc."conditionResolvedDate" > to_timestamp(:medLastActiveDate)::date', {
                        medLastActiveDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
                      }),
                  ),
                ),
              ),
            )
          } else {
            qb.andWhere('_uc.status=:currentStatus', { currentStatus: ConditionStatus.Current })
          }

          return this.applyUserFilter('_u', qb, analyticReportFilter)
        },
        'user_conditions_count',
        'c.id = user_conditions_count.id',
      )

    return qb.execute()
  }

  public getUsersCountHaveConditions(analyticReportFilter: AnalyticReportFilter): Promise<number> {
    const qb = this.userRepository
      .createQueryBuilder('u')
      .select(['COUNT(DISTINCT u.id) users_count'])
      .leftJoin('u.conditions', 'uc')
      .leftJoin('uc.condition', 'c')
      .andWhere('c.id IS NOT NULL')

    if (analyticReportFilter.reportDate) {
      qb.andWhere(`uc."createAt" <= to_timestamp(:reportDate)::date`, {
        reportDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
      }).andWhere(
        new Brackets((qb) =>
          qb.where('uc.status = :currentStatus', { currentStatus: ConditionStatus.Current }).orWhere(
            new Brackets((qb) =>
              qb
                .where('uc.status = :resolvedStatus', { resolvedStatus: ConditionStatus.Resolved })
                .andWhere('uc."conditionResolvedDate" > to_timestamp(:medLastActiveDate)::date', {
                  medLastActiveDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
                }),
            ),
          ),
        ),
      )
    } else {
      qb.andWhere('uc.status=:currentStatus', { currentStatus: ConditionStatus.Current })
    }
    this.applyUserFilter('u', qb, analyticReportFilter)
    return qb.execute().then((result) => result[0]['users_count'])
  }

  public getUsersCount(analyticReportFilter: AnalyticReportFilter): Promise<number> {
    const qb = this.userRepository.createQueryBuilder('u')
    this.applyUserFilter('u', qb, analyticReportFilter)

    return qb.getCount()
  }

  public getMedsUsageDataByCurrency(
    analyticReportFilter: AnalyticReportFilter,
  ): Promise<Array<{ currency: Currency; users_count: number; meds_count: number; total_cost: number }>> {
    return this.getMedsAnalyticQuery(analyticReportFilter)
      .select([
        'um.currency currency',
        'count(DISTINCT u.id) users_count',
        'count(um.id) meds_count',
        'round(SUM(um.amount)::numeric, 2) total_cost',
      ])
      .groupBy('um.currency')
      .execute()
  }

  public getUsersCountHaveMedData(analyticReportFilter: AnalyticReportFilter): Promise<number> {
    const qb = this.getMedsAnalyticQuery(analyticReportFilter).select(['count(DISTINCT u.id) users_count'])
    return qb.execute().then((result) => result[0]['users_count'])
  }

  protected getMedsAnalyticQuery(analyticReportFilter: AnalyticReportFilter): SelectQueryBuilder<UserEntity> {
    const qb = this.userRepository.createQueryBuilder('u').leftJoin('u.medications', 'um').andWhere('um.id IS NOT NULL')

    if (analyticReportFilter.reportDate) {
      qb.andWhere('um."createAt" < to_timestamp(:maxCreateAtMed)::date', {
        maxCreateAtMed: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
      }).andWhere(
        new Brackets((qb) =>
          qb.where('um.status = :activeStatus', { activeStatus: Status.Active }).orWhere(
            new Brackets((qb) =>
              qb
                .where('um.status = :inactiveStatus', { inactiveStatus: Status.Inactive })
                .andWhere('um."statusUpdated" > to_timestamp(:medLastActiveDate)::date', {
                  medLastActiveDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
                }),
            ),
          ),
        ),
      )
    } else {
      qb.andWhere('um.status = :activeStatus', { activeStatus: Status.Active })
    }

    return this.applyUserFilter('u', qb, analyticReportFilter)
  }

  public async getUsersLastBloodPressureData(
    analyticReportFilter: AnalyticReportFilter,
  ): Promise<Array<{ systolic: number; diastolic: number }>> {
    const qb = this.userRepository
      .createQueryBuilder('u')
      .select(['ubp."pressureSystolicMmHg" "systolic"', 'ubp."pressureDiastolicMmHg" "diastolic"'])
      .leftJoin('u.card', 'uc')
      .leftJoin('uc.bloodPressure', 'ubp')
      .leftJoin(
        (qb) => {
          qb.select(['_u.id user_id', 'MAX(_ubp."datetime") last_blood_pressure_dt'])
            .from(UserEntity, '_u')
            .leftJoin('_u.card', '_uc')
            .leftJoin('_uc.bloodPressure', '_ubp')
            .andWhere('_ubp.id IS NOT NULL')
            .groupBy('_u.id')

          if (analyticReportFilter.reportDate) {
            qb.andWhere(`_ubp."datetime" <= to_timestamp(:_reportDate)::date`, {
              _reportDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
            })
          }

          return this.applyUserFilter('_u', qb, analyticReportFilter)
        },
        'user_last_blood_pressure_values',
        'u.id=user_last_blood_pressure_values.user_id AND ubp."datetime"=user_last_blood_pressure_values.last_blood_pressure_dt',
      )
      .andWhere('user_last_blood_pressure_values.user_id IS NOT NULL')
    if (analyticReportFilter.reportDate) {
      qb.andWhere(`ubp."datetime" <= to_timestamp(:reportDate)::date`, {
        reportDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
      })
    }
    this.applyUserFilter('u', qb, analyticReportFilter)

    return await qb.execute().then((result) =>
      (result ?? []).map((row) => ({
        systolic: row.systolic ? parseFloat(row.systolic) : 0,
        diastolic: row.diastolic ? parseFloat(row.diastolic) : 0,
      })),
    )
  }

  public async getUsersLastWeightData(
    analyticReportFilter: AnalyticReportFilter,
  ): Promise<Array<{ weightLb: number; bmi: number }>> {
    const qb = this.userRepository
      .createQueryBuilder('u')
      .select([
        'ucw."weightLb" "weightLb"',
        'CASE WHEN (coalesce(uc."heightFt", 0) + coalesce(uc."heightIn", 0))::boolean THEN round((703 * coalesce(ucw."weightLb", 0) / POW((coalesce(uc."heightFt", 0) * 12) + coalesce(uc."heightIn", 0), 2))::numeric, 2) ELSE 0 END bmi',
      ])
      .leftJoin('u.card', 'uc')
      .leftJoin('uc.weight', 'ucw')
      .leftJoin(
        (qb) => {
          qb.select(['_u.id user_id', 'MAX(_ucw."datetime") last_weight_record_dt'])
            .from(UserEntity, '_u')
            .leftJoin('_u.card', '_uc')
            .leftJoin('_uc.weight', '_ucw')
            .andWhere('_ucw.id IS NOT NULL')
            .groupBy('_u.id')

          if (analyticReportFilter.reportDate) {
            qb.andWhere(`_ucw."datetime" <= to_timestamp(:_reportDate)::date`, {
              _reportDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
            })
          }

          return this.applyUserFilter('_u', qb, analyticReportFilter)
        },
        'user_last_weight_values',
        'u.id=user_last_weight_values.user_id AND ucw."datetime"=user_last_weight_values.last_weight_record_dt',
      )
      .andWhere('user_last_weight_values.user_id IS NOT NULL')
    if (analyticReportFilter.reportDate) {
      qb.andWhere(`ucw."datetime" <= to_timestamp(:reportDate)::date`, {
        reportDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
      })
    }
    this.applyUserFilter('u', qb, analyticReportFilter)

    return await qb.execute().then((result) =>
      (result ?? []).map((row) => ({
        weightLb: row.weightLb ? parseFloat(row.weightLb) : 0,
        bmi: row.bmi ? parseFloat(row.bmi) : 0,
      })),
    )
  }

  public async getUsersLastLdlData(
    analyticReportFilter: AnalyticReportFilter,
  ): Promise<Array<{ ldlMgDl: number; ldlMmolL: number }>> {
    const qb = this.userRepository
      .createQueryBuilder('u')
      .select(['uldl."ldlMgDl" "ldlMgDl"', 'uldl."ldlMmolL" "ldlMmolL"'])
      .leftJoin('u.card', 'uc')
      .leftJoin('uc.ldl', 'uldl')
      .leftJoin(
        (qb) => {
          qb.select(['_u.id user_id', 'MAX(_uldl."datetime") last_ldl_dt'])
            .from(UserEntity, '_u')
            .leftJoin('_u.card', '_uc')
            .leftJoin('_uc.ldl', '_uldl')
            .andWhere('_uldl.id IS NOT NULL')
            .groupBy('_u.id')

          if (analyticReportFilter.reportDate) {
            qb.andWhere(`_uldl."datetime" <= to_timestamp(:_reportDate)::date`, {
              _reportDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
            })
          }

          return this.applyUserFilter('_u', qb, analyticReportFilter)
        },
        'user_last_ldl_values',
        'u.id=user_last_ldl_values.user_id AND uldl."datetime"=user_last_ldl_values.last_ldl_dt',
      )
      .andWhere('user_last_ldl_values.user_id IS NOT NULL')
    if (analyticReportFilter.reportDate) {
      qb.andWhere(`uldl."datetime" <= to_timestamp(:reportDate)::date`, {
        reportDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
      })
    }
    this.applyUserFilter('u', qb, analyticReportFilter)
    return await qb.execute().then((result) =>
      (result ?? []).map((row) => ({
        ldlMgDl: row.ldlMgDl ? parseInt(row.ldlMgDl, 10) : 0,
        ldlMmolL: row.ldlMmolL ? parseFloat(row.ldlMmolL) : 0,
      })),
    )
  }

  public async getUsersLastBloodSugarAfterMealData(
    analyticReportFilter: AnalyticReportFilter,
  ): Promise<Array<{ sugarMgDl: number; sugarMmolL: number }>> {
    const qb = this.userRepository
      .createQueryBuilder('u')
      .select(['uambs."sugarMgDl" "sugarMgDl"', 'uambs."sugarMmolL" "sugarMmolL"'])
      .leftJoin('u.card', 'uc')
      .leftJoin('uc.afterMealBloodSugar', 'uambs')
      .leftJoin(
        (qb) => {
          qb.select(['_u.id user_id', 'MAX(_uambs."datetime") last_sugar_dt'])
            .from(UserEntity, '_u')
            .leftJoin('_u.card', '_uc')
            .leftJoin('_uc.afterMealBloodSugar', '_uambs')
            .andWhere('_uambs.id IS NOT NULL')
            .groupBy('_u.id')

          if (analyticReportFilter.reportDate) {
            qb.andWhere(`_uambs."datetime" <= to_timestamp(:_reportDate)::date`, {
              _reportDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
            })
          }

          return this.applyUserFilter('_u', qb, analyticReportFilter)
        },
        'user_last_sugar_values',
        'u.id=user_last_sugar_values.user_id AND uambs."datetime"=user_last_sugar_values.last_sugar_dt',
      )
      .andWhere('user_last_sugar_values.user_id IS NOT NULL')
    if (analyticReportFilter.reportDate) {
      qb.andWhere(`uambs."datetime" <= to_timestamp(:reportDate)::date`, {
        reportDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
      })
    }
    this.applyUserFilter('u', qb, analyticReportFilter)
    return await qb.execute().then((result) =>
      (result ?? []).map((row) => ({
        sugarMgDl: row.sugarMgDl ? parseInt(row.sugarMgDl, 10) : 0,
        sugarMmolL: row.sugarMmolL ? parseFloat(row.sugarMmolL) : 0,
      })),
    )
  }

  public async getUsersLastHba1cData(analyticReportFilter: AnalyticReportFilter): Promise<Array<{ percent: number }>> {
    const qb = this.userRepository
      .createQueryBuilder('u')
      .select(['uhba1c."percent" "percent"'])
      .leftJoin('u.card', 'uc')
      .leftJoin('uc.hba1c', 'uhba1c')
      .leftJoin(
        (qb) => {
          qb.select(['_u.id user_id', 'MAX(_uhba1c."datetime") last_hba1c_dt'])
            .from(UserEntity, '_u')
            .leftJoin('_u.card', '_uc')
            .leftJoin('_uc.hba1c', '_uhba1c')
            .andWhere('_uhba1c.id IS NOT NULL')
            .groupBy('_u.id')

          if (analyticReportFilter.reportDate) {
            qb.andWhere(`_uhba1c."datetime" <= to_timestamp(:_reportDate)::date`, {
              _reportDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
            })
          }

          return this.applyUserFilter('_u', qb, analyticReportFilter)
        },
        'user_last_hba1c_values',
        'u.id=user_last_hba1c_values.user_id AND uhba1c."datetime"=user_last_hba1c_values.last_hba1c_dt',
      )
      .andWhere('user_last_hba1c_values.user_id IS NOT NULL')
    if (analyticReportFilter.reportDate) {
      qb.andWhere(`uhba1c."datetime" <= to_timestamp(:reportDate)::date`, {
        reportDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
      })
    }
    this.applyUserFilter('u', qb, analyticReportFilter)
    return await qb.execute().then((result) =>
      (result ?? []).map((row) => ({
        percent: row.percent ? parseFloat(row.percent) : 0,
      })),
    )
  }

  public async getUsersLastTriglycerideData(
    analyticReportFilter: AnalyticReportFilter,
  ): Promise<Array<{ mgDl: number; mmolL: number }>> {
    const qb = this.userRepository
      .createQueryBuilder('u')
      .select(['ut."triglycerideMgDl" "mgDl"', 'ut."triglycerideMmolL" "mmolL"'])
      .leftJoin('u.card', 'uc')
      .leftJoin('uc.triglyceride', 'ut')
      .leftJoin(
        (qb) => {
          qb.select(['_u.id user_id', 'MAX(_ut."datetime") last_triglyceride_dt'])
            .from(UserEntity, '_u')
            .leftJoin('_u.card', '_uc')
            .leftJoin('_uc.triglyceride', '_ut')
            .andWhere('_ut.id IS NOT NULL')
            .groupBy('_u.id')

          if (analyticReportFilter.reportDate) {
            qb.andWhere(`_ut."datetime" <= to_timestamp(:_reportDate)::date`, {
              _reportDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
            })
          }

          return this.applyUserFilter('_u', qb, analyticReportFilter)
        },
        'user_last_triglyceride_values',
        'u.id=user_last_triglyceride_values.user_id AND ut."datetime"=user_last_triglyceride_values.last_triglyceride_dt',
      )
      .andWhere('user_last_triglyceride_values.user_id IS NOT NULL')
    if (analyticReportFilter.reportDate) {
      qb.andWhere(`ut."datetime" <= to_timestamp(:reportDate)::date`, {
        reportDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
      })
    }
    this.applyUserFilter('u', qb, analyticReportFilter)
    return await qb.execute().then((result) =>
      (result ?? []).map((row) => ({
        mgDl: row.mgDl ? parseInt(row.mgDl, 10) : 0,
        mmolL: row.mmolL ? parseFloat(row.mmolL) : 0,
      })),
    )
  }

  protected applyUserFilter(
    alias: string,
    qb: SelectQueryBuilder<UserEntity>,
    filter: AnalyticReportFilter,
  ): SelectQueryBuilder<UserEntity> {
    const reportFinishDate = filter.reportDate ? filter.reportDate : new Date()
    qb.andWhere(`${alias}."isQuestionnairePassed"=TRUE`)
      .andWhere(`${alias}."isAssessmentPassed"=TRUE`)
      .andWhere(`EXTRACT(YEAR FROM AGE(:reportFinishDate, ${alias}."lastLoginAt")) < :maxInactivePeriod`, {
        reportFinishDate,
        maxInactivePeriod: MaxUserInactivePeriod,
      })

    if (filter.companyCode) {
      const paramName = `companyCode_${uniq().split('-').join('')}`
      qb.andWhere(`${alias}."companyCode" = :${paramName}`, { [paramName]: filter.companyCode })
    }

    if (filter.signedUpPeriod.from !== undefined) {
      const from = filter.signedUpPeriod.from
      const paramName = `signedUpFrom_${uniq().split('-').join('')}`
      qb.andWhere(`${alias}."createAt" >= to_timestamp(:${paramName})::date`, {
        [paramName]: Math.floor(from.getTime() / 1000),
      })
    }

    if (filter.signedUpPeriod.to !== undefined) {
      const to = filter.signedUpPeriod.to
      const paramName = `signedUpTo_${uniq().split('-').join('')}`
      qb.andWhere(`${alias}."createAt" <= to_timestamp(:${paramName})::date`, {
        [paramName]: Math.floor(to.getTime() / 1000),
      })
    }

    return qb
  }

  public getUserSurveyAnswersCounts(analyticReportFilter: AnalyticReportFilter): Promise<{
    reverseOrBetterManageCount: number
    loseWeightCount: number
    improveLabWorkWithoutMedicationsCount: number
    feelBetterCount: number
    lowerHealthcareCostCount: number
    decreaseOrGetOffMedicationsCount: number
    noneCount: number
  }> {
    const qb = this.userRepository
      .createQueryBuilder('u')
      .select([
        'COALESCE(sum(CASE WHEN ujs."reverseOrBetterManage" THEN 1 ELSE 0 END),0) "reverseOrBetterManageCount"',
        'COALESCE(sum(CASE WHEN ujs."loseWeight" THEN 1 ELSE 0 END),0) "loseWeightCount"',
        'COALESCE(sum(CASE WHEN ujs."improveLabWorkWithoutMedications" THEN 1 ELSE 0 END),0) "improveLabWorkWithoutMedicationsCount"',
        'COALESCE(sum(CASE WHEN ujs."feelBetter" THEN 1 ELSE 0 END),0) "feelBetterCount"',
        'COALESCE(sum(CASE WHEN ujs."lowerHealthcareCost" THEN 1 ELSE 0 END),0) "lowerHealthcareCostCount"',
        'COALESCE(sum(CASE WHEN ujs."decreaseOrGetOffMedications" THEN 1 ELSE 0 END),0) "decreaseOrGetOffMedicationsCount"',
        'COALESCE(sum(CASE WHEN ujs."none" THEN 1 ELSE 0 END),0) "noneCount"',
      ])
      .leftJoin('u.journeySurvey', 'ujs')
      .andWhere('ujs.id IS NOT NULL')

    this.applyUserFilter('u', qb, analyticReportFilter)

    return qb.execute().then((result) => ({
      reverseOrBetterManageCount: parseInt(result[0]['reverseOrBetterManageCount'], 10),
      loseWeightCount: parseInt(result[0]['loseWeightCount'], 10),
      improveLabWorkWithoutMedicationsCount: parseInt(result[0]['improveLabWorkWithoutMedicationsCount'], 10),
      feelBetterCount: parseInt(result[0]['feelBetterCount'], 10),
      lowerHealthcareCostCount: parseInt(result[0]['lowerHealthcareCostCount'], 10),
      decreaseOrGetOffMedicationsCount: parseInt(result[0]['decreaseOrGetOffMedicationsCount'], 10),
      noneCount: parseInt(result[0]['noneCount'], 10),
    }))
  }

  public getUsersCountHaveAppointment(analyticReportFilter: AnalyticReportFilter): Promise<number> {
    const qb = this.userRepository
      .createQueryBuilder('u')
      .select(['COUNT(DISTINCT u.id) count'])
      .leftJoin('u.appointments', 'ua')
      .andWhere('ua.id IS NOT NULL')

    if (analyticReportFilter.reportDate) {
      qb.andWhere(`ua."createAt" <= to_timestamp(:youngerThan)::date`, {
        youngerThan: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
      })
    }

    this.applyUserFilter('u', qb, analyticReportFilter)

    return qb.execute().then((result) => result[0]['count'])
  }

  public getUsersProceduresCounts(
    analyticReportFilter: AnalyticReportFilter,
    allowedProcedures?: Procedure[],
  ): Promise<Array<{ procedure_tag: Procedure; users_count: number; procedure_count: number }>> {
    const qb = this.getProceduresAnalyticQuery(analyticReportFilter)
      .select(['p.tag procedure_tag, COUNT(DISTINCT u.id) users_count, COUNT(p.tag) procedure_count'])
      .groupBy('p.tag')

    if (allowedProcedures && allowedProcedures.length) {
      qb.andWhere('p.tag IN(:...allowedTags)', { allowedTags: allowedProcedures })
    }

    return qb.execute()
  }

  public getProceduresAnalyticQuery(analyticReportFilter: AnalyticReportFilter) {
    const qb = this.userRepository
      .createQueryBuilder('u')
      .leftJoin('u.procedures', 'up')
      .leftJoin('up.procedure', 'p')
      .andWhere('p.id IS NOT NULL')

    if (analyticReportFilter.reportDate) {
      qb.andWhere(`up."createAt" <= to_timestamp(:reportDate)::date`, {
        reportDate: Math.floor(analyticReportFilter.reportDate.getTime() / 1000),
      })
    }
    return this.applyUserFilter('u', qb, analyticReportFilter)
  }

  public getUsersCountThatHaveProcedure(
    analyticReportFilter: AnalyticReportFilter,
    allowedProcedures?: Procedure[],
  ): Promise<number> {
    const qb = this.getProceduresAnalyticQuery(analyticReportFilter).select(['COUNT(DISTINCT u.id) users_count'])

    if (allowedProcedures && allowedProcedures.length) {
      qb.andWhere('p.tag IN(:...allowedTags)', { allowedTags: allowedProcedures })
    }

    return qb.execute().then((result) => result[0]['users_count'])
  }
}
