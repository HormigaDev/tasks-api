import { Global, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/database/model/entities/role.entity';
import { RolesController } from './roles.controller';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    providers: [RolesService],
    exports: [RolesService],
    controllers: [RolesController],
})
export class RolesModule {}
