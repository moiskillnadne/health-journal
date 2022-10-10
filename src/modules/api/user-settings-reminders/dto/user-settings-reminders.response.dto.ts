import { PickType } from '@nestjs/swagger'

import { UserSettingsRemindersEntity } from '../../../../database/entities/user-settings-reminders.entity'

export class GetUserSettingsRemindersResponseDto extends PickType(UserSettingsRemindersEntity, [
  'waterInterval',
  'waterPeriod',
  'waterFrom',
  'waterTo',
] as const) {}
