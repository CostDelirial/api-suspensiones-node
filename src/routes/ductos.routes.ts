import { Router, Request, Response } from 'express'
import DuctosController from '../controllers/ductos.controller';
import Authenticate from '../middlewares/authenticate.middleware';

const ductosRouter = Router()
const ductosController = new DuctosController()
const checkToken = new Authenticate()

ductosRouter.post('/', async(req: Request, res: Response ) => {
    try{
        const isAdmin= true //req.body.user_client
        const body = req.body
        const response = await ductosController.createDuctos(body,isAdmin)
        return res.status(response.code).json(response)
    }catch(err: any){
        return res.status(err.code ? err.code : 500)
    }
})
export default ductosRouter