import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { GalleryVideosGrudService } from './cruds/gallery-video.crud'
import { GalleryController } from './gallery.controller'
import { GalleryService } from './gallery.service'
import { GalleryVideoEntity } from '../../../database/entities/gallery-video.entity'
import { GalleryArticleEntity } from '../../../database/entities/gallery-article.entity'
import { GalleryRecipeEntity } from '../../../database/entities/gallery-recipe.entity'
import { GalleryArticleCrudService } from './cruds/gallery-articles.crud'
import { GalleryRecipeCrudService } from './cruds/gallery-recipe.crud'
import { S3Module } from '../../../integrations/s3/s3.module'
import { UserArticlesModule } from '../user-articles/user-articles.module'
import { UserRecipeModule } from '../user-recipes/user-recipes.module'
import { UserVideosModule } from '../user-videos/user-videos.module'
import { StorageModule } from '../storage/storage.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([GalleryVideoEntity, GalleryArticleEntity, GalleryRecipeEntity]),
    S3Module,
    UserArticlesModule,
    UserRecipeModule,
    UserVideosModule,
    StorageModule,
  ],
  controllers: [GalleryController],
  providers: [GalleryService, GalleryVideosGrudService, GalleryArticleCrudService, GalleryRecipeCrudService],
  exports: [GalleryVideosGrudService, GalleryService, GalleryRecipeCrudService],
})
export class GalleryModule {}
