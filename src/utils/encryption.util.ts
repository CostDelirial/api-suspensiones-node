import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import  IUser  from '../interfaces/user.interface'



export default class EncryptioClass {

    private  secret = process.env.JWT_SECRET || 'defaultSecret'
    //private secret = 'a-string-secret-at-least-256-bits-long'


    generateToken(user: any){
        console.log("1.- SECRET: "+this.secret)
        return jwt.sign({ user }, this.secret, { expiresIn: '1h', algorithm: "HS512"})
    }

    verifyToken(token: string):any{
        try{
            return jwt.verify(token, String(this.secret))
        }catch(error){
            throw new Error('this token is not valid')
        }
    }

    async hashPassword(password: string):Promise<string>{
            const saltRounds = 10
            const salt = await bcrypt.genSalt(saltRounds)
            return bcrypt.hash(password,salt)
    }

    async verifyPassword(plainPassword: string, hashPassword: string):Promise<boolean>{
        console.log(plainPassword + " vs " + hashPassword)
        return bcrypt.compare(plainPassword,hashPassword)
    }

}