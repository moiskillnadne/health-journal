import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { compare, hash, genSalt } from 'bcrypt'
import { createHmac } from 'crypto'
import { Environment } from '../../constants/config.constants'

@Injectable()
export class CryptService {
  constructor(protected configService: ConfigService) {}

  public comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword)
  }

  protected async hashPassword(password: string): Promise<string> {
    try {
      const salt = await genSalt(parseInt(this.configService.get(Environment.PasswordSalt)))

      return hash(password, salt)
    } catch (e) {
      throw e
    }
  }

  public generateSecretHash(username: string): string {
    return createHmac('SHA256', this.configService.get(Environment.CognitoSecretHash))
      .update(username + this.configService.get(Environment.CognitoClientId))
      .digest('base64')
  }
}
