import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Environment } from '../../constants/config.constants'
import * as mailchimp from '@mailchimp/mailchimp_marketing'
import { createHash } from 'crypto'
import { Status } from '@mailchimp/mailchimp_marketing'
import { BaseError } from './errors/base.error'
import { AudienceMemberExistError } from './errors/audience-member-exist.error'
import { AudienceMemberNotExistError } from './errors/audience-member-not-exist.error'

@Injectable()
export class MailchimpService {
  private mailchimpClient

  constructor(private configService: ConfigService) {
    mailchimp.setConfig({
      apiKey: configService.get(Environment.MailChimpApiKey),
      server: configService.get(Environment.MailChimpServerPrefix),
    })
    this.mailchimpClient = mailchimp
  }

  public async addAudienceMember(
    audienceId: string,
    memberData: {
      email: string
      firstName?: string
      lastName?: string
      status: Status
    },
  ) {
    try {
      return await mailchimp.lists.addListMember(audienceId, {
        email_address: memberData.email,
        status: memberData.status,
        ...(memberData.firstName !== undefined || memberData.lastName !== undefined
          ? {
              merge_fields: {
                ...(memberData.firstName !== undefined ? { FNAME: memberData.firstName } : {}),
                ...(memberData.lastName !== undefined ? { LNAME: memberData.lastName } : {}),
              },
            }
          : {}),
      })
    } catch (e) {
      if (e.response?.body?.title === 'Member Exists') {
        throw new AudienceMemberExistError(e)
      }
      throw new BaseError(e)
    }
  }

  public async updateAudienceMember(
    audienceId: string,
    memberEmail: string,
    updateMemberData: {
      email?: string
      firstName?: string
      lastName?: string
      status?: Status
    },
  ) {
    try {
      const subscriberEmailHash = createHash('md5').update(memberEmail.toLowerCase()).digest('hex')
      return await mailchimp.lists.updateListMember(audienceId, subscriberEmailHash, {
        ...(updateMemberData.email !== undefined ? { email_address: updateMemberData.email } : {}),
        ...(updateMemberData.status !== undefined ? { status: updateMemberData.status } : {}),
        ...(updateMemberData.firstName !== undefined || updateMemberData.lastName !== undefined
          ? {
              merge_fields: {
                ...(updateMemberData.firstName !== undefined ? { FNAME: updateMemberData.firstName } : {}),
                ...(updateMemberData.lastName !== undefined ? { LNAME: updateMemberData.lastName } : {}),
              },
            }
          : {}),
      })
    } catch (e) {
      if (
        e.response?.body?.title === 'Invalid Resource' &&
        (e.response?.body?.errors ?? []).some((mcErr) => mcErr?.field === 'email address')
      ) {
        throw new AudienceMemberExistError(e)
      }
      throw new BaseError(e)
    }
  }

  public async getAudienceMember(audienceId: string, memberEmail: string) {
    try {
      const memberEmailHash = createHash('md5').update(memberEmail.toLowerCase()).digest('hex')
      return await mailchimp.lists.getListMember(audienceId, memberEmailHash)
    } catch (e) {
      if (e.response?.body?.status === 404 && e.response?.body?.title === 'Resource Not Found') {
        throw new AudienceMemberNotExistError(e)
      }

      throw new BaseError(e)
    }
  }

  public async isAudienceMemberExist(audienceId: string, memberEmail: string): Promise<boolean> {
    try {
      await this.getAudienceMember(audienceId, memberEmail)
      return true
    } catch (e) {
      if (e instanceof AudienceMemberNotExistError) {
        return false
      }
      throw e
    }
  }
}
