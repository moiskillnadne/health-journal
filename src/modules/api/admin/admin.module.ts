import { Module } from '@nestjs/common'
import { StorageController } from './storage/storage.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StorageEntity } from '../../../database/entities/storage.entity'
import { StorageEntityService } from './storage/storage-entity.service'
import { StorageService } from './storage/storage.service'
import { S3Module } from '../../../integrations/s3/s3.module'
import { ConfigModule } from '@nestjs/config'
import { UserAdminEntity } from '../../../database/entities/user-admin.entity'
import { AdminUserController } from './admin-user/admin-user.controller'
import { AdminUserService } from './admin-user/admin-user.service'
import { AdminUserCrud } from './admin-user/admin-user.crud'
import { GalleryService } from './gallery/gallery.service'
import { GalleryController } from './gallery/gallery.controller'
import { ConditionsCrudService } from '../conditions/conditions.crud'
import { ConditionsEntity } from '../../../database/entities/conditions.entity'
import { GalleryVideoCrud } from './gallery/crud/gallery-video.crud'
import { GalleryVideoEntity } from '../../../database/entities/gallery-video.entity'
import { GalleryArticleCrud } from './gallery/crud/gallery-article.crud'
import { GalleryArticleEntity } from '../../../database/entities/gallery-article.entity'
import { GalleryRecipeCrud } from './gallery/crud/gallery-recipe.crud'
import { GalleryRecipeEntity } from '../../../database/entities/gallery-recipe.entity'
import { TriggersEntity } from '../../../database/entities/triggers.entity'
import { TriggersCrudService } from '../triggers/triggers.crud'
import { MedicationsEntity } from '../../../database/entities/medications.entity'
import { MedicationsCrudService } from '../medications/medications.crud'
import { TrackController } from './track/track.controller'
import { TargetGroupEntity } from '../../../database/entities/target-group.entity'
import { TargetGroupCrud } from '../target-group/target-group.crud'
import { TrackAddService } from './track/service/track-add.service'
import { TrackCrud } from './track/crud/track.crud'
import { TrackEntity } from '../../../database/entities/track.entity'
import { TrackService } from './track/service/track.service'
import { TrackUpdateService } from './track/service/track-update.service'
import { TrackGroupCrud } from './track/crud/track-group.crud'
import { TrackGroupLineCrud } from './track/crud/track-group-line.crud'
import { TrackGroupEntity } from '../../../database/entities/track-group.entity'
import { TrackGroupLineEntity } from '../../../database/entities/track-group-line.entity'
import { NotificationCustomCrud } from './notification/crud/notification-custom.crud'
import { NotificationPredefinedCrud } from './notification/crud/notification-predefined.crud'
import { NotificationService } from './notification/notification.service'
import { NotificationController } from './notification/notification.controller'
import { NotificationPredefinedEntity } from '../../../database/entities/notification-predefined.entity'
import { NotificationCustomEntity } from '../../../database/entities/notification-custom.entity'
import { AnalyticService } from './analytic/analytic.service'
import { AnalyticController } from './analytic/analytic.controller'
import { AnalyticCrud } from './analytic/crud/analytic.crud'
import { UserEntity } from '../../../database/entities/user.entity'
import { CsvService } from '../../../core/services/csv/csv.service'
import { TmpService } from '../../../core/services/tmp.service'
import { RaceEntity } from '../../../database/entities/race.entity'
import { GenderEntity } from '../../../database/entities/gender.entity'
import { UserTracksModule } from '../user-tracks/user-tracks.module'
import { UserTargetGroupsModule } from '../user-target-groups/user-target-groups.module'
import { UserDeviceCrudService } from '../user-device/user-device.crud'
import { UserDeviceEntity } from '../../../database/entities/user-dervice.entity'
import { UserNotificationsModule } from '../user-notifications/user-notifications.module'
import { NotificationsModule } from '../../../core/notifications/notifications.module'

@Module({
  imports: [
    ConfigModule,
    S3Module,
    UserTracksModule,
    UserTargetGroupsModule,
    TypeOrmModule.forFeature([
      StorageEntity,
      UserAdminEntity,
      UserEntity,
      GalleryVideoEntity,
      GalleryArticleEntity,
      GalleryRecipeEntity,
      ConditionsEntity,
      TriggersEntity,
      MedicationsEntity,
      TargetGroupEntity,
      TrackEntity,
      TrackGroupEntity,
      TrackGroupLineEntity,
      NotificationPredefinedEntity,
      NotificationCustomEntity,
      RaceEntity,
      GenderEntity,
      UserDeviceEntity,
    ]),
    UserNotificationsModule,
    NotificationsModule,
  ],
  controllers: [
    StorageController,
    AdminUserController,
    GalleryController,
    TrackController,
    NotificationController,
    AnalyticController,
  ],
  providers: [
    StorageEntityService,
    StorageService,
    AdminUserService,
    AdminUserCrud,
    GalleryService,
    GalleryVideoCrud,
    ConditionsCrudService,
    GalleryArticleCrud,
    GalleryRecipeCrud,
    TriggersCrudService,
    MedicationsCrudService,
    TargetGroupCrud,
    TrackAddService,
    TrackCrud,
    TrackGroupCrud,
    TrackGroupLineCrud,
    TrackService,
    TrackUpdateService,
    NotificationCustomCrud,
    NotificationPredefinedCrud,
    NotificationService,
    AnalyticService,
    AnalyticCrud,
    CsvService,
    TmpService,
    UserDeviceCrudService,
  ],
  exports: [NotificationCustomCrud, StorageEntityService],
})
export class AdminModule {}
