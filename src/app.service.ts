import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getApiInfo() {
        return { status: 'active', version: '1.0.0', name: 'Oh My TASK API' };
    }
}
