import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PathInfo } from 'src/core/config-api/dto/path-info.dto';

@Injectable()
export class FileConfig {
  constructor(private configService: ConfigService) {}

  get filePath(): string {
    return this.configService.getOrThrow('FILE_STORAGE_PATH');
  }

  public storagePath(info: PathInfo): string {
    return info.path;
  }
}
