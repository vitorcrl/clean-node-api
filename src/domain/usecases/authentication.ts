export interface IAuthenticationModel {
    email: string
    password: string
}
export interface Authentication {
    auth(authentication: IAuthenticationModel): Promise<string>
}
