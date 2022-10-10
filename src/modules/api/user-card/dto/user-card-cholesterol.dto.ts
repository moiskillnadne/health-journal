import { PartialType } from '@nestjs/swagger'

import { UserCardSugarDateParamsDto, UserCardSugarParamsDto } from './user-card-sugar.dto'

export class UserCardCholesterolParamsDto extends UserCardSugarParamsDto {}
export class UserCardCholesterolDateParamsDto extends UserCardSugarDateParamsDto {}

export class UserCardCholesterolOptionalParamsDto extends PartialType(UserCardCholesterolParamsDto) {}
export class UserCardCholesterolDateOptionalParamsDto extends PartialType(UserCardCholesterolDateParamsDto) {}
