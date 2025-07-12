import { IsString } from "class-validator";

export class CreateEntityDto {
    @IsString()
    public name: string;
    @IsString()
    public address: string;
    @IsString()
    public phone: string;
    @IsString()
    public email: string;
}
