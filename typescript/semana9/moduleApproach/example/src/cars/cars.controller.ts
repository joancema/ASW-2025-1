import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Query,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { ValidationPipe } from '../common/pipes/validation.pipe';

@Controller('cars')
@UseGuards(AuthGuard)
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  @Get()
  findAll(@Query('brand') brand?: string) {
    if (brand) {
      return this.carsService.findByBrand(brand);
    }
    return this.carsService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.carsService.findAvailable();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(+id, updateCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carsService.remove(+id);
  }
}
