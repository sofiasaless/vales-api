import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { GerenteAuthPostRequestBody } from "../model/gerente.model";
import { internUserService } from "../services/users/internUser.service";
import { CreateInternUserDto } from "../services/users/dto/createInternUser.dto";
import { UpdateInternUserDto } from "../services/users/dto/updateInternUser.dto";

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
    const body = req.body as GerenteAuthPostRequestBody;
    const result = await internUserService.autenticate(
      enterpriseId,
      body.id,
      body.senha,
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
internUserRouter.post("/autenticar", autenticate);

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
internUserRouter.post("/criar", createOne);

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
internUserRouter.put("/atualizar/:id", updateOne);

export default internUserRouter;
