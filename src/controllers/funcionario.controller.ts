import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { employeeService } from "../services/employee/employee.service";
import { CreateEmployeeDto } from "../services/employee/dto/createEmployee.dto";
import {
  AddEmployeeMultipleVouchersDto,
  AddEmployeeSingleVouchersDto,
} from "../services/employee/dto/addEmployeeVoucher.dto";
import { UpdateEmployeeDto } from "../services/employee/dto/updateEmployee.dto";

const funcionarioRouter = Router();

async function criar(req: Request, res: Response) {
  try {
    const empresaId = req.user?.uid!;
    const body = req.body as CreateEmployeeDto;
    await employeeService.create(empresaId, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
funcionarioRouter.post("/criar", authMiddleware("manager"), criar);

async function listar(req: Request, res: Response) {
  try {
    const empresaId = req.user?.uid!;
    const resultado = await employeeService.list(empresaId);
    res.status(200).json(resultado);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
funcionarioRouter.get("/listar", authMiddleware("manager"), listar);

async function encontrar(req: Request, res: Response) {
  try {
    const idFuncionario = req.params.id as string;
    const resultado = await employeeService.find(idFuncionario);
    res.status(200).json(resultado);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
funcionarioRouter.get("/encontrar/:id", authMiddleware("manager"), encontrar);

async function adicionarVale(req: Request, res: Response) {
  try {
    const idFuncionario = req.params.id as string;
    const body = req.body as AddEmployeeSingleVouchersDto;
    await employeeService.addVoucher(idFuncionario, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
funcionarioRouter.put(
  "/vale/adicionar/:id",
  authMiddleware("manager"),
  adicionarVale,
);

async function adicionarMultiplosVales(req: Request, res: Response) {
  try {
    const idFuncionario = req.params.id as string;
    const body = req.body as AddEmployeeMultipleVouchersDto;
    await employeeService.addMultiplesVouchers(idFuncionario, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
funcionarioRouter.put(
  "/vale/adicionar-multiplos/:id",
  authMiddleware("manager"),
  adicionarMultiplosVales,
);

async function removerVale(req: Request, res: Response) {
  try {
    const idFuncionario = req.params.id as string;
    const body = req.body as AddEmployeeSingleVouchersDto;
    await employeeService.removeVocuher(idFuncionario, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
funcionarioRouter.put(
  "/vale/remover/:id",
  authMiddleware("manager"),
  removerVale,
);

async function excluir(req: Request, res: Response) {
  try {
    const idFuncionario = req.params.id as string;
    await employeeService.delete(idFuncionario);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
funcionarioRouter.delete("/excluir/:id", authMiddleware("manager"), excluir);

async function atualizar(req: Request, res: Response) {
  try {
    const idFuncionario = req.params.id as string;
    const body = req.body as UpdateEmployeeDto;
    await employeeService.update(idFuncionario, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
funcionarioRouter.put("/atualizar/:id", authMiddleware("manager"), atualizar);

export default funcionarioRouter;
