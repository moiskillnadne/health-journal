import { Column, Entity } from 'typeorm'

import { BaseEntity } from '../base-entities/base.entity'

@Entity()
export class RaceEntity extends BaseEntity {
  @Column({
    nullable: false,
  })
  name: string

  @Column({ nullable: true })
  description?: string
}
