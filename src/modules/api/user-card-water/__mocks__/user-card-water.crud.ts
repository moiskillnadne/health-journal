import { UserCardWaterHistoryEntity } from '../../../../database/entities/user-card-water.entity'

const userCardWaterHistoryStub = (): Omit<UserCardWaterHistoryEntity, 'card' | 'createAt' | 'updateAt'> => ({
  id: 'water-history-record-id',
  cardId: 'user-card-id',
  waterFloz: 3.3814,
  waterMl: 100,
})

export const UserCardWaterCrudService = jest.fn().mockReturnValue({
  getTodaysWaterRecordsById: jest.fn().mockResolvedValue([userCardWaterHistoryStub()]),
  insertWaterValue: jest.fn().mockResolvedValue({}),
})
