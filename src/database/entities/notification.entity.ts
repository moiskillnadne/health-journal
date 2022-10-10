import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../base-entities/base.entity'

@Entity()
export class NotificationEntity extends BaseEntity {
  @Column({
    nullable: false,
    unique: true,
  })
  public name!: string

  @Column({
    nullable: true,
  })
  public description!: string

  @Column({
    nullable: false,
    unique: true,
  })
  public tag!: string
}
