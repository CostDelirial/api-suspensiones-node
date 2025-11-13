import express from 'express'
import userRouter from './user.routes'
import authRouter from './auth.routes'
import catGerenciaRouter from './catGerencia.router'
import catSubgerenciaRouter from './catSubgerencia.router'
import catSuperintendenciaRouter from './catSuperintendencia.router'
import catPuestoRouter from './catPuesto.router'
import catRoleRouter from './catRole.router'
import catSemaforoRouter from './catSemaforo.router'
import catDuctoRouter from './catDucto.router'
import catMotivoRouter from './catMotivo.router'
import tableroRouter from './tablero.router'

const routers = express()

routers.use('/api/user',userRouter)
routers.use('/auth', authRouter)
routers.use('/tablero', tableroRouter)

// catalogos
routers.use('/catGerencia', catGerenciaRouter)
routers.use('/catSubgerencia', catSubgerenciaRouter)
routers.use('/catSuperintendencia', catSuperintendenciaRouter)
routers.use('/catPuesto', catPuestoRouter)
routers.use('/catRole', catRoleRouter)
routers.use('/catSemaforo', catSemaforoRouter)
routers.use('/catDucto', catDuctoRouter)
routers.use('/catMotivo', catMotivoRouter)

export default routers