import { Global, Module } from '@nestjs/common';
import { FileConfig } from 'src/core/config-api/file.config';

@Global()
@Module({
  providers: [FileConfig],
  exports: [FileConfig],
})
export class ConfigApiModule {}
