import { InternalServerError } from './../../../core/errors/internal-server.error'
import { Condition, ConditionStatus, ConditionStatusReportFormat } from './../../../constants/enums/condition.constants'
import { UserConditionsEntity } from './../../../database/entities/user-conditions.entity'
import { UserMedicationsEntity } from './../../../database/entities/user-medications.entity'
import { getBMI } from './../../../core/helpers/bmi'
import { I18nContext } from 'nestjs-i18n'
import { UserCardEntity } from './../../../database/entities/user-card.entity'
import { UserCrudService } from './../user/user.crud'
import { HttpStatus, Injectable } from '@nestjs/common'
import type { BrowserContext, Page, PDFOptions } from 'puppeteer'
import { InjectContext } from 'nest-puppeteer'
import { compileTemplate } from '../../../core/helpers/compileTemplate'
import { UserCardCrudService } from '../user-card/user-card.crud'
import { UserEntity } from '../../../database/entities/user.entity'
import { UserCardWeightCrudService } from '../user-card-weight/user-card-weight.crud'
import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { BadRequestError } from '../../../core/errors/bad-request.error'
import { UserSettingsEntityService } from '../user-settings/services/entity/user-settings-entity.service'
import { isMetricSystem } from '../../../core/helpers/isMetricSystem'
import { Currency } from '../../../constants/enums/currency.constants'
import { arraySortByDate } from '../../../core/helpers/array-sort'
import { formateDateToUSAView } from '../../../core/helpers/date-formate'
import { UserCardHba1cService } from '../user-card-hba1c/user-card-hba1c.service'
import { UserCardLdlLevelService } from '../user-card-ldl-level/user-card-ldl-level.service'
import { UserCardTriglycerideLevelService } from '../user-card-triglyceride-level/user-card-triglyceride-level.service'
import { UserCardRandomBloodSugarService } from '../user-card-random-blood-sugar/user-card-random-blood-sugar.service'
import { UserCardAfterMealBloodSugarService } from '../user-card-after-meal-blood-sugar/user-card-after-meal-blood-sugar.service'
import { UserCardFastingBloodSugarService } from '../user-card-fasting-blood-sugar/user-card-fasting-blood-sugar.service'
import { UserCardBloodPressureCrudService } from '../user-card-blood-pressure/user-card-blood-pressure.crud'
import { UserAppointmentsService } from '../user-appointments/user-appointments.service'
import { UserProceduresService } from '../user-procedures/user-procedures.service'
import { Readable } from 'stream'
import { MoreThan } from 'typeorm'
import { Status } from '../../../constants/enums/medications.constants'
import { Measurements } from '../../../constants/measurements'
import { periodToPdfFormatted } from '../../../constants/enums/share.constants'
import { Order } from '../../../constants/enums/pagination.constants'

@Injectable()
export class ShareService {
  private pdfOptions: PDFOptions = { format: 'A4', printBackground: true }

  constructor(
    @InjectContext() private readonly browserContext: BrowserContext,
    private userCrudService: UserCrudService,
    private userSettingsCrudService: UserSettingsEntityService,
    private userCardCrudService: UserCardCrudService,
    private userCardWeightCrudService: UserCardWeightCrudService,
    private userCardHba1cService: UserCardHba1cService,
    private userCardLdlLevelService: UserCardLdlLevelService,
    private userCardTriglycerideLevelService: UserCardTriglycerideLevelService,
    private userCardRandomBloodSugarService: UserCardRandomBloodSugarService,
    private userCardAfterMealBloodSugarService: UserCardAfterMealBloodSugarService,
    private userCardFastingBloodSugarService: UserCardFastingBloodSugarService,
    private userCardBloodPressureCrudService: UserCardBloodPressureCrudService,
    private userAppointmentsService: UserAppointmentsService,
    private userProceduresService: UserProceduresService,
  ) {}

