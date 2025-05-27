import { Module } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Milestone } from 'src/database/model/entities/milestone.entity';
import { MilestonesController } from './milestones.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Milestone])],
    providers: [MilestonesService],
    exports: [MilestonesService],
    controllers: [MilestonesController],
})
export class MilestonesModule {}
