import { Request, Response, Router } from "express";

const restauranteRoutes = Router()

async function listarEmpresas(req: Request, res: Response) {
  try {

    res.status(200).json({ resposta: "Listando empresas" })
  } catch (error: any) {
    console.error(error)
    res.sendStatus(400).json({ message: error.message })
  }
}

restauranteRoutes.get("/listar", listarEmpresas)

async function excluirEmpresa(req: Request, res: Response) {
  try {

    res.status(200).json({ resposta: "excluindo empresas" })
  } catch (error: any) {
    console.error(error)
    res.sendStatus(400).json({ message: error.message })
  }
}

restauranteRoutes.get("/excluir", excluirEmpresa)

export default restauranteRoutes