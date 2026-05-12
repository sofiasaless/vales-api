import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from "class-validator";

export class AddEmployeeIncentiveBonusDto {
  @IsNumber()
  @IsPositive()
  valor: number;

  @IsOptional()
  @IsString()
  incentivo_ref?: string;

  @IsOptional()
  @IsString()
  descricao?: string;
}

export class RemoveEmployeeIncentiveBonusDto extends AddEmployeeIncentiveBonusDto {
  @IsUUID()
  id: string;
}
