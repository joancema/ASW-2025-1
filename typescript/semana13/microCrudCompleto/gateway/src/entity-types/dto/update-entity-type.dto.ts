import { PartialType } from '@nestjs/mapped-types';
import { CreateEntityTypeDto } from './create-entity-type.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateEntityTypeDto extends PartialType(CreateEntityTypeDto) {}
