import { EmployeeEntity, Voucher } from "../entities/employee.entity";
import { EmployeeTypes } from "../enum/employee.enum";

export const calculateVale = (item: Voucher): number => {
  return item.preco_unit * item.quantidade;
};

export const calculateTotalVouchers = (
  items: Voucher[] | undefined,
): number => {
  if (!items) return 0;
  return items.reduce((total, item) => total + calculateVale(item), 0);
};

export const calculatePaidWage = (employee: EmployeeEntity) => {
  const totalVoucher = calculateTotalVouchers(employee.vales);
  const amount = calculateBaseWage(employee) - totalVoucher;
  return amount;
};

export const calculateBaseWage = (employee: EmployeeEntity) => {
  let salary = 0;
  if (employee.tipo === EmployeeTypes.PERMANENT) {
    salary = employee.salario / 2;
  } else {
    salary = employee.salario * (employee.dias_trabalhados_semanal || 1);
  }
  return salary;
};
