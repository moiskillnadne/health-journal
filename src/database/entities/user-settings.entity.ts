import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { Language } from '../../constants/language'
import { Measurements } from '../../constants/measurements'
import { IUserSettingsModel } from '../../models/user-settings.models'
import { BaseEntity } from '../base-entities/base.entity'
import { UserEntity } from './user.entity'

@Entity()
export class UserSettingsEntity extends BaseEntity implements IUserSettingsModel {
  @OneToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  public user!: UserEntity

  @Column({
    unique: false,
    nullable: false,
    enum: Language,
    default: Language.English,
  })
  public language!: Language

  @Column({
    unique: false,
    nullable: false,
    enum: Measurements,
    default: Measurements.USA,
  })
  public measurementSystem!: Measurements
}
