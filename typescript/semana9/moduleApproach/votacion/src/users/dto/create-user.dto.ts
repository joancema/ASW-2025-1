import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNumber()
    @IsOptional()
    id: number;

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    name: string;

    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsNumber()
    age:number;

    @IsOptional()
    status: boolean;
}
