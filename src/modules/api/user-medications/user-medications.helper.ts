import { MedicationsEntity } from '../../../database/entities/medications.entity'

export const getMedicationDose = (medication: MedicationsEntity) => {
  return Array.isArray(medication.dose) ? `${medication.dose.join('/')} ${medication.units || ''}` : ''
}
