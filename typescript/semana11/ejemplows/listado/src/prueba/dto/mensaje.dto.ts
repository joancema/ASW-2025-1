import { IsString, MinLength } from "class-validator";

export class mensajeDto {
    @IsString()
    @MinLength(1)
    message: string;
}