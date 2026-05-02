import { IsOptional, IsUrl } from "class-validator";

export class UpdateInvoiceDto {
  @IsOptional()
  @IsUrl()
  comprovante: string;
}
