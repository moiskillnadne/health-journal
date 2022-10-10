import { Injectable } from '@nestjs/common'
import { isPast } from 'date-fns'

import { arraySortByDate } from '../../../core/helpers/array-sort'
import { Order } from '../../../constants/enums/pagination.constants'

import { UserAppointmentsService } from '../user-appointments/user-appointments.service'
import { UserProceduresService } from '../user-procedures/user-procedures.service'

import { GetUserEventsResponseDto } from './dto/user-events.response.dto'

@Injectable()
export class UserEventsService {
  constructor(
    private userAppointmentsService: UserAppointmentsService,
    private userProceduresService: UserProceduresService,
  ) {}

  public async getUserEventsByUserId(id: string): Promise<GetUserEventsResponseDto> {
    const [appointments, procedures] = await Promise.all([
      this.userAppointmentsService.getUserAppointmentsByUserId(id),
      this.userProceduresService.getUserProceduresByUserId(id),
    ])

    const events = [...appointments, ...procedures]

    const currentAndResolvedEvents: GetUserEventsResponseDto = events.reduce(
      (events, item) => {
        if (item.datetime) {
          if (isPast(item.datetime)) {
            events.resolved.push(item)
          } else {
            events.current.push(item)
          }
        }

        return events
      },
      {
        current: [],
        resolved: [],
      },
    )

    return {
      current: arraySortByDate(currentAndResolvedEvents.current, 'datetime', Order.ASC),
      resolved: arraySortByDate(currentAndResolvedEvents.resolved, 'datetime', Order.DESC),
    }
  }
}
