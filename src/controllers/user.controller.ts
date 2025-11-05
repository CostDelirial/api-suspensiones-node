import logger from '../../lib/logger'
import config from 'config'
import IResponse from '../interfaces/response.interface'
import UserService from '../services/user.service'
import IUser from '../interfaces/user.interface'
import Encription from '../utils/encryption.util'


export default class UserController {
    private userService: UserService
    private encription: Encription
    constructor() {
        this.userService = new UserService
        this.encription = new Encription
    }
    async createUser(body: IUser): Promise<IResponse> {
        try {
            const exist = await this.userService.getUserByFicha(body.ficha)
            if (exist) {
                return { ok: false, message: 'Ficha al readi exist', response: null, code: 500 }
            }


            const hashedPassword = await this.encription.hashPassword(body.password)
            body.password = hashedPassword

            const response = await this.userService.createUser(body)

            return { ok: true, message: 'Successfull', response: response, code: 200 }
        } catch (err) {
            logger.error(`[UserController/createUser] ${err}`)
            return { ok: false, message: 'Error ocurred', response: err, code: 500 }
        }
    }

}
