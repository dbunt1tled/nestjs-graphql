import { Injectable } from '@nestjs/common';
import { FilesFilter } from 'src/modules/Files/repository/Files.filter';
import { File } from 'src/modules/Files/entities/File.entity';
import { Paginator } from 'src/core/repository/paginator';
import { FilesRepository } from 'src/modules/files/repository/files.repository';
import { HashService } from 'src/core/hash/hash.service';
import { FileDto } from 'src/modules/files/dto/file.dto';

@Injectable()
export class FilesService {
  constructor(
    private readonly filesRepository: FilesRepository,
    private readonly hashService: HashService,
  ) {}

  async list(filter?: FilesFilter): Promise<File[] | Paginator<File>> {
    return await this.filesRepository.list(filter);
  }

  async one(filter?: FilesFilter): Promise<File | null> {
    return await this.filesRepository.one(filter);
  }

  async getById(id: string): Promise<File> {
    return await this.filesRepository.getById(id);
  }

  async new(file: FileDto, returnEntity: boolean = true): Promise<File> {
    return (await this.filesRepository.new(file, returnEntity)) as File;
  }

  async findById(id: string): Promise<File> {
    return await this.filesRepository.findById(id);
  }
}
