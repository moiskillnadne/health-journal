import { StateEntity } from './state.entity'
import { CountryEntity } from './country.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from '../base-entities/base.entity'
import { ICityRawModel } from '../../models/state.models'

@Entity()
export class CityEntity extends BaseEntity implements ICityRawModel {
  @Column({
    nullable: false,
    unique: false,
  })
  public name: string

  @ManyToOne(() => CountryEntity)
  @JoinColumn()
  public country: CountryEntity

  @ManyToOne(() => StateEntity)
  @JoinColumn()
  public state: StateEntity
}
