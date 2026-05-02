import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validationMiddleware } from "../middlewares/validateDtos.middleware";
import { CreateInternUserDto } from "../services/users/dto/createInternUser.dto";
import { LoginInternUserDto } from "../services/users/dto/loginInternUser.dto";
import { UpdateInternUserDto } from "../services/users/dto/updateInternUser.dto";
import { internUserService } from "../services/users/internUser.service";

const internUserRouter = Router();
internUserRouter.use(authMiddleware("manager"));

async function findMany(req: Request, res: Response) {
  try {
    const enterpriseId = req.user?.uid!;
    const result = await internUserService.listByEnterprise(enterpriseId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
internUserRouter.get("/listar", findMany);

async function autenticate(req: Request, res: Response) {
  try {
    const enterpriseId = req.user?.uid!;
    const { id, password } = req.body as LoginInternUserDto;
    const result = await internUserService.autenticate(
      enterpriseId,
      id,
      password,
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
internUserRouter.post(
  "/autenticar",
  validationMiddleware(LoginInternUserDto),
  autenticate,
);

async function findOne(req: Request, res: Response) {
  try {
    const enterpriseId = req.user?.uid!;
    const id = req.params.id as string;
    const result = await internUserService.find(enterpriseId, id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
internUserRouter.get("/encontrar/:id", findOne);

async function createOne(req: Request, res: Response) {
  try {
    const enterpriseId = req.user?.uid!;
    const body = req.body as CreateInternUserDto;
    const result = await internUserService.create(enterpriseId, body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
internUserRouter.post(
  "/criar",
  validationMiddleware(CreateInternUserDto),
  createOne,
);

async function deleteOne(req: Request, res: Response) {
  try {
    const enterpriseId = req.user?.uid!;
    const internUserId = req.params.id as string;
    await internUserService.delete(enterpriseId, internUserId);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
internUserRouter.delete("/excluir/:id", deleteOne);

async function updateOne(req: Request, res: Response) {
  try {
    const enterpriseId = req.user?.uid!;
    const internUserId = req.params.id as string;
    const payload = req.body as Partial<UpdateInternUserDto>;
    await internUserService.update(enterpriseId, internUserId, payload);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
internUserRouter.put(
  "/atualizar/:id",
  validationMiddleware(UpdateInternUserDto),
  updateOne,
);

export default internUserRouter;
