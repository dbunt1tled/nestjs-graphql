import { Global, Module } from '@nestjs/common';
import { HttpClientService } from 'src/core/http-client/http-client.service';

@Global()
@Module({
  exports: [HttpClientService],
  providers: [HttpClientService],
})
export class HttpClientModule {}
