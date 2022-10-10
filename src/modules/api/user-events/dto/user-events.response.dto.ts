import { GetUserAppointmentResponseDto } from '../../user-appointments/dto/user-appointments.response.dto'
import { GetUserProcedureResponseDto } from '../../user-procedures/dto/user-procedures.response.dto'

export class GetUserEventsResponseDto {
  current: (GetUserAppointmentResponseDto | GetUserProcedureResponseDto)[]
  resolved: (GetUserAppointmentResponseDto | GetUserProcedureResponseDto)[]
}
