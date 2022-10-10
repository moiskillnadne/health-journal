import { Environment } from './../../constants/config.constants'
import { CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import * as jwt from 'jsonwebtoken'
import { firstValueFrom } from 'rxjs'
import { map } from 'rxjs/operators'
import * as jwkToPem from 'jwk-to-pem'
import { UserCrudService } from '../../modules/api/user/user.crud'
import { HttpService } from '@nestjs/axios'
import { CustomResponse } from '../../constants/responses/messages.error.constants'
import { IS_PUBLIC_KEY } from '../decorators/public-route.decorator'
import { UserAdminEntityBaseService } from '../../modules/admin-auth/services/entity/admin-auth.entity.service'
import { AdminUserPermissionsType, AdminUsersRolesPermissionsMap } from '../../constants/permissions/admin.constants'
import { PERMISSIONS_KEY } from '../decorators/permissions.decorators'

export enum RequestSource {
  MobileApp = 'MOBILE_APP',
  WebAdmin = 'WEB_ADMIN',
}

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(
    private http: HttpService,
    private userCrudService: UserCrudService,
    private adminUserService: UserAdminEntityBaseService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublicRoute(context)) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const requestSource = request.headers.source ?? RequestSource.MobileApp

    try {
      const token = this.getTokenFromHeader(request.headers.authorization)
      const pem = await this.getPem(token, requestSource)
      const payload = await this.verifyToken(token, pem)

      if (requestSource === RequestSource.WebAdmin) {
        request.user = await this.adminUserService.getUserByCognitoId(payload.sub)
      } else {
        request.user = await this.userCrudService.getUserByCognitoId(payload.sub)
      }

      const isClaimsValid = this.verifyClaims(payload, requestSource)
      if (!isClaimsValid) {
        return isClaimsValid
      }

      if (requestSource === RequestSource.WebAdmin) {
        if (!request.user.isActive) {
          return false
        }

        const requiredPermissions = this.reflector.getAllAndOverride<AdminUserPermissionsType[]>(PERMISSIONS_KEY, [
          context.getHandler(),
          context.getClass(),
        ])
        if (requiredPermissions) {
          const userRolePermissions = AdminUsersRolesPermissionsMap[request.user.role]

          return requiredPermissions.some((permission) => userRolePermissions.includes(permission))
        }
      }

      return true
    } catch (error) {
      throw new UnauthorizedException({
        code: HttpStatus.FORBIDDEN,
        message: CustomResponse.Forbidden,
      })
    }
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
  }

  private getTokenFromHeader(authHeader: string): string {
    return authHeader?.replace('Bearer ', '')
  }

  private verifyClaims(claims: any, source: RequestSource): boolean {
    const clientId =
      source === RequestSource.MobileApp
        ? this.configService.get(Environment.CognitoClientId)
        : this.configService.get(Environment.CognitoClientIdAdmin)

    const poolId =
      source === RequestSource.MobileApp
        ? this.configService.get(Environment.CognitoPoolId)
        : this.configService.get(Environment.CognitoPoolIdAdmin)

    return claims.aud === clientId && claims.iss.includes(poolId) && claims.token_use === 'id'
  }

  private verifyToken(token: string, pemKey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, pemKey, { algorithms: ['RS256'] }, (err, decodedToken) => {
        if (err) {
          return reject(err)
        }

        resolve(decodedToken)
      })
    })
  }

  private async getPem(token: string, source: RequestSource) {
    const { header } = jwt.decode(token, {
      complete: true,
    })
    const jwks = await this.getJWKs(source)
    const targetJwk = jwks.find((jwk) => jwk.kid === header.kid)
    return jwkToPem(targetJwk)
  }

  private getJWKs(source: RequestSource) {
    const region = this.configService.get<string>(Environment.CognitoRegion)

    const userPoolId =
      source === RequestSource.MobileApp
        ? this.configService.get<string>(Environment.CognitoPoolId)
        : this.configService.get<string>(Environment.CognitoPoolIdAdmin)

    const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
    const observable$ = this.http.get(url).pipe(map((response) => response.data.keys))

    return firstValueFrom(observable$)
  }
}
