import { Global, Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryLog } from 'src/database/model/entities/history-logs.entity';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([HistoryLog])],
    providers: [LogsService],
    exports: [LogsService],
})
export class LogsModule {}
