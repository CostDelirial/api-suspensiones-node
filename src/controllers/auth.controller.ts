import logger from '../../lib/logger'
import UserService from '../services/user.service'
import Encription from '../utils/encryption.util';
import JWTUtil from '../utils/jwt.util';
export default class AuthControll{
    private userService: UserService
    private encryption: Encription
    private jwtUtil: JWTUtil
    constructor(){
        this.userService = new UserService()
        this.encryption = new Encription()
        this.jwtUtil = new JWTUtil()
    }
    async Login(ficha: number, password: string){
        try{
            
            const user = await this.userService.getUser(ficha)
            if(!user){
                return {ok: false, message: 'Ficha or Password incorrect', response: null, code: 400}
            }
            if(user.status !== "ACTIVE"){
                return {ok: false, message: 'you are INACTIVE', response: null, code: 301}
            }
            const truePassword = await this.encryption.decryptPassword(user, password)
            if(!truePassword){
                return ({ ok: false, message: " password incorrect", response: null, code: 400 });

            }

            const frontUser = {
                name: user.name,
                ficha: user.ficha,
                role: user.role,
                status: user.status
            }

            const genToken = await this.jwtUtil.generateToken(frontUser)

            return {ok: true, message: 'Successfull', response: frontUser, code: 200, token:  genToken }
        }catch(err){
            logger.error(`[AuthControll/login] ${err}`)
            return {ok: false, message: 'Error ocurred',response: err, code: 500}
        }
    }
}