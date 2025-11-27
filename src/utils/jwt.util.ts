import config from 'config'
import jwt from 'jsonwebtoken'

export default class JWTUtil {
    //private secret = `${config.get('jwt.accessTokenSecret')}`
    private  secret = process.env.JWT_SECRET || 'defaultSecret'

    async generateToken(payload: any){
        const token = jwt.sign(payload, this.secret, { expiresIn: config.get('jwt.accessTokenLife') , algorithm: 'HS512'});
        return token
    }

    //Valida el tiempo de vida del token o si el token es correcto y se decodifica
    async decodeToken(token: string) {
        const cleanToken = token!.replace(/^Bearer\s+/i, "");
        try {
            const decoded =  jwt.verify(cleanToken, this.secret, { algorithms: ['HS512'] })
            return decoded;
        } catch (error) {
            console.log("error: ", error)
            return false
        }
    }

    //Validar el tiempo de vida del token
    async tokenExp(token: string) {
        const payload64 = token.split('.')[1];
        const payload = JSON.parse(atob(payload64));
        const currentDate = Math.floor(Date.now() / 1000);
        const { exp } = payload;
        return exp > currentDate;
    }
    
}