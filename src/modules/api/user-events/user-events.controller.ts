import { Controller, Get, Req } from '@nestjs/common'
import { ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger'

import { UserEventsService } from './user-events.service'

import { GetUserAppointmentResponseDto } from '../user-appointments/dto/user-appointments.response.dto'
import { GetUserProcedureResponseDto } from '../user-procedures/dto/user-procedures.response.dto'

@ApiTags('User Events')
@Controller('user/events')
export class UserEventsController {
  constructor(private userEventsService: UserEventsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    schema: {
      properties: {
        current: {
          type: 'array',
          items: {
            oneOf: [
              { $ref: getSchemaPath(GetUserAppointmentResponseDto) },
              { $ref: getSchemaPath(GetUserProcedureResponseDto) },
            ],
          },
        },
        resolved: {
          type: 'array',
          items: {
            oneOf: [
              { $ref: getSchemaPath(GetUserAppointmentResponseDto) },
              { $ref: getSchemaPath(GetUserProcedureResponseDto) },
            ],
          },
        },
      },
    },
  })
  public getUserEvents(@Req() { user }) {
    return this.userEventsService.getUserEventsByUserId(user.id)
  }
}
