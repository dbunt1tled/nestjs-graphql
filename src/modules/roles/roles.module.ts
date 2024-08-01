import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesResolver } from 'src/modules/roles/roles.resolver';
import { RolesRepository } from 'src/modules/roles/repository/roles.repository';
import { Role } from 'src/modules/roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesService, RolesResolver, RolesRepository],
  exports: [RolesService],
})
export class RolesModule {}
