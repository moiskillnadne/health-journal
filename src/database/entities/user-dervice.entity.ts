import { UserEntity } from './user.entity'
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm'
import { BaseEntity } from '../base-entities/base.entity'

@Entity()
export class UserDeviceEntity extends BaseEntity {
  @Column({
    nullable: false,
    unique: true,
  })
  public fcmToken!: string

  @Column({
    type: 'uuid',
    nullable: false,
  })
  public userId!: string

  @OneToMany(() => UserEntity, (user) => user.device, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  public user: UserEntity
}
