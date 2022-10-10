import { Column, Entity } from 'typeorm'
import { ICountryModel } from '../../models/country.models'
import { BaseEntity } from '../base-entities/base.entity'

@Entity()
export class CountryEntity extends BaseEntity implements ICountryModel {
  @Column({
    nullable: false,
    unique: false,
  })
  public name!: string

  @Column({
    nullable: false,
    unique: false,
  })
  public code!: string
}
