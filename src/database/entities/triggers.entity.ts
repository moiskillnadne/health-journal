import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../base-entities/base.entity'

@Entity()
export class TriggersEntity extends BaseEntity {
  @Column({
    nullable: false,
  })
  shortName: string

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string
}
