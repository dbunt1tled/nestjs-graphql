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
  @Mutation(() => [File])
  async fileCreate(@Args('files') files: FileCreateInput): Promise<File[]> {
    const fileInfo = new PathInfo({ userId: files.userId });
    const uploadDir = this.fileConfig.storagePath(fileInfo);
    const uploadDirFull = path.join(
      this.fileConfig.filePath,
      this.fileConfig.storagePath(fileInfo),
    );
    try {
      await fs.promises.stat(uploadDirFull);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      await fs.promises.mkdir(uploadDirFull, { recursive: true });
    }

    return await Promise.all(
      files.files.map(async (file) => {
        const { filename, mimetype, encoding, createReadStream } = await file;
        const prefix = this.hashService.random(6);
        const fileNameSave = path.join(uploadDir, `${prefix}_${filename}`);
        const fileNameSaveFull = path.join(
          uploadDirFull,
          `${prefix}_${filename}`,
        );
        const stream = createReadStream();
        const name = await new Promise((resolve) => {
          stream
            .pipe(fs.createWriteStream(fileNameSaveFull))
            .on('finish', () => resolve(fileNameSave))
            .on('error', (err) => {
              if (err instanceof Error) {
                throw err;
              }
              throw new Error(err);
            });
        });
        return this.filesService.new({
          id: this.hashService.uuid7(),
          path: name as string,
          type: fileInfo.type,
          userId: files.userId,
        });
      }),
    );
  }
}
