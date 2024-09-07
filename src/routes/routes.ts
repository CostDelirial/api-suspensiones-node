import express from 'express'
import userRouter from './user.routes'
import authRouter from './auth.routes'

const routers = express()

routers.use('/api/user',userRouter)
routers.use('/auth', authRouter)


export default routers