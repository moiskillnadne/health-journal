import { HttpStatus, Injectable } from '@nestjs/common'
import { Environment } from '../../constants/config.constants'
import { ConfigService } from '@nestjs/config'
import { join as join_path } from 'path'
import { v4 as uuid } from 'uuid'
import * as fse from 'fs-extra'
import { InternalServerError } from '../errors/internal-server.error'
import { DictionaryErrorMessages } from '../../constants/responses/messages.error.constants'
import { ErrorCodes } from '../../constants/responses/codes.error.constants'

@Injectable()
export class TmpService {
  protected tmpdir: string = this.configService.get(Environment.TmpDirPath)

  constructor(protected configService: ConfigService) {}

  public async makeTmpSubFolder(rootFolder = this.tmpdir, subFolderName: string = uuid()): Promise<string> {
    const tmpDirPath = this.join_path(rootFolder, subFolderName)
    await fse.ensureDir(tmpDirPath)
    return tmpDirPath
  }

  public join_path(...args: string[]): string {
    return join_path(...args)
  }

  public async remove(filePath: string | string[]): Promise<void> {
    const filePaths: string[] = Array.isArray(filePath) ? filePath : [filePath]

    type FsPromiseResultType = { success: boolean; path: string; error?: Error }
    const fsPromises: Array<Promise<FsPromiseResultType>> = filePaths.map(async (path) => {
      try {
        if (await fse.pathExists(path)) {
          await fse.remove(path)
          return { success: true, path }
        }
      } catch (e) {
        return { success: false, path, error: e }
      }
      return { success: false, path }
    })

    const promisesResults = await Promise.allSettled<Promise<FsPromiseResultType>[]>(fsPromises)
    const failedResults = promisesResults
      .filter((result): boolean => result.status === 'fulfilled' && !result.value?.success)
      .map((result: PromiseFulfilledResult<FsPromiseResultType>) => result.value)

    if (failedResults.length) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.FilesystemInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          promisesResults: promisesResults,
          failedUnlinkedFilesPaths: failedResults.map((result) => result.path),
        },
      )
    }
  }
}
