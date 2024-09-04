export default interface IUser{
    name: string
    ficha: number
    password: string
    status: string
    role: string
    salt?: string
}