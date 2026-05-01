import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { paymentService } from "../services/payment/payment.service";
import { CreatePaymentDto } from "../services/payment/dto/createPayment.dto";
import { ListPaymentsWithFilterDto } from "../services/payment/dto/listPaymentsWithFilter.dto";
import { validationMiddleware } from "../middlewares/validateDtos.middleware";

const paymentRouter = Router();
paymentRouter.use(authMiddleware("manager"));

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
paymentRouter.post(
  "/pagar/:id",
  validationMiddleware(CreatePaymentDto),
  createOne,
);

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
paymentRouter.post(
  "/listar/:id",
  validationMiddleware(ListPaymentsWithFilterDto),
  findMany,
);

export default paymentRouter;
