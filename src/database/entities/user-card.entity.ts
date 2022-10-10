import { Column, Entity, OneToOne, OneToMany, JoinColumn } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'
import { UserEntity } from './user.entity'
import { UserCardWeightHistoryEntity } from './user-card-weight-history.entity'
import { UserCardRandomBloodSugarHistoryEntity } from './user-card-random-blood-sugar-history.entity'
import { UserCardFastingBloodSugarHistoryEntity } from './user-card-fasting-blood-sugar-history.entity'
import { UserCardAfterMealBloodSugarHistoryEntity } from './user-card-after-meal-blood-sugar-history.entity'
import { UserCardLdlLevelHistoryEntity } from './user-card-ldl-level-history.entity'
import { UserCardTriglycerideLevelHistoryEntity } from './user-card-triglyceride-level-history.entity'
import { UserCardHba1cHistoryEntity } from './user-card-hba1c-history.entity'
import { UserCardBloodPressureHistoryEntity } from './user-card-blood-pressure-history.entity'
import { UserCardStepsHistoryEntity } from './user-card-steps-history.entity'
import { UserCardProfileEntity } from './user-card-profile.entity'
import { UserCardWaterHistoryEntity } from './user-card-water.entity'
import { UserCardSleepHistoryEntity } from './user-card-sleep-history.entity'

@Entity()
export class UserCardEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    unique: true,
  })
  userId: string

  @Column({ nullable: true })
  heightFt?: number

  @Column({ nullable: true })
  heightIn?: number

  @Column({ nullable: true })
  heightCm?: number

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 1,
    nullable: true,
  })
  goalWeightLb?: number

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 1,
    nullable: true,
  })
  goalWeightKg?: number

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 1,
    nullable: true,
  })
  sleepGoal?: number

  @Column({ nullable: true })
  goalPressureSystolicMmHg?: number

  @Column({ nullable: true })
  goalPressureDiastolicMmHg?: number

  @Column({
    type: 'float',
    nullable: true,
  })
  goalHba1c?: number

  @Column({ nullable: true })
  goalRandomBloodSugarMgDl?: number

  @Column({
    type: 'float',
    nullable: true,
  })
  goalRandomBloodSugarMmolL?: number

  @Column({ nullable: true })
  goalFastingBloodSugarMgDl?: number

  @Column({
    type: 'float',
    nullable: true,
  })
  goalFastingBloodSugarMmolL?: number

  @Column({ nullable: true })
  goalAfterMealBloodSugarMgDl?: number

  @Column({
    type: 'float',
    nullable: true,
  })
  goalAfterMealBloodSugarMmolL?: number

  @Column({ nullable: true })
  goalLdlMgDl?: number

  @Column({
    type: 'float',
    nullable: true,
  })
  goalLdlMmolL?: number

  @Column({ nullable: true })
  goalTriglycerideMgDl?: number

  @Column({
    type: 'float',
    nullable: true,
  })
  goalTriglycerideMmolL?: number

  @Column({ nullable: true })
  goalSteps?: number

  @Column({
    type: 'boolean',
    nullable: true,
  })
  cpap?: boolean

  @Column({
    type: 'float',
    nullable: true,
  })
  goalWaterFloz?: number

  @Column({
    type: 'float',
    nullable: true,
  })
  goalWaterMl?: number

  @OneToOne(() => UserEntity, (user) => user.card, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity

  @OneToMany(() => UserCardWeightHistoryEntity, (weight) => weight.card)
  @JoinColumn()
  weight: UserCardWeightHistoryEntity[]

  @OneToMany(() => UserCardRandomBloodSugarHistoryEntity, (sugar) => sugar.card)
  @JoinColumn()
  randomBloodSugar: UserCardRandomBloodSugarHistoryEntity[]

  @OneToMany(() => UserCardFastingBloodSugarHistoryEntity, (sugar) => sugar.card)
  @JoinColumn()
  fastingBloodSugar: UserCardFastingBloodSugarHistoryEntity[]

  @OneToMany(() => UserCardAfterMealBloodSugarHistoryEntity, (sugar) => sugar.card)
  @JoinColumn()
  afterMealBloodSugar: UserCardAfterMealBloodSugarHistoryEntity[]

  @OneToMany(() => UserCardLdlLevelHistoryEntity, (ldl) => ldl.card)
  @JoinColumn()
  ldl: UserCardLdlLevelHistoryEntity[]

  @OneToMany(() => UserCardWaterHistoryEntity, (water) => water.card)
  @JoinColumn()
  water: UserCardWaterHistoryEntity[]

  @OneToMany(() => UserCardTriglycerideLevelHistoryEntity, (triglyceride) => triglyceride.card)
  @JoinColumn()
  triglyceride: UserCardTriglycerideLevelHistoryEntity[]

  @OneToMany(() => UserCardHba1cHistoryEntity, (hba1c) => hba1c.card)
  @JoinColumn()
  hba1c: UserCardHba1cHistoryEntity[]

  @OneToMany(() => UserCardBloodPressureHistoryEntity, (pressure) => pressure.card)
  @JoinColumn()
  bloodPressure: UserCardBloodPressureHistoryEntity[]

  @OneToMany(() => UserCardStepsHistoryEntity, (steps) => steps.card)
  @JoinColumn()
  steps: UserCardStepsHistoryEntity[]

  @OneToOne(() => UserCardProfileEntity, (profile) => profile.card)
  profile: UserCardProfileEntity

  @OneToMany(() => UserCardSleepHistoryEntity, (sleep) => sleep.card)
  @JoinColumn()
  sleep: UserCardSleepHistoryEntity
}
