import { IsArray, IsObject } from "class-validator";
import { Voucher } from "../../../entities/employee.entity";

export class AddEmployeeMultipleVouchersDto {
  @IsArray()
  vales: Voucher[];

  // TODO: adicionar "autor/criador" do vale ao adicionar vales
}

export class AddEmployeeSingleVouchersDto {
  @IsObject()
  vale: Voucher;
}
