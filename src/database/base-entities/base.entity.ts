import { IBaseEntity } from '../../models/base.models'
import { Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export abstract class BaseEntity implements IBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({
    nullable: false,
    select: false,
    default: (): string => 'CURRENT_TIMESTAMP',
    type: 'timestamp without time zone',
  })
  public createAt: Date

  @UpdateDateColumn({
    nullable: true,
    select: false,
    default: (): string => 'CURRENT_TIMESTAMP',
    type: 'timestamp without time zone',
  })
  public updateAt: Date
}
