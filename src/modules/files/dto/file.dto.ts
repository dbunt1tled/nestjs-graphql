import { FileType } from 'src/modules/files/enum/file-type';

export class FileDto {
  id?: string;
  path: string;
  userId?: string;
  type?: FileType;
}
