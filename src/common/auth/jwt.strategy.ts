import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { Request } from 'express';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        const strategyType = process.env.JWT_STRATEGY || 'bearer'; // 'bearer' o 'cookie'

        let jwtFromRequest: (req: Request) => string | null;

        if (strategyType === 'cookie') {
            jwtFromRequest = (req: Request): string | null => req.cookies['auth_token'] || null;
        } else {
            jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        }

        super({
            jwtFromRequest,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        return { userId: payload.userId };
    }
}
