import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
  ) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    const car = this.carsRepository.create(createCarDto);
    return await this.carsRepository.save(car);
  }

  async findAll(): Promise<Car[]> {
    return await this.carsRepository.find();
  }

  async findOne(id: number): Promise<Car> {
    const car = await this.carsRepository.findOne({ where: { id } });
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return car;
  }

  async update(id: number, updateCarDto: UpdateCarDto): Promise<Car> {
    await this.carsRepository.update(id, updateCarDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.carsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
  }

  async findAvailable(): Promise<Car[]> {
    return await this.carsRepository.find({ where: { isAvailable: true } });
  }

  async findByBrand(brand: string): Promise<Car[]> {
    return await this.carsRepository.find({ where: { brand } });
  }
}
