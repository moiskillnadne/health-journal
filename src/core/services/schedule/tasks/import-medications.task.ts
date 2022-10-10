import * as request from 'request'
import * as unzipper from 'unzipper'
import { parser } from 'stream-json'
import { pick } from 'stream-json/filters/Pick'
import { streamArray } from 'stream-json/streamers/StreamArray'
import { batch } from 'stream-json/utils/Batch'

import { scheduleImportMedicationsUrl } from '../../../../constants/enums/schedule.constants'
import { toTitleCase } from '../../../helpers/string-format'

import { MedicationsCrudService } from '../../../../modules/api/medications/medications.crud'
import { Logger } from '@nestjs/common'

export const importMedicationsTask = async (medicationsCrudService: MedicationsCrudService) => {
  const logger = new Logger('Import Medications Task')

  logger.log(`Start importing medications data. DateTime: ${new Date()}`)

  const directory = await unzipper.Open.url(request, scheduleImportMedicationsUrl)

  return new Promise((resolve, reject) => {
    const stream = directory.files[0]
      .stream()
      .pipe(parser())
      .pipe(pick({ filter: 'results' }))
      .pipe(streamArray())
      .pipe(batch({ batchSize: 50 }))
      .on('data', async (data) => {
        try {
          stream.pause()
          await medicationsCrudService.upsertMedicationsWithParams(processMedicationData(data))
        } catch (error) {
          logger.error(`Database error occurred while importing medications data. Error: ${error}`)
        } finally {
          stream.resume()
        }
      })
      .on('error', (error) => {
        logger.error(`Stream error occurred while importing medications data. Error: ${error}`)
        reject(error)
      })
      .on('end', () => {
        logger.log(`Finished importing medications data. DateTime: ${new Date()}`)
        resolve('end')
      })
  })
}

const processMedicationData = (data) =>
  data
    .filter(
      (medication) =>
        !!medication.value.brand_name && !!medication.value.finished && !!medication.value.active_ingredients,
    )
    .map((item) => ({
      productId: item.value.product_id,
      name: toTitleCase(item.value.brand_name),
      ...item.value.active_ingredients
        .filter((ingredients) => !!ingredients.strength)
        .reduce(
          (acc, item) => {
            const [dose, unit] = item.strength.split(' ')
            acc.dose.push(dose)
            acc.units = unit

            return acc
          },
          { dose: [], units: '' },
        ),
    }))
