import { HttpStatus } from '@nestjs/common'
import { SuccessCodes } from '../../../../constants/responses/codes.success.constants'
import { IBaseResponse } from '../../../../models/response.models'
import { GetUserCardWaterHistoryLatestRecordResponseDTO } from '../dto/user-card-water-response.dto'

const userCardWaterSuccessStub = (): IBaseResponse => ({
  httpCode: HttpStatus.CREATED,
  code: SuccessCodes.WaterRecordSaved,
  message: 'some message',
})

const userCardWaterStub = (): GetUserCardWaterHistoryLatestRecordResponseDTO => ({
  id: 'some_test_id',
  goalWaterMl: 1000,
  goalWaterFloz: 33.814,
  waterFloz: 3.3814,
  waterMl: 100,
})

export const UserCardWaterService = jest.fn().mockReturnValue({
  getLatestWaterRecord: jest.fn().mockResolvedValue(userCardWaterStub()),
  saveWaterRecord: jest.fn().mockResolvedValue(userCardWaterSuccessStub()),
})
