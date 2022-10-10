import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserEntity } from './user.entity'

@Entity()
export class UserLifestyleSurveyEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string

  @Column({
    default: false,
    nullable: true,
  })
  money?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  time?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  energy?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  socialLife?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  unsureWhatToDo?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  emotionalConnectWithFoodDrinks?: boolean

  @Column({
    default: false,
    nullable: true,
  })
  liveHealthyLifestyle?: boolean

  @Column({
    nullable: true,
  })
  other?: string

  @OneToOne(() => UserEntity, (user) => user.lifestyleSurvey, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity
}
