import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FilesService } from 'src/modules/files/files.service';
import { FileCreateInput } from 'src/modules/files/dto/file-create.input';
import { File } from 'src/modules/files/entities/file.entity';
import fs from 'node:fs';
import { FileConfig } from 'src/core/config-api/file.config';
import { PathInfo } from 'src/core/config-api/dto/path-info.dto';
import path from 'path';
import { HashService } from 'src/core/hash/hash.service';

@Resolver()
export class FilesResolver {
  constructor(
    private readonly fileConfig: FileConfig,
    private readonly hashService: HashService,
    private readonly filesService: FilesService,
  ) {}
  @Mutation(() => File)
  async fileCreate(@Args('files') files: FileCreateInput): Promise<File> {
    const fileInfo = new PathInfo({ userId: files.userId });
    const uploadDir = this.fileConfig.storagePath(fileInfo);
    try {
      await fs.promises.stat(uploadDir);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      await fs.promises.mkdir(uploadDir, { recursive: true });
    }

    const result = await Promise.all(
      files.files.map(async (file) => {
        const { filename, mimetype, encoding, createReadStream } = await file;
        const fileNameSave = path.join(
          uploadDir,
          `${this.hashService.random(4)}_${filename}`,
        );
        const stream = createReadStream();
        await new Promise((resolve, reject) => {
          stream
            .on('end', () => {
              console.log('ReadStream Ended');
            })
            .on('close', () => {
              console.log('ReadStream Closed');
            })
            .on('error', (err) => {
              console.error('ReadStream Error', err);
            })
            .pipe(fs.createWriteStream(fileNameSave))
            .on('end', () => {
              console.log('WriteStream Ended');
              resolve('end');
            })
            .on('close', () => {
              console.log('WriteStream Closed');
              resolve('close');
            })
            .on('error', (err) => {
              console.log('WriteStream Error', err);
              reject('error');
            });
        });
        return this.filesService.new({
          id: this.hashService.uuid7(),
          path: fileNameSave,
          type: fileInfo.type,
          userId: files.userId,
        });
      }),
    );
    return result[0];
  }
}
