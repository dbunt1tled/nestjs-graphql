import { Storage } from 'src/core/config-api/enums/storage.enum';
import path from 'path';
import { FileType } from 'src/modules/files/enum/file-type';

export class PathInfo {
  constructor(private readonly data: { userId?: string }) {}

  get path() {
    if (this.data.userId) {
      return path.join(Storage.USER, this.data.userId);
    }
    return `${Storage.OTHER}`;
  }

  get type() {
    if (this.data.userId) {
      return FileType.USER;
    }
    return FileType.OTHER;
  }
}
