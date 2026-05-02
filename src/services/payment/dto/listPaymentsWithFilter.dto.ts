import { IsDateString } from "class-validator";

export class ListPaymentsWithFilterDto {
  @IsDateString()
  data_inicio: string;

  @IsDateString()
  data_fim: string;
}
