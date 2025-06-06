import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    async hashPassword(password: string): Promise<string> {
        const envVarSaltRounds = parseInt(process.env.SALT_ROUNDS);
        const saltRounds = !isNaN(envVarSaltRounds) ? envVarSaltRounds : 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async passwordIsEqual(password: string, passwordHash: string): Promise<boolean> {
        return await bcrypt.compare(password, passwordHash);
    }

    async generateToken(payload: any): Promise<string> {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    }

    async decodeToken(token: string): Promise<any> {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
}
