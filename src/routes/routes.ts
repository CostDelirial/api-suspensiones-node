import express from 'express'
import userRouter from './user.routes'
import authRouter from './auth.routes'
import catGerenciaRouter from './catGerencia.router'
import catSubgerenciaRouter from './catSubgerencia.router'
import catSuperintendenciaRouter from './catSuperintendencia.router'
import catPuestoRouter from './catPuesto.router'

const routers = express()

routers.use('/api/user',userRouter)
routers.use('/auth', authRouter)

// catalogos
routers.use('/catGerencia', catGerenciaRouter)
routers.use('/catSubgerencia', catSubgerenciaRouter)
routers.use('/catSuperintendencia', catSuperintendenciaRouter)
routers.use('/catPuesto', catPuestoRouter)

export default routers