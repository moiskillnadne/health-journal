import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { S3Module } from '../../../integrations/s3/s3.module'

import { UserRecipesEntity } from '../../../database/entities/user-recipes.entity'

import { UserRecipesCrudService } from './user-recipes.crud'
import { UserRecipesService } from './user-recipes.service'
import { UserRecipesController } from './user-recipes.controller'

@Module({
  imports: [TypeOrmModule.forFeature([UserRecipesEntity]), S3Module],
  controllers: [UserRecipesController],
  providers: [UserRecipesCrudService, UserRecipesService],
  exports: [UserRecipesCrudService, UserRecipesService],
})
export class UserRecipeModule {}
