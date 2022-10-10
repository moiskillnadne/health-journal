import { I18nContext } from 'nestjs-i18n'
import { Test } from '@nestjs/testing'
import { UserCardCrudService } from '../../user-card/user-card.crud'

import { UserCardWaterCrudService } from '../user-card-water.crud'
import { UserCardWaterService } from '../user-card-water.service'
import { GetUserCardWaterHistoryLatestRecordResponseDTO } from '../dto/user-card-water-response.dto'

jest.mock('../user-card-water.crud.ts')
jest.mock('../../user-card/user-card.crud.ts')

describe('UserCardWaterService', () => {
  let userCardWaterService: UserCardWaterService
  let userCardWaterCrudService: UserCardWaterCrudService
  let userCardCrudService: UserCardCrudService

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

  const userCardStub = () => ({
    id: 'some-test-user-card-id',
    userId: userFromRequestStub().user.id,
    heightCm: 191,
    heightFt: 6,
    heightIn: 6,
    goalWeightLb: 32,
    goalWeightKg: 85,
    sleepGoal: 8,
    goalPressureSystolicMmHg: 100,
    goalPressureDiastolicMmHg: 100,
    goalHba1c: 100,
    goalRandomBloodSugarMgDl: 50,
    goalRandomBloodSugarMmolL: 50,
    goalFastingBloodSugarMgDl: 50,
    goalFastingBloodSugarMmolL: 50,
    goalAfterMealBloodSugarMgDl: 50,
    goalAfterMealBloodSugarMmolL: 50,
    goalLdlMgDl: 20,
    goalLdlMmolL: 20,
    goalTriglycerideMgDl: 20,
    goalTriglycerideMmolL: 20,
    goalSteps: 5000,
    cpap: true,
    goalWaterFloz: 1000,
    goalWaterMl: 1000,
  })

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [UserCardWaterService, UserCardWaterCrudService, UserCardCrudService],
    }).compile()

    userCardWaterService = moduleRef.get<UserCardWaterService>(UserCardWaterService)
    userCardWaterCrudService = moduleRef.get<UserCardWaterCrudService>(UserCardWaterCrudService)
    userCardCrudService = moduleRef.get<UserCardCrudService>(UserCardCrudService)

    jest.clearAllMocks()
  })

  describe('getLatestWaterRecord', () => {
    describe('when getLatestWaterRecord is called', () => {
      let latestWaterRecord: GetUserCardWaterHistoryLatestRecordResponseDTO

      beforeEach(async () => {
        latestWaterRecord = await userCardWaterService.getLatestWaterRecord(
          userFromRequestStub().user.id,
          {} as unknown as I18nContext,
        )
      })

      test('then it should call userCardCrudService', () => {
        expect(userCardCrudService.getUserCardByUserIdWithParams).toBeCalledTimes(1)
        expect(userCardCrudService.getUserCardByUserIdWithParams).toBeCalledWith(userFromRequestStub().user.id, {
          select: {
            id: true,
            goalWaterFloz: true,
            goalWaterMl: true,
          },
        })
      })

      test('then it should call userCardWaterCrudService', () => {
        expect(userCardWaterCrudService.getTodaysWaterRecordsById).toBeCalledTimes(1)
        expect(userCardWaterCrudService.getTodaysWaterRecordsById).toBeCalledWith(userCardStub().id)
      })

      test('then it should return latestWaterRecord', () => {
        expect(latestWaterRecord).toEqual({ ...userCardWaterStub(), ...latestWaterRecord })
      })
    })
  })
})
