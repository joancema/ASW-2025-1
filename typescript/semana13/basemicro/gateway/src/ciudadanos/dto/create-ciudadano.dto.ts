import { IsString } from "class-validator";

export class CreateCiudadanoDto {
    @IsString()
    public pasport: string;
    @IsString()
    public name: string;
    @IsString()
    public email: string;
}
