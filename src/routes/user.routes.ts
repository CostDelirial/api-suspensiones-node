import { Router, Request, Response } from 'express'


const userRouter = Router()

userRouter.get('/', async(req: Request, res: Response ) => {
    try{
        return res.status(200).json({ok: true, message: 'listo'})
    }catch(err: any){
        return res.status(err.code ? err.code : 500)
    }
})

export default userRouter