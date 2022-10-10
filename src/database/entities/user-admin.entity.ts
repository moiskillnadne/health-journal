import { Column, Entity } from 'typeorm'
import { IUserAdminModel } from '../../models/user-admin.models'
import { BaseEntity } from '../base-entities/base.entity'
import { AdminUsersRoles } from '../../constants/permissions/admin.constants'
import { defaultAdminUserRole, defaultAdminUserStatus } from '../../constants/enums/admin-user.constants'

@Entity()
export class UserAdminEntity extends BaseEntity implements IUserAdminModel {
  @Column({
    unique: true,
  })
  public email!: string

  @Column({
    unique: true,
  })
  public username!: string

  @Column({
    unique: true,
    nullable: false,
  })
  public cognitoId!: string

  @Column({
    nullable: true,
  })
  public firstName?: string

  @Column({
    nullable: true,
  })
  public lastName?: string

  @Column({
    default: defaultAdminUserRole,
  })
  public role?: AdminUsersRoles = defaultAdminUserRole

  @Column({ type: 'boolean', default: defaultAdminUserStatus })
  public isActive? = defaultAdminUserStatus

  @Column({
    nullable: true,
    type: 'timestamp without time zone',
  })
  public lastLoginAt?: Date

  @Column({
    select: false,
    default: 0,
  })
  public loginFailedAttemptsCount?: number

  @Column({
    select: false,
    nullable: true,
    type: 'timestamp without time zone',
  })
  public lastLoginAttemptAt?: Date
}
