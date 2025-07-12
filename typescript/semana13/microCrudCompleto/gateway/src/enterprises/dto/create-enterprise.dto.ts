import { IsString } from "class-validator";

export class CreateEnterpriseDto {
    @IsString()
  public name: string;


  @IsString()
  public description: string;

}
