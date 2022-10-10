import { IntersectionType, OmitType, PickType } from '@nestjs/swagger'

import { AppointmentsEntity } from '../../../../database/entities/appointments.entity'
import { UserAppointmentsEntity } from '../../../../database/entities/user-appointments.entity'

export class GetUserAppointmentIdDto {
  appointmentId: string
}

export class GetUserAppointmentResponseDto extends IntersectionType(
  GetUserAppointmentIdDto,
  IntersectionType(
    PickType(AppointmentsEntity, ['name', 'description'] as const),
    PickType(UserAppointmentsEntity, ['speciality', 'doctor', 'datetime'] as const),
  ),
) {}

export class GetUserAppointmentEntityDto extends OmitType(UserAppointmentsEntity, ['appointment', 'user'] as const) {}
