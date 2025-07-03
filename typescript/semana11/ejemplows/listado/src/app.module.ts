import { Module } from '@nestjs/common';
import { PruebaModule } from './prueba/prueba.module';

@Module({
  imports: [PruebaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
