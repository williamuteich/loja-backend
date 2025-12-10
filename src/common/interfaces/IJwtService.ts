import { JwtPayload } from './jwt-payload.interface';

export abstract class IJwtService {
    abstract sign(payload: JwtPayload, expiresIn?: string): Promise<string>;
    abstract verify(token: string): Promise<JwtPayload>;
}
