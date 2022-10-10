import { CountryEntity } from './country.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from '../base-entities/base.entity'
import { IStateRawModel } from '../../models/state.models'

@Entity()
export class StateEntity extends BaseEntity implements IStateRawModel {
  @Column({
    nullable: false,
    unique: false,
  })
  public name: string

  @Column({
    nullable: true,
    unique: false,
  })
  public code: string

  @ManyToOne(() => CountryEntity)
  @JoinColumn()
  public country: CountryEntity
}
