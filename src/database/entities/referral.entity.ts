import { Column, Entity } from 'typeorm'
import { IReferralModel, ReferralType } from '../../models/referral.models'
import { BaseEntity } from '../base-entities/base.entity'

@Entity()
export class ReferralEntity extends BaseEntity implements IReferralModel {
  @Column({
    unique: false,
    enum: ReferralType,
  })
  public type!: ReferralType

  @Column({
    unique: false,
    nullable: true,
  })
  public value?: string
}
