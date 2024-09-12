import express from 'express'
import userRouter from './user.routes'
import authRouter from './auth.routes'
import ductosRouter from './ductos.routes'

const routers = express()

routers.use('/api/user',userRouter)
routers.use('/auth', authRouter)
routers.use('/api/ductos',ductosRouter)

export default routers