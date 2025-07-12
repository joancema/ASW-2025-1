import { PartialType } from '@nestjs/mapped-types';
import { CreateCiudadanoDto } from './create-ciudadano.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateCiudadanoDto extends PartialType(CreateCiudadanoDto) {
    @IsNumber()
    @IsPositive()
    id: number;
}
