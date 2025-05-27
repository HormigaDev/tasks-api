import { Module } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Milestone } from 'src/database/model/entities/milestone.entity';
import { MilestonesController } from './milestones.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Milestone])],
    controllers: [MilestonesController],
    providers: [MilestonesService],
    exports: [MilestonesService],
})
export class MilestonesModule {}
