import { AssessmentScreeningColonParamsDto } from '../dto/assessment-screening-colon.dto'
import { Procedure } from '../../../../../../constants/enums/procedures.constants'

export const getColonScreeningPayload = (
  id: string,
  params: AssessmentScreeningColonParamsDto,
  procedures: Record<Procedure, string> | Record<string, never>,
) => {
  return [
    ...(params.bloodStoolTesting
      ? [
          {
            userId: id,
            procedureId: procedures[Procedure.BloodStoolTesting],
            datetime: params.bloodStoolTesting.datetime || null,
            period: params.bloodStoolTesting.period || null,
            interval: params.bloodStoolTesting.interval || null,
          },
        ]
      : []),
    ...(params.cologuard
      ? [
          {
            userId: id,
            procedureId: procedures[Procedure.Cologuard],
            datetime: params.cologuard.datetime || null,
            period: params.cologuard.period || null,
            interval: params.cologuard.interval || null,
          },
        ]
      : []),
    ...(params.colonoscopy
      ? [
          {
            userId: id,
            procedureId: procedures[Procedure.Colonoscopy],
            datetime: params.colonoscopy.datetime || null,
            period: params.colonoscopy.period || null,
            interval: params.colonoscopy.interval || null,
          },
        ]
      : []),
    ...(params.colonography
      ? [
          {
            userId: id,
            procedureId: procedures[Procedure.Colonography],
            datetime: params.colonography.datetime || null,
            period: params.colonography.period || null,
            interval: params.colonography.interval || null,
          },
        ]
      : []),
  ]
}
