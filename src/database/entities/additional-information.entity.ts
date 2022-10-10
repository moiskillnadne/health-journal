import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

import { UserEntity } from './user.entity'

@Entity()
export class UserAdditionalInformationEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string

  @Column({
    nullable: false,
  })
  value: string

  @OneToOne(() => UserEntity, (user) => user.additionalInformation, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity
}
