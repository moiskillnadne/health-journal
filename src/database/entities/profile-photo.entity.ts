import { UserEntity } from './user.entity'
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { BaseEntity } from '../base-entities/base.entity'

@Entity()
export class ProfilePhotoEntity extends BaseEntity {
  @OneToOne(() => UserEntity)
  @JoinColumn()
  public user: UserEntity

  @Column({
    nullable: false,
  })
  public base64: string

  @Column({
    nullable: false,
  })
  public mimeType: string
}
