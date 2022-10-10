import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, In, Repository } from 'typeorm'
import { TrackEntity } from '../../../../../database/entities/track.entity'
import { PaginationOptionsDTO } from '../../../../../core/dtos/pagination'
import { TrackListingOptionsDTO } from '../dto/track.dto'
import { TrackGroupEntity } from '../../../../../database/entities/track-group.entity'
import { TrackGroupLineEntity } from '../../../../../database/entities/track-group-line.entity'

@Injectable()
export class TrackCrud {
  constructor(
    @InjectRepository(TrackEntity) private trackEntityRepository: Repository<TrackEntity>,
    @InjectRepository(TrackGroupEntity) private trackGroupEntityRepository: Repository<TrackGroupEntity>,
  ) {}

  save(track: Partial<TrackEntity>): Promise<TrackEntity> {
    return this.trackEntityRepository.save(track)
  }

  getTrackById(trackId: string, relations = []) {
    const findOptions = {
      where: {
        id: trackId,
      },
    }

    if (relations.length) {
      findOptions['relations'] = relations
    }

    return this.trackEntityRepository.findOne(findOptions)
  }

  async getItemsByFilterParams(
    filterParams: TrackListingOptionsDTO,
  ): Promise<{ entities: TrackEntity[]; totalCount: number }> {
    const queryBuilder = this.trackEntityRepository.createQueryBuilder('t')
    const preparedOrder = PaginationOptionsDTO.parseOrder(filterParams.order)

    if (filterParams.search) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.orWhere(`t.titleEn ILIKE :titleEn`, { titleEn: `%${filterParams.search}%` }).orWhere(
            `t.titleSp ILIKE :titleSp`,
            {
              titleSp: `%${filterParams.search}%`,
            },
          )
        }),
      )
    }

    const itemCount = await queryBuilder.getCount()
    queryBuilder
      .addSelect('t.createAt')
      .addSelect('t.updateAt')
      .leftJoinAndSelect('t.targetGroups', 'targetGroups')
      .addOrderBy(`t.${preparedOrder.field}`, preparedOrder.sort)
      .skip((filterParams.page - 1) * filterParams.take)
      .take(filterParams.take)
    const tracks = await queryBuilder.getMany()

    const tracksGroups = await this.trackGroupEntityRepository
      .createQueryBuilder('groups')
      .leftJoinAndSelect('groups.lines', 'lines')
      .leftJoinAndSelect('lines.video', 'video')
      .leftJoinAndSelect('lines.article', 'article')
      .leftJoinAndSelect('lines.recipe', 'recipe')
      .addOrderBy('groups.order', 'ASC')
      .addOrderBy('lines.order', 'ASC')
      .where({ trackId: In(tracks.map((v) => v.id)) })
      .getMany()

    const trackIdToGroupsMap = {}
    for (const trackGroup of tracksGroups) {
      if (trackIdToGroupsMap[trackGroup.trackId] === undefined) {
        trackIdToGroupsMap[trackGroup.trackId] = []
      }
      trackIdToGroupsMap[trackGroup.trackId].push(trackGroup)
    }

    return {
      entities: tracks.map((track) => Object.assign(track, { groups: trackIdToGroupsMap?.[track.id] ?? [] })),
      totalCount: itemCount,
    }
  }

  async update(
    track: TrackEntity,
    {
      updateTrackData,
      addGroupsData,
      updateGroupsData,
      removeGroupsData,
      addGroupsLinesData,
      updateGroupsLinesData,
      removeGroupsLinesData,
    },
  ) {
    const areThereUpdates =
      Object.keys(updateTrackData) ||
      addGroupsData.length ||
      updateGroupsData.length ||
      removeGroupsData.length ||
      addGroupsLinesData.length ||
      updateGroupsLinesData.length ||
      removeGroupsLinesData.length
    return this.trackEntityRepository.manager.transaction(async (em) => {
      const dpActionsPromises = []
      // Update Track
      if (Object.keys(updateTrackData) || areThereUpdates) {
        let updateData = updateTrackData
        if (areThereUpdates) {
          updateData = { ...updateData, ...{ updateAt: new Date() } }
        }

        const preparedUpdateTrackData = (({ targetGroups, ...other }) => other)(updateData)
        if (Object.values(preparedUpdateTrackData).length) {
          dpActionsPromises.push(em.update(TrackEntity, { id: track.id }, preparedUpdateTrackData))
        }
        // Update Track's Target Groups
        if (updateData?.targetGroups && Object.values(updateData?.targetGroups).length) {
          dpActionsPromises.push(
            em
              .createQueryBuilder()
              .relation(TrackEntity, 'targetGroups')
              .of(track)
              .addAndRemove(updateData.targetGroups['add'], updateData.targetGroups['remove']),
          )
        }
      }

      // Add new Track Groups
      if (addGroupsData.length) {
        dpActionsPromises.push(em.save(TrackGroupEntity, addGroupsData))
      }

      // Update existed Track Groups
      if (updateGroupsData.length) {
        for (const updateGroupData of updateGroupsData) {
          dpActionsPromises.push(
            em.update(TrackGroupEntity, { id: updateGroupData.id }, (({ id, ...other }) => other)(updateGroupData)),
          )
        }
      }

      //Remove Track Groups
      if (removeGroupsData.length) {
        dpActionsPromises.push(em.remove(TrackGroupEntity, removeGroupsData))
      }

      // Add new Track Groups Lines
      if (addGroupsLinesData.length) {
        dpActionsPromises.push(em.save(TrackGroupLineEntity, addGroupsLinesData))
      }

      // Update existed Track Groups Lines
      if (updateGroupsLinesData.length) {
        for (const updateGroupLineData of updateGroupsLinesData) {
          dpActionsPromises.push(
            em.update(
              TrackGroupLineEntity,
              { id: updateGroupLineData.id },
              (({ id, ...other }) => other)(updateGroupLineData),
            ),
          )
        }
      }

      //Remove Track Groups Lines
      if (removeGroupsLinesData.length) {
        dpActionsPromises.push(em.remove(TrackGroupLineEntity, removeGroupsLinesData))
      }

      if (dpActionsPromises.length) {
        const dbActionsResult = await Promise.allSettled<Promise<void>[]>(dpActionsPromises)
        const areThereFails = dbActionsResult.filter((promiseResult) => promiseResult.status === 'rejected').length > 0

        if (areThereFails) {
          throw new Error('Updating failed')
        }
      }
    })
  }
}
