import { Module } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { ValidationPipe } from './pipes/validation.pipe';

@Module({
  providers: [AuthGuard, ValidationPipe],
  exports: [AuthGuard, ValidationPipe],
})
export class CommonModule {} 