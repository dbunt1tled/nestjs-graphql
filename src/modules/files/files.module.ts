import { Global, Module } from '@nestjs/common';
import { FilesResolver } from './files.resolver';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from 'src/modules/files/entities/file.entity';
import { FilesRepository } from 'src/modules/files/repository/files.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [FilesResolver, FilesService, FilesRepository],
  exports: [FilesService],
})
export class FilesModule {}
