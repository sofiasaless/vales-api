import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { paymentService } from "../services/payment/payment.service";
import { CreatePaymentDto } from "../services/payment/dto/createPayment.dto";
import { ListPaymentsWithFilterDto } from "../services/payment/dto/listPaymentsWithFilter.dto";

const paymentRouter = Router();

async function createOne(req: Request, res: Response) {
  try {
    const enterpriseId = req.user?.uid!;
    const employeeId = req.params.id as string;
    const body = req.body as CreatePaymentDto;
    await paymentService.create(enterpriseId, employeeId, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
paymentRouter.post("/pagar/:id", authMiddleware("manager"), createOne);

async function findMany(req: Request, res: Response) {
  try {
    const employeeId = req.params.id as string;
    const body = req.body as ListPaymentsWithFilterDto;
    const result = await paymentService.listWithFilter(employeeId, body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
paymentRouter.post("/listar/:id", authMiddleware("manager"), findMany);

export default paymentRouter;
