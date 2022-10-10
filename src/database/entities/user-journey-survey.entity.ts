import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserEntity } from './user.entity'

@Entity()
export class UserJourneySurveyEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string

  @Column({
    default: false,
    nullable: true,
  })
  reverseOrBetterManage?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  loseWeight?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  improveLabWorkWithoutMedications?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  feelBetter?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  lowerHealthcareCost?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  decreaseOrGetOffMedications?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  none?: boolean

  @OneToOne(() => UserEntity, (user) => user.journeySurvey, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity
}
