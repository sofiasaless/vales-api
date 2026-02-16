import { Funcionario, Vale } from "../model/funcionario.model";

export const calcularVale = (item: Vale): number => {
  return item.preco_unit * item.quantidade;
};

export const calcularTotalDoVale = (items: Vale[] | undefined): number => {
  if (!items) return 0;
  return items.reduce((total, item) => total + calcularVale(item), 0);
};

export const calcularSalarioPago = (funcionario: Funcionario) => {
  const totalVoucher = calcularTotalDoVale(funcionario.vales);
  const amount = calcularSalarioBase(funcionario) - totalVoucher
  return amount
}

export const calcularSalarioBase = (funcionario: Funcionario) => {
  let salary = 0
  if (funcionario.tipo === 'FIXO') {
    salary = funcionario.salario / 2
  } else {
    salary = funcionario.salario * (funcionario.dias_trabalhados_semanal || 1)
  }
  return salary
}