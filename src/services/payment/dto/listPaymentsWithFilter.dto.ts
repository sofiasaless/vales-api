import { IsArray, IsDateString, IsOptional } from "class-validator";

export class ListPaymentsWithFilterDto {
  @IsDateString()
  data_inicio: string;

  @IsDateString()
  data_fim: string;

  @IsArray()
  @IsOptional()
  employeeIds: string[];
}
