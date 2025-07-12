import { IsString } from "class-validator";

export class CreateEntityTypeDto {
    @IsString()
      public name: string;
}
