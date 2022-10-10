import { ValidateNested, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

import { AssessmentHealthInfoParamsDto } from '../services/assessment-health/dto/assessment-health-info.dto'
import { AssessmentHealthQuestionsParamsDto } from '../services/assessment-health/dto/assessment-health-questions.dto'
import { AssessmentHealthAppointmentsParamsDto } from '../services/assessment-health/dto/assessment-health-appointments.dto'
import { AssessmentScreeningColonParamsDto } from '../services/assessment-screening/dto/assessment-screening-colon.dto'
import { AssessmentLifestyleParamsDto } from '../services/assessment-lifestyle/dto/assessment-lifestyle.dto'
import { AssessmentScreeningPapSmearParamsDto } from '../services/assessment-screening/dto/assessment-screening-pap-smear.dto'
import { AssessmentScreeningMammogramParamsDto } from '../services/assessment-screening/dto/assessment-screening-mammogram.dto'
import { ConditionsParamsDto } from '../services/assessment-health/dto/assessment-health-conditions.dto'

export class AssessmentSummaryInfoParamsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ConditionsParamsDto)
  public conditions?: ConditionsParamsDto[]

  @IsOptional()
  @ValidateNested()
  @Type(() => AssessmentHealthInfoParamsDto)
  public info?: AssessmentHealthInfoParamsDto

  @IsOptional()
  @ValidateNested()
  @Type(() => AssessmentHealthQuestionsParamsDto)
  public questions?: AssessmentHealthQuestionsParamsDto

  @IsOptional()
  @ValidateNested()
  @Type(() => AssessmentHealthAppointmentsParamsDto)
  public appointments?: AssessmentHealthAppointmentsParamsDto

  @IsOptional()
  @ValidateNested()
  @Type(() => AssessmentScreeningColonParamsDto)
  public colon?: AssessmentScreeningColonParamsDto

  @IsOptional()
  @ValidateNested()
  @Type(() => AssessmentLifestyleParamsDto)
  public lifestyle?: AssessmentLifestyleParamsDto

  @IsOptional()
  @ValidateNested()
  @Type(() => AssessmentScreeningPapSmearParamsDto)
  public papSmear?: AssessmentScreeningPapSmearParamsDto

  @IsOptional()
  @ValidateNested()
  @Type(() => AssessmentScreeningMammogramParamsDto)
  public mammogram?: AssessmentScreeningMammogramParamsDto
}
