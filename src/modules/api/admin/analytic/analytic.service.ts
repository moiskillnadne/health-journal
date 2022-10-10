import { HttpStatus, Injectable } from '@nestjs/common'
import { AnalyticGetOptionsDTO } from './analytic.dto'
import { AnalyticCrud } from './crud/analytic.crud'
import * as fse from 'fs-extra'
import { CsvService } from '../../../../core/services/csv/csv.service'
import * as AdmZip from 'adm-zip'
import { TmpService } from '../../../../core/services/tmp.service'
import { Stringifier } from 'csv-stringify'
import {
  UsersSignedUpPeriod,
  AnalyticReportFilter,
  AnalyticReportAlias,
  AnalyticReportContentType,
  AnalyticArchiveDefaultName,
  AnalyticProcedureReportAllowedAliases,
  AnalyticProcedureAliasToCsvFormatted,
} from '../../../../constants/enums/admin/analytics.constants'
import { InternalServerError } from '../../../../core/errors/internal-server.error'
import { DictionaryErrorMessages } from '../../../../constants/responses/messages.error.constants'
import { ErrorCodes } from '../../../../constants/responses/codes.error.constants'
import { AllowedCurrencies } from '../../../../constants/enums/currency.constants'

@Injectable()
export class AnalyticService {
  constructor(private analyticCrud: AnalyticCrud, private csvService: CsvService, private tmpService: TmpService) {}

