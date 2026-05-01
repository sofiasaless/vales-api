import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { employeeService } from "../services/employee/employee.service";
import { CreateEmployeeDto } from "../services/employee/dto/createEmployee.dto";
import {
  AddEmployeeMultipleVouchersDto,
  AddEmployeeSingleVouchersDto,
} from "../services/employee/dto/addEmployeeVoucher.dto";
import { UpdateEmployeeDto } from "../services/employee/dto/updateEmployee.dto";

const employeeRouter = Router();

async function createOne(req: Request, res: Response) {
  try {
    const enterpriseId = req.user?.uid!;
    const body = req.body as CreateEmployeeDto;
    await employeeService.create(enterpriseId, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
employeeRouter.post("/criar", authMiddleware("manager"), createOne);

async function findMany(req: Request, res: Response) {
  try {
    const enterpriseId = req.user?.uid!;
    const result = await employeeService.list(enterpriseId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
employeeRouter.get("/listar", authMiddleware("manager"), findMany);

async function encontrar(req: Request, res: Response) {
  try {
    const employeeId = req.params.id as string;
    const result = await employeeService.find(employeeId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
employeeRouter.get("/encontrar/:id", authMiddleware("manager"), encontrar);

async function createOneVoucher(req: Request, res: Response) {
  try {
    const employeeId = req.params.id as string;
    const body = req.body as AddEmployeeSingleVouchersDto;
    await employeeService.addVoucher(employeeId, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
employeeRouter.put(
  "/vale/adicionar/:id",
  authMiddleware("manager"),
  createOneVoucher,
);

async function createManyVoucher(req: Request, res: Response) {
  try {
    const employeeId = req.params.id as string;
    const body = req.body as AddEmployeeMultipleVouchersDto;
    await employeeService.addMultiplesVouchers(employeeId, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
employeeRouter.put(
  "/vale/adicionar-multiplos/:id",
  authMiddleware("manager"),
  createManyVoucher,
);

async function removeOneVoucher(req: Request, res: Response) {
  try {
    const employeeId = req.params.id as string;
    const body = req.body as AddEmployeeSingleVouchersDto;
    await employeeService.removeVocuher(employeeId, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
employeeRouter.put(
  "/vale/remover/:id",
  authMiddleware("manager"),
  removeOneVoucher,
);

async function deleteOne(req: Request, res: Response) {
  try {
    const employeeId = req.params.id as string;
    await employeeService.delete(employeeId);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
employeeRouter.delete("/excluir/:id", authMiddleware("manager"), deleteOne);

async function updateOne(req: Request, res: Response) {
  try {
    const employeeId = req.params.id as string;
    const body = req.body as UpdateEmployeeDto;
    await employeeService.update(employeeId, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
employeeRouter.put("/atualizar/:id", authMiddleware("manager"), updateOne);

export default employeeRouter;
