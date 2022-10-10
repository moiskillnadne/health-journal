import { addDays, addMonths, addWeeks, isFuture, isPast, isToday } from 'date-fns'

import { Order } from '../../../constants/enums/pagination.constants'
import { TrackGroupSchedulePeriod } from '../../../constants/enums/track.constants'

import { arraySortByDate } from '../../../core/helpers/array-sort'

import { UserTracksEntity } from '../../../database/entities/user-tracks.entity'
import { UserVideosEntity } from '../../../database/entities/user-videos.entity'
import { UserArticlesEntity } from '../../../database/entities/user-articles.entity'
import { UserRecipesEntity } from '../../../database/entities/user-recipes.entity'
import { TrackGroupLineEntity } from '../../../database/entities/track-group-line.entity'

export const getNextDateBySchedulePeriod = (period: TrackGroupSchedulePeriod, date: Date) => {
  switch (period) {
    case TrackGroupSchedulePeriod.Daily:
      return addDays(date, 1)
    case TrackGroupSchedulePeriod.OncePerThreeDays:
      return addDays(date, 3)
    case TrackGroupSchedulePeriod.OncePerSevenDays:
      return addWeeks(date, 1)
    case TrackGroupSchedulePeriod.OncePerFourteenDays:
      return addWeeks(date, 2)
    case TrackGroupSchedulePeriod.OncePerThirtyDays:
      return addMonths(date, 1)
    default:
      return addDays(date, 1)
  }
}

export const getUserTrackGroupLines = (
  lines: TrackGroupLineEntity[],
  schedule: TrackGroupSchedulePeriod,
  assigned: Date,
): (TrackGroupLineEntity & { date: Date })[] => {
  const list = []
  let date = assigned

  while (lines.length && isPast(date)) {
    list.push({ ...lines[0], date })
    date = getNextDateBySchedulePeriod(schedule, new Date(date.getFullYear(), date.getMonth(), date.getDate()))
    lines.shift()
  }

  return list
}

export const getTodayTrackGroupsLinesWithoutFirstDay = (
  lines: TrackGroupLineEntity[],
  schedule: TrackGroupSchedulePeriod,
  assigned: Date,
): (TrackGroupLineEntity & { date: Date })[] => {
  const list = []
  let date = assigned

  while (lines.length && !isFuture(date)) {
    if (isToday(date) && lines[0]?.order && lines[0].order !== 1) {
      list.push({ ...lines[0], date })
    }
    date = getNextDateBySchedulePeriod(schedule, new Date(date.getFullYear(), date.getMonth(), date.getDate()))
    lines.shift()
  }

  return list
}

export const getUserTrackLines = (track: UserTracksEntity): Array<TrackGroupLineEntity & { date: Date }> => {
  return track.track.groups.reduce((list: Array<TrackGroupLineEntity & { date: Date }>, group) => {
    return [...list, ...getUserTrackGroupLines(group.lines, group.schedule, track.assignedAt)]
  }, [])
}

export const getUserTrackLinesContent = (lines: (TrackGroupLineEntity & { date: Date })[], option: string) =>
  lines.filter(
    (item, index, array) =>
      item[option] &&
      item[option].isPublished &&
      array.findIndex((filter) => filter[option]?.id === item[option].id) === index,
  )

export const getUserTracksContent = (
  tracks: UserTracksEntity[],
  option: string,
  lang: string,
): Array<{ id: string; name: string; items: (TrackGroupLineEntity & { date: Date })[] }> => {
  const userTracks = tracks.reduce((list, track) => {
    const items = arraySortByDate(getUserTrackLinesContent(getUserTrackLines(track), option), 'date', Order.ASC)
    if (items.length) {
      return [
        ...list,
        {
          id: track.track.id,
          name: lang === 'en' ? track.track.titleEn : track.track.titleSp,
          lastLineTs: Math.max(...items.map((line) => line.date.getTime())),
          items,
        },
      ]
    }
    return list
  }, [])

  const sortedTracks = arraySortByDate(userTracks, 'lastLineTs', Order.DESC)

  return sortedTracks.map(({ lastLineTs, ...track }) => track)
}

export const getUserVideoFlags = (userId: string, relation: UserVideosEntity[]) => {
  return relation.reduce(
    (list, item) => {
      if (item.userId === userId) {
        return {
          isFavorite: item.isFavorite,
          isVisited: item.isVisited,
          isViewed: item.isViewed,
        }
      }

      return list
    },
    {
      isFavorite: false,
      isVisited: false,
      isViewed: false,
    },
  )
}

export const getUserArticleFlags = (userId: string, relation: UserArticlesEntity[] | UserRecipesEntity[]) => {
  return (relation as any).reduce(
    (list, item) => {
      if (item.userId === userId) {
        return {
          isFavorite: item.isFavorite,
          isVisited: item.isVisited,
        }
      }

      return list
    },
    {
      isFavorite: false,
      isVisited: false,
    },
  )
}

export const checkRelatedNewContent = (
  userId: string,
  relation: UserVideosEntity[] | UserArticlesEntity[] | UserRecipesEntity[],
) => {
  const content = (relation as any).find((item) => item.userId === userId)

  return !content || !content.isVisited
}
