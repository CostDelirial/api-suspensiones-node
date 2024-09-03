import express from 'express'
import userRouter from './user.routes'

const routers = express()

routers.use('/api/user',userRouter)


export default routers