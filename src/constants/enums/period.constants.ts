export enum Period {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export enum IntervalPeriod {
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export enum RecurrencePeriod {
  SixMonth = '6 months',
  OneYear = '1 year',
  TwoYears = '2 years',
  ThreeYears = '3 years',
  FiveYears = '5 years',
  TenYears = '10 years',
}

export const RecurrencePeriodsToThreeYearsInMonth = {
  [RecurrencePeriod.SixMonth]: 6,
  [RecurrencePeriod.OneYear]: 12,
  [RecurrencePeriod.TwoYears]: 24,
  [RecurrencePeriod.ThreeYears]: 36,
}

export const RecurrencePeriodsToFiveYearsInMonth = {
  ...RecurrencePeriodsToThreeYearsInMonth,
  [RecurrencePeriod.FiveYears]: 60,
}

export const RecurrencePeriodsToTenYearsInMonth = {
  ...RecurrencePeriodsToFiveYearsInMonth,
  [RecurrencePeriod.TenYears]: 120,
}
