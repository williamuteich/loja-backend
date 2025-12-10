export abstract class IJwtService {
    abstract sign(payload: object, expiresIn?: string): Promise<string>;
    abstract verify(token: string): Promise<any>;
}
