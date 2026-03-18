import { Module, Global } from '@nestjs/common';
import { SerproAdapter } from './serpro.adapter';

@Global()
@Module({
  providers: [SerproAdapter],
  exports: [SerproAdapter],
})
export class SerproModule {}
