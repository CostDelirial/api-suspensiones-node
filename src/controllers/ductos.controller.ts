import logger from '../../lib/logger'
import config from 'config'
import IResponse from '../interfaces/response.interface'
import DuctosService from '../services/ductos.service'
import IDuctos from '../interfaces/ductos.interface'
import Encription from '../utils/encryption.util'


export default class DuctosController {
    private ductosService: DuctosService
    private encription: Encription
    constructor(){
        this.ductosService = new DuctosService
        this.encription = new Encription
    }

    //////////////////////////////////////////////////////////////POST
    async createDuctos(body: IDuctos, isAdmin: any):Promise<IResponse>{
        try{
            
            // if(isAdmin.role !== 'ADMIN'){
            //     return {ok: false, message: 'You are not Administrator', response: null, code: 500}

            // }
            /**const exist = await this.ductosService.get(body.ficha)
            if(exist){
                return {ok: false, message: 'Ficha al readi exist', response: null, code: 500}
            }*/
            
            /**const {iv, encryptedData} = await this.encription.encryptPassword(body.password)
            body.salt = iv
            body.password = encryptedData*/

            const response = await this.ductosService.createDuctos(body)
            
            return {ok: true, message:'Successfull', response: response, code: 200}
        }catch(err){
            logger.error(`[DuctosController/createDuctos] ${err}`)
            return {ok: false, message: 'Error ocurred', response: err, code: 500}
        }
    }
}
