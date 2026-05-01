import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { COLLECTIONS } from "../../enum/collections.enum";
import { Funcionario } from "../../model/funcionario.model";
import { docToObject, idToDocumentRef } from "../../util/firebase.util";
import { PatternService } from "../common/pattern.service";
import { db } from "../../config/firebase";
import { CreateEmployeeDto } from "./dto/createEmployee.dto";
import { EmployeeEntity, Voucher } from "../../entities/employee.entity";
import {
  AddEmployeeMultipleVouchersDto,
  AddEmployeeSingleVouchersDto,
} from "./dto/addEmployeeVoucher.dto";
import { UpdateEmployeeDto } from "./dto/updateEmployee.dto";
import { paymentService } from "../payment/payment.service";

class EmployeeService extends PatternService {
  constructor() {
    super(COLLECTIONS.FUNCIONARIOS);
  }

  public async create(enterpriseId: string, employeeBody: CreateEmployeeDto) {
    const toSave: EmployeeEntity = {
      ...employeeBody,
      vales: [],
      incentivo: [],
      restaurante_ref: idToDocumentRef(enterpriseId, COLLECTIONS.RESTAURANTES),
      data_admissao: new Date(employeeBody.data_admissao),
      data_nascimento: employeeBody.data_nascimento
        ? new Date(employeeBody.data_nascimento)
        : null,
      data_cadastro: new Date(),
    };

    await this.setup().add(toSave);
  }

  public async list(enterpriseId: string) {
    const snapShot = await this.setup()
      .where(
        "restaurante_ref",
        "==",
        idToDocumentRef(enterpriseId, COLLECTIONS.RESTAURANTES),
      )
      .orderBy("nome", "asc")
      .get();

    const employees = snapShot.docs.map((doc) => {
      return docToObject<Funcionario>(doc.id, doc.data()!);
    });

    return employees;
  }

  public async find(employeeId: string) {
    const employee = await this.setup().doc(employeeId).get();
    if (!employee.exists)
      throw new Error(`Funcionário de ID ${employeeId} não encontrado`);

    return docToObject<EmployeeEntity>(employee.id, employee.data()!);
  }

  // TODO: os três funções abaixo são muito importantes e devem estar em um serviço único, pois compartilham de uma responsabilidade similar
  public async addVoucher(
    employeeId: string,
    body: AddEmployeeSingleVouchersDto,
  ) {
    const voucherToSave: Voucher = {
      ...body.vale,
      data_adicao: new Date(),
      produto_ref: body.vale.produto_ref
        ? idToDocumentRef(body.vale.produto_ref as string, COLLECTIONS.MENU)
        : null,
    };

    await this.setup()
      .doc(employeeId)
      .update({
        vales: FieldValue.arrayUnion(voucherToSave),
      });
  }

  public async addMultiplesVouchers(
    employeeId: string,
    body: AddEmployeeMultipleVouchersDto,
  ) {
    const vouchersToSend: Voucher[] = body.vales.map((v) => {
      return {
        ...v,
        data_adicao: new Date(),
        produto_ref: v.produto_ref
          ? idToDocumentRef(v.produto_ref as string, COLLECTIONS.MENU)
          : null,
      };
    });

    await this.setup()
      .doc(employeeId)
      .update({
        vales: FieldValue.arrayUnion(...vouchersToSend),
      });
  }

  public async removeVocuher(
    employeeId: string,
    body: AddEmployeeSingleVouchersDto,
  ) {
    let voucherToRemove = {
      ...body.vale,
      produto_ref: body.vale.produto_ref
        ? idToDocumentRef(body.vale.produto_ref as string, COLLECTIONS.MENU)
        : null,
      data_adicao: Timestamp.fromDate(new Date(body.vale.data_adicao)),
    };

    await this.setup()
      .doc(employeeId)
      .update({
        vales: FieldValue.arrayRemove(voucherToRemove),
      });
  }

  public async update(employeeId: string, body: UpdateEmployeeDto) {
    await this.setup()
      .doc(employeeId)
      .update({
        ...body,
        data_admissao: new Date(body.data_admissao),
        data_nascimento: body.data_nascimento
          ? new Date(body.data_nascimento)
          : null,
      });
  }

  public async delete(employeeId: string) {
    await db.runTransaction(async (transaction) => {
      transaction.delete(this.setup().doc(employeeId));

      const payments = await paymentService.list(employeeId);
      payments.map((p) => {
        transaction.delete(
          idToDocumentRef(p.id as string, COLLECTIONS.PAGAMENTOS),
        );
      });
    });
  }
}

export const employeeService = new EmployeeService();
