import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFound } from 'src/core/exception/not-found';
import { Paginator } from 'src/core/repository/paginator';
import { RepositoryBase } from 'src/core/repository/repository.base';
import { Role } from 'src/modules/roles/entities/role.entity';
import { RoleCreateInput } from 'src/modules/roles/dto/role-create.input';
import { RolesFilter } from 'src/modules/roles/repository/roles.filter';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { Roles } from 'src/modules/roles/enum/roles';
import { File } from 'src/modules/files/entities/file.entity';
import { FilesFilter } from 'src/modules/files/repository/files.filter';
import { FileCreateInput } from 'src/modules/files/dto/file-create.input';
import { FileDto } from 'src/modules/files/dto/file.dto';
import { FileType } from 'src/modules/files/enum/file-type';
import { uuid7 } from 'src/core/utils';

@Injectable()
export class FilesRepository extends RepositoryBase<File> {
  constructor(
    @InjectRepository(File)
    repository: Repository<File>,
  ) {
    super(repository);
  }

  async findById(id: string): Promise<File> {
    return this.repository.findOne({ where: { id: id } });
  }

  async getById(id: string): Promise<File> {
    const file = await this.findById(id);
    if (!file) {
      throw new NotFound(100007, `File not found`);
    }
    return file;
  }

  async new(
    file: FileDto,
    returnEntity: boolean = true,
  ): Promise<Promise<File> | Promise<null>> {
    const id = file.id || uuid7();
    //TODO: DENIS need debug var to use below
    const $result = await this.repository.insert(
      this.repository.create({
        id: id,
        path: file.path,
        userId: file.userId,
        type: file.type || FileType.OTHER,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
    if (returnEntity) {
      return this.getById(id);
    }
  }

  async one(filter?: FilesFilter): Promise<File | null> {
    return this.resultOne(filter);
  }

  async list(filter?: FilesFilter): Promise<File[] | Paginator<File>> {
    return await this.resultList(filter);
  }

  async removeByUserId(userId: string): Promise<DeleteResult> {
    const builder = this.repository
      .createQueryBuilder()
      .restore()
      .where('userId = :userId', { userId: userId });

    return await builder.delete().execute();
  }
}