  public async getPdfStream(
    { id }: UserEntity,
    i18n: I18nContext,
    measurement: Measurements,
  ): Promise<Readable | InternalServerError> {
    let data
    try {
      data = await this.getFullUserData(id, i18n, measurement)
    } catch (e) {
      throw new InternalServerError(
        i18n.t(DictionaryPathToken.ShareUserDataFailed),
        ErrorCodes.PdfPreparationFailed,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { message: e.message, stack: e.stack },
      )
    }

    let page: Page | undefined
    try {
      const content = await compileTemplate('health-record/health-record-pdf', data)

      page = await this.createPageWithContent(content)
    } catch (e) {
      throw new InternalServerError(
        i18n.t(DictionaryPathToken.ShareTemplateCompileFailed),
        ErrorCodes.PdfPreparationFailed,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { ...e },
      )
    }

    return page.createPDFStream(this.pdfOptions)
  }

  private async createPageWithContent(content: string): Promise<Page> {
    const page = await this.browserContext.newPage()

    await page.setContent(content, { waitUntil: 'networkidle2' })
    await page.addStyleTag({
      path: 'src/templates/health-record/style.css',
    })

    return page
  }

  private async getFullUserData(userId: string, i18n: I18nContext, measurementSystem: Measurements) {
    let system = measurementSystem

    const user = await this.userCrudService.getUserShareParamsById(userId)
    const card = await this.userCardCrudService.getUserCardByUserId(user.id)

    if (!card || !user) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserDataNotFound),
        ErrorCodes.UserDataNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (!system) {
      const settings = await this.userSettingsCrudService.getUserSettingsByUserId(user?.id)
      system = settings['measurementSystem']
    }

    const isMetric = isMetricSystem(measurementSystem)

    const personalInfo = await this.getPersonalInfo(user, card, measurementSystem)

    const userHasHeight = card?.heightCm ?? card?.heightFt ?? card?.heightIn
    const userHasWeight = personalInfo?.weight

    const height = isMetric ? `${card?.heightCm}cm` : `${card?.heightFt}'${card?.heightIn}"`
    const weight = isMetric ? `${personalInfo?.weight}kg` : `${personalInfo?.weight}lbs`

    const userInfo = {
      ...personalInfo,
      height: userHasHeight ? height : '',
      weight: userHasWeight ? weight : '',
      bmi: getBMI(personalInfo.weightData, { cm: card.heightCm, ft: card.heightFt, in: card.heightIn }, system),
    }

    const data = {
      user: userInfo,
      medications: this.formatMedications(user.medications),
      conditions: this.formatConditions(user.conditions),
      labs: await this.formatLabs(userId, i18n, isMetric),
      bloodSugar: await this.formatBloodSugar(userId, isMetric),
      bloodPressure: await this.formatBloodPressure(card.id),
      upcomingDoctor: await this.formatUpcomingDoctorVisits(userId),
      procedures: await this.formatProcedures(userId),
      additionalInfo: user?.additionalInformation?.value,
    }

