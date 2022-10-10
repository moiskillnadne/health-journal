import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { S3Module } from '../../../integrations/s3/s3.module'

import { UserArticlesEntity } from '../../../database/entities/user-articles.entity'

import { UserArticlesCrudService } from './user-articles.crud'
import { UserArticlesService } from './user-articles.service'
import { UserArticlesController } from './user-articles.controller'

@Module({
  imports: [TypeOrmModule.forFeature([UserArticlesEntity]), S3Module],
  controllers: [UserArticlesController],
  providers: [UserArticlesCrudService, UserArticlesService],
  exports: [UserArticlesCrudService, UserArticlesService],
})
export class UserArticlesModule {}
