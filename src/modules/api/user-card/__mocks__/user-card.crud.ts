const userFromRequestStub = () => ({
  user: {
    id: 'userid',
    firstName: 'Victor',
    lastName: 'Ryabkov',
    username: 'victor_ryabkov',
    email: 'victor.ryabkov.test@gmail.com',
  },
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

export const UserCardCrudService = jest.fn().mockReturnValue({
  getUserCardByUserIdWithParams: jest.fn().mockResolvedValue(userCardStub()),
  upsertUserCardByUserId: jest.fn().mockResolvedValue(userCardStub()),
})
