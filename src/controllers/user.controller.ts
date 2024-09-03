import logger from '../../lib/logger'
import config from 'config'
import IResponse from '../interfaces/response.interface'
import UserService from '../services/user.service'
import IUser from '../interfaces/user.interface'


export default class UserController {
    private userService: UserService

    constructor(){
        this.userService = new UserService
    }
async createUser(body: IUser):Promise<IResponse>{
    try{
        const response = await this.userService.createUser(body)
        
        return {ok: true, message:'Successfull', response: response, code: 200}
    }catch(err){
        logger.error(`[UserController/createUser] ${err}`)
        return {ok: false, message: 'Error ocurred', response: err, code: 500}
    }
}

}
