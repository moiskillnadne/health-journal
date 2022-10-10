import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { FoodEntity } from '../../../database/entities/food.entity'
import { FoodController } from './food.controller'
import { FoodCrudService } from './food.crud'
import { FoodService } from './food.service'
import { S3Module } from '../../../integrations/s3/s3.module'
import { GalleryModule } from '../gallery/gallery.module'
import { UserVideosModule } from '../user-videos/user-videos.module'
import { UserRecipeModule } from '../user-recipes/user-recipes.module'

@Module({
  imports: [TypeOrmModule.forFeature([FoodEntity]), S3Module, GalleryModule, UserVideosModule, UserRecipeModule],
  controllers: [FoodController],
  providers: [FoodService, FoodCrudService],
  exports: [],
})
export class FoodModule {}
