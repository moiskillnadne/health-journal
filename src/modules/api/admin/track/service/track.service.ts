import { Injectable } from '@nestjs/common'
import { TrackCrud } from '../crud/track.crud'
import { GetTrackResponseDTO, TrackListingOptionsDTO } from '../dto/track.dto'
import { PageDTO, PageMetaDTO } from '../../../../../core/dtos/pagination'
import { TrackEntity } from '../../../../../database/entities/track.entity'

@Injectable()
export class TrackService {
  constructor(private trackCrud: TrackCrud) {}

  async getTracksList(options: TrackListingOptionsDTO) {
    const { entities, totalCount } = await this.trackCrud.getItemsByFilterParams(options)

    const transformedEntities = this.applyDaysToTrackList(entities)
    const entityWithTransformedLines = this.transformLines(transformedEntities)

    const pageMetaDto = new PageMetaDTO({ paginationOptionsDto: options, itemCount: totalCount })

    return new PageDTO(entityWithTransformedLines, pageMetaDto)
  }

  applyDaysToTrackList(tracks: TrackEntity[]): Array<GetTrackResponseDTO> {
    return tracks.map((track) => {
      let daysCount = 0
      for (const group of track.groups) {
        daysCount += group.lines.length
      }
      const transformedTrack = { ...track, ...{ days: daysCount } }

      return transformedTrack
    })
  }

  transformLines(tracks: Array<GetTrackResponseDTO>) {
    return tracks.map((track) => {
      const transformedGroups = track.groups.map((group) => {
        const transformedLines = group.lines.map((line) => ({
          id: line.id,
          order: line.order,
          video: line.video?.id &&
            line.video?.isPublished && {
              id: line.video?.id,
              label: line.video?.titleEn,
            },
          recipe: line.recipe?.id &&
            line.recipe?.isPublished && {
              id: line.recipe?.id,
              label: line.recipe?.titleEn,
            },
          article: line.article?.id &&
            line.article?.isPublished && {
              id: line.article?.id,
              label: line.article?.titleEn,
            },
        }))

        return { ...group, lines: [...transformedLines] }
      })

      return { ...track, groups: [...transformedGroups] }
    })
  }
}
