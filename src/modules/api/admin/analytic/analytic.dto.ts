import { ArrayNotEmpty, IsArray, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { AnalyticReportAlias } from '../../../../constants/enums/admin/analytics.constants'
import { ValidateDatePeriod } from '../../../../core/decorators/date-period.validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'

export class AnalyticGetOptionsDTO {
  @IsDate()
  @Type(() => Date)
  userLocalDate: Date = new Date()

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  company_code?: string

  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  report_date?: Date

  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ValidateDatePeriod('signedup_from', 'signedup_to')
  signedup_from?: Date

  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  signedup_to?: Date

  @ApiProperty({
    required: true,
    type: String,
    enum: AnalyticReportAlias,
    example: `${AnalyticReportAlias.ldl},${AnalyticReportAlias.medications},${AnalyticReportAlias.expectations}`,
  })
  @IsEnum(AnalyticReportAlias, { each: true })
  @ArrayNotEmpty()
  @IsArray()
  @Transform(({ value }) => (value && value.split ? value.split(',').map((value: string) => value.trim()) : value))
  reports: AnalyticReportAlias[]
}
