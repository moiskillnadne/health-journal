import { TargetGroup } from './target-group.constants'

export enum Condition {
  DiabetesType2 = 'diabetesType2',
  DiabetesType1 = 'diabetesType1',
  PreDiabetes = 'preDiabetes',
  InsulinResistance = 'insulinResistance',
  PolycysticOvarianSyndrome = 'polycysticOvarianSyndrome',
  HighBloodPressure = 'highBloodPressure',
  HeartDisease = 'heartDisease',
  HighCholesterolTriglycerides = 'highCholesterolTriglycerides',
  OverweightOrObese = 'overweightOrObese',
  SleepApnea = 'sleepApnea',
  AcidRefluxHeartburn = 'acidRefluxHeartburn',
  FattyLiverDisease = 'fattyLiverDisease',
  ArthritisJointPain = 'arthritisJointPain',
  None = 'none',
  Other = 'other',
}

export const conditionToTargetGroup = {
  [Condition.DiabetesType2]: TargetGroup.DiabetesType2,
  [Condition.DiabetesType1]: TargetGroup.DiabetesType1,
  [Condition.PreDiabetes]: TargetGroup.PreDiabetes,
  [Condition.InsulinResistance]: TargetGroup.InsulinResistance,
  [Condition.PolycysticOvarianSyndrome]: TargetGroup.PolycysticOvarianSyndrome,
  [Condition.HighBloodPressure]: TargetGroup.HighBloodPressure,
  [Condition.HeartDisease]: TargetGroup.HeartDisease,
  [Condition.HighCholesterolTriglycerides]: TargetGroup.HighCholesterolTriglycerides,
  [Condition.OverweightOrObese]: TargetGroup.OverweightOrObese,
  [Condition.SleepApnea]: TargetGroup.SleepApnea,
  [Condition.AcidRefluxHeartburn]: TargetGroup.AcidRefluxHeartburn,
  [Condition.FattyLiverDisease]: TargetGroup.FattyLiverDisease,
  [Condition.ArthritisJointPain]: TargetGroup.ArthritisJointPain,
  [Condition.OverweightOrObese]: TargetGroup.BmiMore25,
  [Condition.None]: TargetGroup.None,
}

export enum ConditionStatus {
  Current = 'current',
  Resolved = 'resolved',
}

export const ConditionStatusReportFormat = 'Currently'
