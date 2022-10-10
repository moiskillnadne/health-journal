import { I18nContext } from 'nestjs-i18n'
import { Injectable } from '@nestjs/common'

import { Order } from '../../../constants/enums/pagination.constants'
import { galleryArticlesImagePresignedLinkExpires } from '../../../constants/enums/gallery.constants'

import { S3Service } from '../../../integrations/s3/s3.service'

import { UserMedicationsEntity } from '../../../database/entities/user-medications.entity'
import { UserConditionsEntity } from '../../../database/entities/user-conditions.entity'

import { checkRelatedNewContent, getUserArticleFlags, getUserVideoFlags } from '../user-tracks/user-tracks.helper'

import { UserMedicationsCrudService } from '../user-medications/user-medications.crud'
import { UserConditionsCrudService } from '../user-conditions/user-conditions.crud'

import { GetUserVitalVideosResponseDto, GetUserVitalArticlesResponseDto } from './dto/user-vitals.response.dto'

@Injectable()
export class UserVitalsService {
  constructor(
    private userMedicationsCrudService: UserMedicationsCrudService,
    private userConditionsCrudService: UserConditionsCrudService,
    private s3Service: S3Service,
  ) {}

  public async getUserVitalsNewContentByUserId(userId: string): Promise<any> {
    let hasNewVideos = false
    let hasNewArticles = false

    const [medications, conditions] = await Promise.all([
      this.userMedicationsCrudService.getUserMedicationsByUserId(userId, {
        relations: {
          medication: {
            videos: {
              userVideos: true,
            },
            articles: {
              userArticles: true,
            },
          },
        },
      }),
      this.userConditionsCrudService.getUserConditionsByUserId(userId, {
        relations: {
          condition: {
            videos: {
              userVideos: true,
            },
            articles: {
              userArticles: true,
            },
          },
        },
      }),
    ])

    const vitals = [...medications, ...conditions].reduce((list, item) => {
      return [
        ...list,
        ...((item as UserMedicationsEntity).medication?.videos || []),
        ...((item as UserMedicationsEntity).medication?.articles || []),
        ...((item as UserConditionsEntity).condition?.videos || []),
        ...((item as UserConditionsEntity).condition?.articles || []),
      ]
    }, [])

    while (vitals.length) {
      if (vitals[0].isPublished) {
        if (!hasNewVideos && vitals[0].userVideos && checkRelatedNewContent(userId, vitals[0].userVideos)) {
          hasNewVideos = true
        }

        if (!hasNewArticles && vitals[0].userArticles && checkRelatedNewContent(userId, vitals[0].userArticles)) {
          hasNewArticles = true
        }

        if (hasNewVideos && hasNewArticles) {
          break
        }
      }

      vitals.shift()
    }

    return {
      videos: hasNewVideos,
      articles: hasNewArticles,
    }
  }

  public async getUserVitalVideosByUserId(userId: string, i18n: I18nContext): Promise<GetUserVitalVideosResponseDto[]> {
    const [medications, conditions] = await Promise.all([
      this.userMedicationsCrudService.getUserMedicationsByUserId(userId, {
        where: {
          medication: {
            videos: {
              isPublished: true,
            },
          },
        },
        relations: {
          medication: {
            videos: {
              videoPreview: true,
              userVideos: true,
            },
          },
        },
        order: {
          createAt: Order.DESC,
        },
      }),
      this.userConditionsCrudService.getUserConditionsByUserId(userId, {
        where: {
          condition: {
            videos: {
              isPublished: true,
            },
          },
        },
        relations: {
          condition: {
            videos: {
              videoPreview: true,
              userVideos: true,
            },
          },
        },
        order: {
          createAt: Order.DESC,
        },
      }),
    ])

    const videos = [...medications, ...conditions]
      .reduce((list, item) => {
        return [
          ...list,
          ...((item as UserMedicationsEntity).medication?.videos || []),
          ...((item as UserConditionsEntity).condition?.videos || []),
        ]
      }, [])
      .filter((item, index, array) => array.findIndex((filter) => filter.id === item.id) === index)
      .map(async (gallery) => {
        return {
          id: gallery.id,
          title: i18n.lang === 'en' ? gallery.titleEn : gallery.titleSp,
          preview: await this.s3Service.getPresignedLink(
            gallery.videoPreview.bucketKey,
            gallery.videoPreview.bucketName,
            galleryArticlesImagePresignedLinkExpires,
          ),
          ...getUserVideoFlags(userId, gallery.userVideos),
        }
      })

    return Promise.all(videos)
  }

  public async getUserVitalArticlesByUserId(
    userId: string,
    i18n: I18nContext,
  ): Promise<GetUserVitalArticlesResponseDto[]> {
    const [medications, conditions] = await Promise.all([
      this.userMedicationsCrudService.getUserMedicationsByUserId(userId, {
        where: {
          medication: {
            articles: {
              isPublished: true,
            },
          },
        },
        relations: {
          medication: {
            articles: {
              image: true,
              userArticles: true,
            },
          },
        },
        order: {
          createAt: Order.DESC,
        },
      }),
      this.userConditionsCrudService.getUserConditionsByUserId(userId, {
        where: {
          condition: {
            articles: {
              isPublished: true,
            },
          },
        },
        relations: {
          condition: {
            articles: {
              image: true,
              userArticles: true,
            },
          },
        },
        order: {
          createAt: Order.DESC,
        },
      }),
    ])

    const articles = [...medications, ...conditions]
      .reduce((list, item) => {
        return [
          ...list,
          ...((item as UserMedicationsEntity).medication?.articles || []),
          ...((item as UserConditionsEntity).condition?.articles || []),
        ]
      }, [])
      .filter((item, index, array) => array.findIndex((filter) => filter.id === item.id) === index)
      .map(async (gallery) => {
        return {
          id: gallery.id,
          title: i18n.lang === 'en' ? gallery.titleEn : gallery.titleSp,
          preview: await this.s3Service.getPresignedLink(
            gallery.image.bucketKey,
            gallery.image.bucketName,
            galleryArticlesImagePresignedLinkExpires,
          ),
          ...getUserArticleFlags(userId, gallery.userArticles),
        }
      })

    return Promise.all(articles)
  }
}
