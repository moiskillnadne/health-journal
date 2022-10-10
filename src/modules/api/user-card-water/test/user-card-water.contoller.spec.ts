import { I18nContext } from 'nestjs-i18n'
import { Test } from '@nestjs/testing'
import { GetUserCardWaterHistoryLatestRecordResponseDTO } from '../dto/user-card-water-response.dto'

import { UserCardWaterController } from '../user-card-water.controller'
import { UserCardWaterService } from '../user-card-water.service'
import { IBaseResponse } from '../../../../models/response.models'
import { PostUserCardWaterParamsDTO } from '../dto/user-card-water.dto'
import { HttpStatus } from '@nestjs/common'
import { SuccessCodes } from '../../../../constants/responses/codes.success.constants'

jest.mock('../user-card-water.service.ts')

describe('UserCardWaterController', () => {
  let userCardWaterController: UserCardWaterController
  let userCardWaterService: UserCardWaterService

  const userFromRequestStub = () => ({
    user: {
      id: 'userid',
      firstName: 'Victor',
      lastName: 'Ryabkov',
      username: 'victor_ryabkov',
      email: 'victor.ryabkov.test@gmail.com',
    },
  })

  const userCardWaterStub = (): GetUserCardWaterHistoryLatestRecordResponseDTO => ({
    id: 'some_test_id',
    goalWaterMl: 1000,
    goalWaterFloz: 33.814,
    waterFloz: 3.3814,
    waterMl: 100,
  })

  const userCardWaterSuccessStub = (): IBaseResponse => ({
    httpCode: HttpStatus.CREATED,
    code: SuccessCodes.WaterRecordSaved,
    message: 'some message',
  })

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [UserCardWaterController],
      providers: [UserCardWaterService],
    }).compile()

    userCardWaterController = moduleRef.get<UserCardWaterController>(UserCardWaterController)
    userCardWaterService = moduleRef.get<UserCardWaterService>(UserCardWaterService)
    jest.clearAllMocks()
  })

  describe('getLatestWaterRecord', () => {
    describe('when getLatestWaterRecord is called', () => {
      let waterLatestValue: GetUserCardWaterHistoryLatestRecordResponseDTO

      const { user: userStub } = userFromRequestStub()

      beforeEach(async () => {
        waterLatestValue = await userCardWaterController.getLatestValue(
          userFromRequestStub(),
          {} as unknown as I18nContext,
        )
      })

      test('then it should call userCardWaterService', () => {
        expect(userCardWaterService.getLatestWaterRecord).toBeCalledWith(userStub.id, {} as unknown as I18nContext)
      })

      test('then is should return value', () => {
        expect(waterLatestValue).toEqual(userCardWaterStub())
      })
    })
  })

  describe('saveWaterRecord', () => {
    describe('when saveWaterRecord called', () => {
      let saveWaterRecordSuccessResponse: IBaseResponse
      let createWaterRecordDto: PostUserCardWaterParamsDTO

      beforeEach(async () => {
        createWaterRecordDto = {
          water: {
            ml: userCardWaterStub().waterMl,
          },
          goalWater: {
            ml: userCardWaterStub().goalWaterMl,
          },
        }

        saveWaterRecordSuccessResponse = await userCardWaterController.saveWaterValue(
          userFromRequestStub(),
          {} as unknown as I18nContext,
          createWaterRecordDto,
        )
      })

      test('then it should call userCardWaterService', () => {
        expect(userCardWaterService.saveWaterRecord).toBeCalledWith(
          userFromRequestStub().user.id,
          {} as unknown as I18nContext,
          createWaterRecordDto,
        )
      })

      test('then is should return a success response', () => {
        expect(saveWaterRecordSuccessResponse).toEqual(userCardWaterSuccessStub())
      })
    })
  })
})
