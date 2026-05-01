import { HttpStatusCode } from "axios";
import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { CreateInvoiceDto } from "../services/invoices/dto/createInvoice.dto";
import { UpdateInvoiceDto } from "../services/invoices/dto/updateInvoice.dto";
import { invoiceService } from "../services/invoices/invoice.service";

const invoiceRouter = Router();
invoiceRouter.use(authMiddleware("manager"));

async function createOne(req: Request, res: Response) {
  try {
    const enterpriseId = req.params.enterpriseId as string;
    const body = req.body as CreateInvoiceDto;
    await invoiceService.create(enterpriseId, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
invoiceRouter.post("/criar/:enterpriseId", createOne);

async function findMany(req: Request, res: Response) {
  try {
    let enterpriseId = "";
    if (req.query.enterpriseId) {
      enterpriseId = req.query.enterpriseId as string;
    } else {
      enterpriseId = req.user?.uid!;
    }
    const resultado = await invoiceService.list(enterpriseId);
    res.status(200).json(resultado);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
invoiceRouter.get("/listar", findMany);

async function updateOne(req: Request, res: Response) {
  try {
    const invoiceId = req.params.id as string;
    const body = req.body as UpdateInvoiceDto;
    await invoiceService.update(invoiceId, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
invoiceRouter.put("/atualizar/:id", updateOne);

async function confirmPayment(req: Request, res: Response) {
  try {
    const invoiceId = req.params.id as string;
    await invoiceService.confirmPayment(invoiceId);
    res.sendStatus(HttpStatusCode.Ok);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
invoiceRouter.put(
  "/confirmar-pagamento/:id",
  authMiddleware("admin"),
  confirmPayment,
);

export default invoiceRouter;