    return data
  }

  private async getPersonalInfo(user: UserEntity, userCard: UserCardEntity, measurementSystem: string) {
    const userCardWeight = await this.userCardWeightCrudService.getUserWeightRecordByCardIdWithParams(userCard.id, {
      select: {
        datetime: true,
        weightKg: true,
        weightLb: true,
      },
      order: {
        datetime: 'desc',
      },
    })

    const { firstName, lastName, dateOfBirth, city, state, country, race, gender } = user

    return {
      name: `${firstName} ${lastName}`,
      dateOfBirth: formateDateToUSAView(new Date(dateOfBirth)),
      city,
      state,
      country,
      race: race?.name,
      gender: gender?.name,
      weight: isMetricSystem(measurementSystem) ? userCardWeight?.weightKg : userCardWeight?.weightLb,
      weightData: {
        kg: userCardWeight?.weightKg,
        lb: userCardWeight?.weightLb,
      },
    }
  }

  private formatMedications(array: UserMedicationsEntity[]) {
    return array.map((med, index) => ({
      index: index + 1,
      name: med.medication.name,
      dose: med.medication.dose,
      period: med.status === Status.Active ? 'Currently' : `Inactive since ${formateDateToUSAView(med.statusUpdated)}`,
      frequency: med.frequency && med.period ? `${med.frequency} ${periodToPdfFormatted[med.period]}` : '',
      cost: med.amount ? `${med.currency === Currency.USD ? '$' : '€'}${med.amount}` : '',
      classNameLine: index % 2 !== 0 && 'even_line',
    }))
  }

  private formatConditions(array: UserConditionsEntity[]) {
    const conditions = array.reduce(
      (list: { current: UserConditionsEntity[]; resolved: UserConditionsEntity[] }, condition) => {
        if (condition.status === ConditionStatus.Current) {
          list.current.push(condition)
        } else {
          list.resolved.push(condition)
        }

        return list
      },
      { current: [], resolved: [] },
    )

    return [
      ...arraySortByDate(conditions.current, 'createAt', Order.DESC),
      ...arraySortByDate(conditions.resolved, 'createAt', Order.DESC),
    ].map((condition, index) => ({
      index: index + 1,
      name: condition.condition.tag === Condition.Other ? condition.info : condition.condition.name,
      period:
        condition.status === ConditionStatus.Current
          ? ConditionStatusReportFormat
          : condition.conditionResolvedDate
          ? `Resolved at ${formateDateToUSAView(condition.conditionResolvedDate)}`
          : '',
      classNameLine: index % 2 !== 0 && 'even_line',
    }))
  }

  private async formatLabs(userId: string, i18n: I18nContext, isMetric: boolean) {
    const [hba1c, ldl, triglyceride] = await Promise.all([
      this.userCardHba1cService.getUserHba1cLastRecordByUserId(userId, i18n),
      this.userCardLdlLevelService.getUserLdlLevelLastRecordByUserId(userId, i18n),
      this.userCardTriglycerideLevelService.getUserTriglycerideLevelLastRecordByUserId(userId, i18n),
    ])

    return [
      {
        name: 'Hba1c',
        level: hba1c.hba1c || '',
        goalLevel: hba1c.goalHba1c || '',
        date: hba1c.datetime ? formateDateToUSAView(new Date(hba1c.datetime)) : '',
        classNameLine: '',
      },
      {
        name: 'LDL',
        level: isMetric ? ldl.ldlMmolL || '' : ldl.ldlMgDl || '',
        goalLevel: isMetric ? ldl.goalLdlMmolL || '' : ldl.goalLdlMgDl || '',
        date: ldl.datetime ? formateDateToUSAView(new Date(ldl.datetime)) : '',
        classNameLine: 'even_line',
      },
      {
        name: 'Triglyceride',
        level: isMetric ? triglyceride.triglycerideMmolL || '' : triglyceride.triglycerideMgDl || '',
        goalLevel: isMetric ? triglyceride.goalTriglycerideMmolL || '' : triglyceride.goalTriglycerideMgDl || '',
        date: triglyceride.datetime ? formateDateToUSAView(new Date(triglyceride.datetime)) : '',
        classNameLine: '',
      },
    ]
  }

  private async formatBloodSugar(userId: string, isMetric: boolean) {
    let bloodSugarArray = []

    const [afterMealBloodSugar, fastingBloodSugar, randomBloodSugar] = await Promise.all([
      this.userCardAfterMealBloodSugarService.getUserAfterMealBloodSugarLastRecordsByUserId(userId, 5),
      this.userCardFastingBloodSugarService.getUserFastingBloodSugarLastRecordsByUserId(userId, 5),
      this.userCardRandomBloodSugarService.getUserRandomBloodSugarLastRecordsByUserId(userId, 5),
    ])

    if (afterMealBloodSugar.length > 0) {
      afterMealBloodSugar.map((afterMeal) => {
        return bloodSugarArray.push({
          name: 'After Meal Blood Sugar',
          level: isMetric ? afterMeal.sugarMmolL : afterMeal.sugarMgDl,
          goalLevel: isMetric
            ? afterMeal.goalAfterMealBloodSugarMmolL || ''
            : afterMeal.goalAfterMealBloodSugarMgDl || '',
          date: afterMeal.datetime,
        })
      })
    }

    if (fastingBloodSugar.length > 0) {
      fastingBloodSugar.map((fasting) => {
        return bloodSugarArray.push({
          name: 'Fasting Blood Sugar',
          level: isMetric ? fasting.sugarMmolL : fasting.sugarMgDl,
          goalLevel: isMetric ? fasting.goalFastingBloodSugarMmolL || '' : fasting.goalAfterMealBloodSugarMgDl || '',
          date: fasting.datetime,
        })
      })
    }

    if (randomBloodSugar.length > 0) {
      randomBloodSugar.map((random) => {
        bloodSugarArray.push({
          name: 'Random Blood Sugar',
          level: isMetric ? random.sugarMmolL : random.sugarMgDl,
          goalLevel: isMetric ? random.goalRandomBloodSugarMmolL || '' : random.goalRandomBloodSugarMgDl || '',
          date: random.datetime,
        })
      })
    }

    if (bloodSugarArray.length === 0) {
      bloodSugarArray = [
        {
          name: 'After Meal Blood Sugar',
          level: '',
          goalLevel: '',
          date: '',
        },
        {
          name: 'Fasting Blood Sugar',
          level: '',
          goalLevel: '',
          date: '',
        },
        {
          name: 'Random Blood Sugar',
          level: '',
          goalLevel: '',
          date: '',
        },
      ]
    }

    const fiveNewestRecords = arraySortByDate(bloodSugarArray, 'date', Order.DESC)
      .slice(0, 5)
      .map((item) => ({
        ...item,
        date: formateDateToUSAView(new Date(item.date)),
      }))

    return fiveNewestRecords.map((item, index) => ({
      ...item,
      classNameLine: index % 2 === 0 ? '' : 'even_line',
    }))
  }

  private async formatBloodPressure(cardId: string) {
    const bloodPressure = await this.userCardBloodPressureCrudService.getUserBloodPressureByCardId(cardId, {
      order: {
        datetime: 'DESC',
      },
      take: 7,
    })

    if (bloodPressure.length === 0) {
      return [
        {
          index: '',
          systolic: '',
          diastolic: '',
          date: '',
          classNameLine: '',
        },
      ]
    }

    return bloodPressure.map((item, index) => ({
      index: index + 1,
      systolic: item.pressureSystolicMmHg,
      diastolic: item.pressureDiastolicMmHg,
      date: formateDateToUSAView(new Date(item.datetime)),
      classNameLine: index % 2 !== 0 ? 'even_line' : '',
    }))
  }

  private async formatUpcomingDoctorVisits(userId: string) {
    const visits = await this.userAppointmentsService.getUserAppointmentsByUserId(userId, {
      datetime: MoreThan(new Date()),
    })

    return arraySortByDate(visits, 'datetime', Order.ASC).map((visit, index) => ({
      index: index + 1,
      doctor: visit.doctor,
      date: formateDateToUSAView(new Date(visit.datetime)),
      classNameLine: index % 2 !== 0 ? 'even_line' : '',
    }))
  }

  private async formatProcedures(userId: string) {
    const procedures = await this.userProceduresService.getUserProceduresByUserId(userId)

    return arraySortByDate(procedures, 'datetime', Order.DESC).map((procedure, index) => ({
      index: index + 1,
      name: procedure.name,
      date: formateDateToUSAView(new Date(procedure.datetime)),
      classNameLine: index % 2 !== 0 ? 'even_line' : '',
    }))
  }
}
