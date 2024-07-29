import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesResolver } from 'src/roles/roles.resolver';
import { RolesRepository } from 'src/roles/repository/roles.repository';
import { Role } from 'src/roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesService, RolesResolver, RolesRepository],
  exports: [RolesService],
})
export class RolesModule {}