  private prepareSignedUpPeriod(options: AnalyticGetOptionsDTO): UsersSignedUpPeriod {
    const period: UsersSignedUpPeriod = {}
    if (options.signedup_from) {
      const from = options.signedup_from
      period['from'] = new Date(from.getFullYear(), from.getMonth(), from.getDate())
    }
    if (options.signedup_to) {
      const to = options.signedup_to
      period['to'] = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59)
    }
    return period
  }

  private prepareFilterParams(options: AnalyticGetOptionsDTO): AnalyticReportFilter {
    return {
      signedUpPeriod: this.prepareSignedUpPeriod(options),
      reportDate: options.report_date ?? null,
      companyCode: options.company_code ?? null,
    }
  }

  public async getAnalyticReports(options: AnalyticGetOptionsDTO): Promise<{
    buffer: Buffer
    fileName: string
    contentType: AnalyticReportContentType
  }> {
    const preparedReportsData = await this.collectReportsData(options.reports, this.prepareFilterParams(options))
    const csvReportsData = this.prepareCsvReportsData(preparedReportsData, options.userLocalDate)

    if (csvReportsData.length === 1) {
      const reportName = csvReportsData[0].name
      const csv = csvReportsData[0].data
      return {
        buffer: await this.csvService.streamToBuffer(csv),
        fileName: `${reportName}.csv`,
        contentType: AnalyticReportContentType.csv,
      }
    }
    const { name: zipFileName, buffer: zipBuffer } = await this.archiveReports(
      options.reports,
      csvReportsData,
      options.userLocalDate,
    )
    return {
      buffer: zipBuffer,
      fileName: zipFileName,
      contentType: AnalyticReportContentType.zip,
    }
  }

  protected async collectReportsData(
    reportsAliases: AnalyticReportAlias[],
    analyticReportFilter: AnalyticReportFilter,
  ): Promise<
    Array<{
      alias: AnalyticReportAlias
      data: CsvConvertable
    }>
  > {
    const collectDataPromises: Array<Promise<{ alias: AnalyticReportAlias; data: CsvConvertable }>> = []
    const wrapCollectPromise = (
      reportName: AnalyticReportAlias,
      collectReportDataPromise: Promise<CsvConvertable>,
    ): Promise<{ alias: AnalyticReportAlias; data: CsvConvertable }> =>
      new Promise((resolve, reject) => {
        collectReportDataPromise
          .then((result) => {
            resolve({
              alias: reportName,
              data: result,
            })
          })
          .catch(reject)
      })
    const totalSelectedUsersCount = await this.analyticCrud.getUsersCount(analyticReportFilter)
    for (const reportAlias of reportsAliases) {
      switch (reportAlias) {
        case AnalyticReportAlias.dateOfBirth:
          collectDataPromises.push(
            wrapCollectPromise(
              reportAlias,
              this.prepareDateOfBirthAnalyticData(analyticReportFilter, totalSelectedUsersCount),
            ),
          )
          continue
        case AnalyticReportAlias.gender:
          collectDataPromises.push(
            wrapCollectPromise(
              reportAlias,
              this.prepareGenderAnalyticData(analyticReportFilter, totalSelectedUsersCount),
            ),
          )
          continue
        case AnalyticReportAlias.race:
          collectDataPromises.push(
            wrapCollectPromise(
              reportAlias,
              this.prepareRaceAnalyticData(analyticReportFilter, totalSelectedUsersCount),
            ),
          )
          continue
        case AnalyticReportAlias.location:
          collectDataPromises.push(
            wrapCollectPromise(
              reportAlias,
              this.prepareLocationAnalyticData(analyticReportFilter, totalSelectedUsersCount),
            ),
          )
          continue
        case AnalyticReportAlias.chronicDiseases:
          collectDataPromises.push(
            wrapCollectPromise(
              reportAlias,
              this.prepareChronicDiseasesAnalyticData(analyticReportFilter, totalSelectedUsersCount),
            ),
          )
          continue
        case AnalyticReportAlias.medications:
          collectDataPromises.push(
            wrapCollectPromise(
              reportAlias,
              this.prepareMedicationsAnalyticData(analyticReportFilter, totalSelectedUsersCount),
            ),
          )
          continue
        case AnalyticReportAlias.bloodPressure:
          collectDataPromises.push(
            wrapCollectPromise(
              reportAlias,
              this.prepareBloodPressureAnalyticData(analyticReportFilter, totalSelectedUsersCount),
            ),
          )
          continue
        case AnalyticReportAlias.weight:
          collectDataPromises.push(
            wrapCollectPromise(
              reportAlias,
              this.prepareWeightAnalyticData(analyticReportFilter, totalSelectedUsersCount),
            ),
          )
          continue
        case AnalyticReportAlias.ldl:
          collectDataPromises.push(
            wrapCollectPromise(reportAlias, this.prepareLdlAnalyticData(analyticReportFilter, totalSelectedUsersCount)),
          )
          continue
        case AnalyticReportAlias.bloodSugarAfterMeal:
          collectDataPromises.push(
            wrapCollectPromise(
              reportAlias,
              this.prepareBloodSugarAfterMealAnalyticData(analyticReportFilter, totalSelectedUsersCount),
            ),
          )
          continue
        case AnalyticReportAlias.hba1c:
          collectDataPromises.push(
            wrapCollectPromise(
              reportAlias,
              this.prepareHba1cAnalyticData(analyticReportFilter, totalSelectedUsersCount),
            ),
          )
          continue
        case AnalyticReportAlias.triglyceride:
          collectDataPromises.push(
            wrapCollectPromise(
              reportAlias,
              this.prepareTriglycerideAnalyticData(analyticReportFilter, totalSelectedUsersCount),
            ),
          )
          continue
        case AnalyticReportAlias.expectations:
          collectDataPromises.push(
            wrapCollectPromise(
              reportAlias,
              this.prepareExpectationsAnalyticData(analyticReportFilter, totalSelectedUsersCount),
            ),
          )
          continue
        case AnalyticReportAlias.doctorAppointments:
          collectDataPromises.push(
            wrapCollectPromise(
              reportAlias,
              this.prepareDoctorAppointmentsAnalyticData(analyticReportFilter, totalSelectedUsersCount),
            ),
          )
          continue
        case AnalyticReportAlias.procedures:
          collectDataPromises.push(
            wrapCollectPromise(
              reportAlias,
              this.prepareProceduresAnalyticData(analyticReportFilter, totalSelectedUsersCount),
            ),
          )
          continue
      }
    }
    const resultCollectDataPromises = await Promise.allSettled<
      Promise<{ alias: AnalyticReportAlias; data: CsvConvertable }>[]
    >(collectDataPromises)

    const failedCollectDataPromises = resultCollectDataPromises.filter(
      (promiseResult) => promiseResult.status === 'rejected',
    )
    if (failedCollectDataPromises.length) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.FailedCollectingAnalyticsDataError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          promisesResults: resultCollectDataPromises,
        },
      )
    }

    return resultCollectDataPromises.map(
      (promiseResult: PromiseFulfilledResult<{ alias: AnalyticReportAlias; data: CsvConvertable }>) =>
        promiseResult.value,
    )
  }

  protected prepareCsvReportsData(
    reportsData: Array<{
      alias: AnalyticReportAlias
      data: CsvConvertable
    }>,
    userLocalDate: Date,
  ): Array<{
    name: string
    data: Stringifier
  }> {
    return reportsData.map(({ alias, data }) => ({
      name: this.makeReportName(alias, userLocalDate),
      data: this.csvService.makeCsv(data),
    }))
  }

  protected async archiveReports(
    reportsAliases: AnalyticReportAlias[],
    reportsCsvData: Array<{ name: string; data: Stringifier }>,
    userLocalDate: Date,
  ): Promise<{ name: string; buffer: Buffer }> {
    const archiveReportName = this.makeReportName(AnalyticArchiveDefaultName, userLocalDate)
    const archiveReportFullName = `${archiveReportName}.zip`
    const mainTmpFolderPath = await this.tmpService.makeTmpSubFolder()
    const archiveFilesTmpFolderPath = await this.tmpService.makeTmpSubFolder(mainTmpFolderPath, archiveReportName)

    const reportsTmpPaths = []
    const saveCsvPromises = []
    for (const reportCsvData of reportsCsvData) {
      const reportName = reportCsvData.name
      const reportCsv = reportCsvData.data
      const reportTmpPath = this.tmpService.join_path(archiveFilesTmpFolderPath, `${reportName}.csv`)
      reportsTmpPaths.push(reportTmpPath)
      saveCsvPromises.push(
        new Promise(async (resolve, reject) => {
          fse.writeFile(reportTmpPath, await this.csvService.streamToBuffer(reportCsv), (err) => {
            if (err) reject(err)
            resolve(reportTmpPath)
          })
        }),
      )
    }
    const saveCsvPromisesResults = await Promise.allSettled<Promise<string>[]>(saveCsvPromises)
    const failedCsvSavePromisesResults = saveCsvPromisesResults.filter((result) => result.status === 'rejected')
    if (failedCsvSavePromisesResults.length) {
      await this.tmpService.remove(mainTmpFolderPath)
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.FilesystemInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          promisesResults: saveCsvPromisesResults,
        },
      )
    }

    const zip = new AdmZip()
    await zip.addLocalFolderPromise(archiveFilesTmpFolderPath, {})

    return {
      name: archiveReportFullName,
      buffer: await zip
        .toBufferPromise()
        .then(async (result) => {
          await this.tmpService.remove(mainTmpFolderPath)
          return result
        })
        .catch(async (e) => {
          await this.tmpService.remove(mainTmpFolderPath)
          throw new InternalServerError(
            DictionaryErrorMessages.InternalServerError,
            ErrorCodes.FailedCompressionAnalyticsDataError,
            HttpStatus.INTERNAL_SERVER_ERROR,
            { e },
          )
        }),
    }
  }

  protected makeReportName(
    reportAlias: AnalyticReportAlias | AnalyticReportAlias[] | string | string[],
    genDate: Date = new Date(),
  ): string {
    const aliasPart = Array.isArray(reportAlias) ? reportAlias.join('_') : reportAlias

    const formatDateNum = (num: number): string => (num.toString().length == 1 ? `0${num}` : `${num}`)

    const datePart = `${formatDateNum(genDate.getMonth() + 1)}_${formatDateNum(
      genDate.getDate(),
    )}_${genDate.getFullYear()}_${formatDateNum(genDate.getHours())}_${formatDateNum(genDate.getMinutes())}`

    return `${datePart}_${aliasPart}`
  }

  protected async prepareDateOfBirthAnalyticData(
    analyticReportFilter: AnalyticReportFilter,
    totalSelectedUsersCount: number,
  ): Promise<CsvConvertable> {
    const calcPercent = (count: number) =>
      totalSelectedUsersCount ? ((count * 100) / totalSelectedUsersCount).toFixed(2) : 0
    const countUser0_20 = await this.analyticCrud.getAgeRangeUsersCount({ maxYears: 20 }, analyticReportFilter)
    const countUser21_35 = await this.analyticCrud.getAgeRangeUsersCount(
      { minYears: 21, maxYears: 35 },
      analyticReportFilter,
    )
    const countUser36_45 = await this.analyticCrud.getAgeRangeUsersCount(
      { minYears: 36, maxYears: 45 },
      analyticReportFilter,
    )
    const countUser46_69 = await this.analyticCrud.getAgeRangeUsersCount(
      { minYears: 46, maxYears: 69 },
      analyticReportFilter,
    )
    const countUserOlder70 = await this.analyticCrud.getAgeRangeUsersCount({ minYears: 70 }, analyticReportFilter)
    const analyticData: any[][] = [
      ['Date of Birth Range', 'Users', '%'],
      ['20 and under', countUser0_20, calcPercent(countUser0_20)],
      ['21-35 year old', countUser21_35, calcPercent(countUser21_35)],
      ['36-45 year old', countUser36_45, calcPercent(countUser36_45)],
      ['46-69 year old', countUser46_69, calcPercent(countUser46_69)],
      ['70 and older', countUserOlder70, calcPercent(countUserOlder70)],
      ['Total', totalSelectedUsersCount],
    ]

    return this.tableToCsvConvertable(analyticData)
  }

  protected async prepareGenderAnalyticData(
    analyticReportFilter: AnalyticReportFilter,
    totalSelectedUsersCount: number,
  ) {
    const calcPercent = (count: number) =>
      totalSelectedUsersCount ? ((count * 100) / totalSelectedUsersCount).toFixed(2) : 0
    const gendersData = await this.analyticCrud.getUserGendersCounts(analyticReportFilter)
    const analyticData: any[][] = [['Gender', 'Users', '%']]
    for (const genderData of gendersData) {
      analyticData.push([genderData.gender, genderData.count, calcPercent(genderData.count)])
    }
    analyticData.push(['Total Users', totalSelectedUsersCount])

    return this.tableToCsvConvertable(analyticData)
  }

  protected async prepareRaceAnalyticData(
    analyticReportFilter: AnalyticReportFilter,
    totalSelectedUsersCount: number,
  ): Promise<CsvConvertable> {
    const calcPercent = (count: number) =>
      totalSelectedUsersCount ? ((count * 100) / totalSelectedUsersCount).toFixed(2) : 0
    const racesData = await this.analyticCrud.getUserRacesCounts(analyticReportFilter)
    const analyticData: any[][] = [['Race', 'Users', '%']]
    for (const raceData of racesData) {
      analyticData.push([raceData.race, raceData.count, calcPercent(raceData.count)])
    }
    analyticData.push(['Total Users', totalSelectedUsersCount])

    return this.tableToCsvConvertable(analyticData)
  }

  protected async prepareLocationAnalyticData(
    analyticReportFilter: AnalyticReportFilter,
    totalSelectedUsersCount: number,
  ): Promise<CsvConvertable> {
    const locationsData = await this.analyticCrud.getUsersLocationsCount(analyticReportFilter)
    const analyticData: any[][] = [['Country', 'State', 'City', 'Users']]
    for (const locData of locationsData) {
      analyticData.push([locData.country || 'None', locData.state || 'None', locData.city || 'None', locData.count])
    }

    analyticData.push(['Total', '', '', totalSelectedUsersCount])

    return this.tableToCsvConvertable(analyticData)
  }

  protected async prepareChronicDiseasesAnalyticData(
    analyticReportFilter: AnalyticReportFilter,
    totalSelectedUsersCount: number,
  ): Promise<CsvConvertable> {
    const diseasesData = await this.analyticCrud.getConditionsUsersCount(analyticReportFilter)
    const totalUsersHaveDiseases = await this.analyticCrud.getUsersCountHaveConditions(analyticReportFilter)
    const calcPercent = (count: number) =>
      totalUsersHaveDiseases ? ((count * 100) / totalUsersHaveDiseases).toFixed(2) : 0
    const analyticData: any[][] = [['Chronic Disease', 'Users', '%']]
    for (const dData of diseasesData) {
      analyticData.push([dData.name, dData.users_count, calcPercent(dData.users_count)])
    }
    analyticData.push([])
    analyticData.push(['Total Users with data', totalUsersHaveDiseases])
    analyticData.push(['Total Users in selection', totalSelectedUsersCount])

    return this.tableToCsvConvertable(analyticData)
  }

  protected async prepareMedicationsAnalyticData(
    analyticReportFilter: AnalyticReportFilter,
    totalSelectedUsersCount: number,
  ): Promise<CsvConvertable> {
    const medsData = await this.analyticCrud.getMedsUsageDataByCurrency(analyticReportFilter)
    const totalUsersHaveMedData = await this.analyticCrud.getUsersCountHaveMedData(analyticReportFilter)
    const medsDataMap = medsData.reduce((obj, item) => Object.assign(obj, { [item.currency]: item }), {})

    const analyticData: any[][] = [
      ['', 'Currency', 'Total Number of Meds', 'Total number of Users', 'Total Monthly Cost'],
    ]
    let totalMeds = 0
    for (const currency of AllowedCurrencies) {
      totalMeds += parseInt(medsDataMap?.[currency]?.['meds_count'] ?? 0, 10)
      analyticData.push([
        '',
        currency,
        medsDataMap?.[currency]?.['meds_count'] ?? 0,
        medsDataMap?.[currency]?.['users_count'] ?? 0,
        medsDataMap?.[currency]?.['total_cost'] ?? 0,
      ])
    }
    analyticData.push(['Sum:', '', totalMeds])
    analyticData.push(['Total Users with data:', totalUsersHaveMedData])
    for (const currency of AllowedCurrencies) {
      const currencyUsersCount = parseInt(medsDataMap?.[currency]?.['users_count'] ?? '0', 10)
      const currencyTotalCost = parseInt(medsDataMap?.[currency]?.['total_cost'] ?? '0', 10)
      analyticData.push([
        `Average, ${currency}:`,
        currencyUsersCount ? (currencyTotalCost / currencyUsersCount).toFixed(2) : 0,
      ])
    }
    analyticData.push(['Total Users in selection:', totalSelectedUsersCount])

    return this.tableToCsvConvertable(analyticData)
  }

  protected async prepareDoctorAppointmentsAnalyticData(
    analyticReportFilter: AnalyticReportFilter,
    totalSelectedUsersCount: number,
  ): Promise<CsvConvertable> {
    const usersHaveAppointment = await this.analyticCrud.getUsersCountHaveAppointment(analyticReportFilter)

    const analyticData: any[][] = [
      [
        '% of patients who have the doctor appointment scheduled',
        `${totalSelectedUsersCount ? ((usersHaveAppointment * 100) / totalSelectedUsersCount).toFixed(2) : 0}%`,
      ],
      ['Total Users with data', usersHaveAppointment],
      ['Total Users in selection', totalSelectedUsersCount],
    ]

    return this.tableToCsvConvertable(analyticData)
  }

  protected async prepareProceduresAnalyticData(
    analyticReportFilter: AnalyticReportFilter,
    totalSelectedUsersCount: number,
  ): Promise<CsvConvertable> {
    const proceduresCountsData = await this.analyticCrud.getUsersProceduresCounts(
      analyticReportFilter,
      AnalyticProcedureReportAllowedAliases,
    )
    const totalUsersHaveProcedures = await this.analyticCrud.getUsersCountThatHaveProcedure(
      analyticReportFilter,
      AnalyticProcedureReportAllowedAliases,
    )
    const calcPercent = (count: number) =>
      totalUsersHaveProcedures ? ((count * 100) / totalUsersHaveProcedures).toFixed(2) : 0

    const procedureAliasCountsDataMap = proceduresCountsData.reduce(
      (obj, item) => Object.assign(obj, { [item['procedure_tag']]: item }),
      {},
    )
    const analyticData: any[][] = [['Procedure', '%', 'Users']]

    for (const procedureAlias of AnalyticProcedureReportAllowedAliases) {
      analyticData.push([
        AnalyticProcedureAliasToCsvFormatted[procedureAlias],
        procedureAliasCountsDataMap[procedureAlias]
          ? calcPercent(parseInt(procedureAliasCountsDataMap[procedureAlias]['users_count'], 10))
          : 0,
        procedureAliasCountsDataMap[procedureAlias] ? procedureAliasCountsDataMap[procedureAlias]['users_count'] : 0,
      ])
    }

    analyticData.push([])
    analyticData.push(['Total users with these procedures:', totalUsersHaveProcedures])
    analyticData.push(['Total Users in selection:', totalSelectedUsersCount])

    return this.tableToCsvConvertable(analyticData)
  }

  protected async prepareBloodPressureAnalyticData(
    analyticReportFilter: AnalyticReportFilter,
    totalSelectedUsersCount: number,
  ): Promise<CsvConvertable> {
    const analyticData: any[][] = [['', 'Systolic', 'Diastolic']]

    const bloodPressureData = await this.analyticCrud.getUsersLastBloodPressureData(analyticReportFilter)
    const sumSystolic = bloodPressureData.reduce((sum, item): number => sum + item.systolic, 0)
    const sumDiastolic = bloodPressureData.reduce((sum, item): number => sum + item.diastolic, 0)
    const totalUsersWithData = bloodPressureData.length
    for (const { systolic, diastolic } of bloodPressureData) {
      analyticData.push(['', systolic, diastolic])
    }
    analyticData.push(['Sum:', sumSystolic, sumDiastolic])
    analyticData.push(['Total Users with data:', totalUsersWithData])
    analyticData.push([
      'Average:',
      totalUsersWithData ? (sumSystolic / totalUsersWithData).toFixed(2) : 0,
      totalUsersWithData ? (sumDiastolic / totalUsersWithData).toFixed(2) : 0,
    ])
    analyticData.push([])
    analyticData.push(['Total Users in selection:', totalSelectedUsersCount])

    return this.tableToCsvConvertable(analyticData)
  }

  protected async prepareWeightAnalyticData(
    analyticReportFilter: AnalyticReportFilter,
    totalSelectedUsersCount: number,
  ): Promise<CsvConvertable> {
    const analyticData: any[][] = [['', 'Weight, Lb', 'BMI']]

    const weightData = await this.analyticCrud.getUsersLastWeightData(analyticReportFilter)
    const totalWeight = weightData.reduce((sum, item): number => sum + item.weightLb, 0)
    const totalUsersWithData = weightData.length
    for (const { weightLb, bmi } of weightData) {
      analyticData.push(['', weightLb, bmi])
    }
    analyticData.push(['Total Weight:', totalWeight])
    analyticData.push([
      'Average:',
      totalUsersWithData ? (totalWeight / totalUsersWithData).toFixed(2) : totalUsersWithData,
    ])
    analyticData.push([])
    analyticData.push(['Total Users with data:', totalUsersWithData])
    analyticData.push(['Total Users in selection:', totalSelectedUsersCount])

    return this.tableToCsvConvertable(analyticData)
  }

  protected async prepareLdlAnalyticData(
    analyticReportFilter: AnalyticReportFilter,
    totalSelectedUsersCount: number,
  ): Promise<CsvConvertable> {
    const analyticData: any[][] = [['', 'ldl, Mg/Dl', 'ldl, Mmol/L']]

    const ldlData = await this.analyticCrud.getUsersLastLdlData(analyticReportFilter)
    const totalLdlMgDl = ldlData.reduce((sum, item): number => sum + item.ldlMgDl, 0)
    const totalLdlMmolL = ldlData.reduce((sum, item): number => sum + item.ldlMmolL, 0)
    const totalUsersWithData = ldlData.length
    for (const { ldlMgDl, ldlMmolL } of ldlData) {
      analyticData.push(['', ldlMgDl, ldlMmolL])
    }
    analyticData.push(['Sum:', totalLdlMgDl, totalLdlMmolL])
    analyticData.push(['Total Users with data:', totalUsersWithData])
    analyticData.push([
      'Average:',
      totalUsersWithData ? (totalLdlMgDl / totalUsersWithData).toFixed(2) : 0,
      totalUsersWithData ? (totalLdlMmolL / totalUsersWithData).toFixed(2) : 0,
    ])
    analyticData.push(['Total Users in selection:', totalSelectedUsersCount])

    return this.tableToCsvConvertable(analyticData)
  }

  protected async prepareBloodSugarAfterMealAnalyticData(
    analyticReportFilter: AnalyticReportFilter,
    totalSelectedUsersCount: number,
  ): Promise<CsvConvertable> {
    const analyticData: any[][] = [['', 'After Meal Blood Sugar, Mg/dl', 'After Meal Blood Sugar, mmol/L']]

    const sugarData = await this.analyticCrud.getUsersLastBloodSugarAfterMealData(analyticReportFilter)
    const totalSugarMgDl = sugarData.reduce((sum, item): number => sum + item.sugarMgDl, 0)
    const totalSugarMmolL = sugarData.reduce((sum, item): number => sum + item.sugarMmolL, 0)
    const totalUsersWithData = sugarData.length
    for (const { sugarMgDl, sugarMmolL } of sugarData) {
      analyticData.push(['', sugarMgDl, sugarMmolL])
    }
    analyticData.push(['Sum:', totalSugarMgDl, totalSugarMmolL])
    analyticData.push([])
    analyticData.push(['Total Users with data:', totalUsersWithData])
    analyticData.push([
      'Average:',
      totalUsersWithData ? (totalSugarMgDl / totalUsersWithData).toFixed(2) : 0,
      totalUsersWithData ? (totalSugarMmolL / totalUsersWithData).toFixed(2) : 0,
    ])
    analyticData.push(['Total Users in selection:', totalSelectedUsersCount])

    return this.tableToCsvConvertable(analyticData)
  }

  protected async prepareHba1cAnalyticData(
    analyticReportFilter: AnalyticReportFilter,
    totalSelectedUsersCount: number,
  ): Promise<CsvConvertable> {
    const analyticData: any[][] = [['', 'Hba1c']]
    const hba1cData = await this.analyticCrud.getUsersLastHba1cData(analyticReportFilter)
    const totalPercentages = hba1cData.reduce((sum, item): number => sum + item.percent, 0)
    const totalUsersWithData = hba1cData.length
    for (const { percent } of hba1cData) {
      analyticData.push(['', percent])
    }
    analyticData.push(['Sum:', totalPercentages])
    analyticData.push(['Total Users with data:', totalUsersWithData])
    analyticData.push(['Average:', totalUsersWithData ? (totalPercentages / totalUsersWithData).toFixed(2) : 0])
    analyticData.push(['Total Users in selection:', totalSelectedUsersCount])

    return this.tableToCsvConvertable(analyticData)
  }

  protected async prepareTriglycerideAnalyticData(
    analyticReportFilter: AnalyticReportFilter,
    totalSelectedUsersCount: number,
  ): Promise<CsvConvertable> {
    const analyticData: any[][] = [['', 'Triglyceride, Mg/dl', 'Triglyceride, mmol/L']]
    const triglycerideData = await this.analyticCrud.getUsersLastTriglycerideData(analyticReportFilter)
    const totalMgDl = triglycerideData.reduce((sum, item): number => sum + item.mgDl, 0)
    const totalMmolL = triglycerideData.reduce((sum, item): number => sum + item.mmolL, 0)
    const totalUsersWithData = triglycerideData.length
    for (const { mgDl, mmolL } of triglycerideData) {
      analyticData.push(['', mgDl, mmolL])
    }
    analyticData.push(['Sum:', totalMgDl, totalMmolL])
    analyticData.push([])
    analyticData.push(['Total Users with data:', totalUsersWithData])
    analyticData.push([
      'Average:',
      totalUsersWithData ? (totalMgDl / totalUsersWithData).toFixed(2) : 0,
      totalUsersWithData ? (totalMmolL / totalUsersWithData).toFixed(2) : 0,
    ])
    analyticData.push(['Total Users in selection:', totalSelectedUsersCount])

    return this.tableToCsvConvertable(analyticData)
  }

  protected async prepareExpectationsAnalyticData(
    analyticReportFilter: AnalyticReportFilter,
    totalSelectedUsersCount: number,
  ): Promise<CsvConvertable> {
    const calcPercent = (count: number) =>
      totalSelectedUsersCount ? ((count * 100) / totalSelectedUsersCount).toFixed(2) : 0
    const surveyAnswersCountsData = await this.analyticCrud.getUserSurveyAnswersCounts(analyticReportFilter)

    const analyticData: any[][] = [
      ['Expectation', 'Users', '%'],
      [
        'Reverse or better manage the health conditions I have',
        surveyAnswersCountsData.reverseOrBetterManageCount,
        calcPercent(surveyAnswersCountsData.reverseOrBetterManageCount),
      ],
      ['Lose weight', surveyAnswersCountsData.loseWeightCount, calcPercent(surveyAnswersCountsData.loseWeightCount)],
      [
        'Improve my lab work without adding more medications',
        surveyAnswersCountsData.improveLabWorkWithoutMedicationsCount,
        calcPercent(surveyAnswersCountsData.improveLabWorkWithoutMedicationsCount),
      ],
      [
        'To feel better - I am sick and tired of being sick and tired',
        surveyAnswersCountsData.feelBetterCount,
        calcPercent(surveyAnswersCountsData.feelBetterCount),
      ],
      [
        'Lower my healthcare cost',
        surveyAnswersCountsData.lowerHealthcareCostCount,
        calcPercent(surveyAnswersCountsData.lowerHealthcareCostCount),
      ],
      [
        'To decrease or get off medications',
        surveyAnswersCountsData.decreaseOrGetOffMedicationsCount,
        calcPercent(surveyAnswersCountsData.decreaseOrGetOffMedicationsCount),
      ],
      ['None of the above', surveyAnswersCountsData.noneCount, calcPercent(surveyAnswersCountsData.noneCount)],
      ['Total', totalSelectedUsersCount],
    ]

    return this.tableToCsvConvertable(analyticData)
  }

  protected tableToCsvConvertable(table: Array<Array<any>>): CsvConvertable {
    const tColumns = table[0]
    const dataObjectsList = []
    for (let tRowIndex = 1; tRowIndex < table.length; tRowIndex++) {
      const tRow = table[tRowIndex]
      const rowObject = {}
      for (let tColumnIndex = 0; tColumnIndex < tRow.length; tColumnIndex++) {
        const cellValue = tRow[tColumnIndex]
        if (tColumns[tColumnIndex] === undefined) {
          tColumns.push(`column_${tColumns.length + 1}`)
        }
        rowObject[tColumns[tColumnIndex]] = cellValue
      }
      dataObjectsList.push(rowObject)
    }

    return { tColumns, tData: dataObjectsList }
  }
}
