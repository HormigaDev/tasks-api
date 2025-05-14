import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions } from 'src/common/enums/Permissions.enum';
import { IdPipe } from 'src/common/pipes/id.pipe';
import { Request } from 'express';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
import { PaginationInterface } from 'src/common/interfaces/pagination.interface';
import { CreateUserDto } from 'src/common/validators/create-user.dto';
import { UpdateUserDto } from 'src/common/validators/update-user.dto';
import { UserStatusGuard } from 'src/common/guards/user-status.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, UserStatusGuard, PermissionsGuard)
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Get('/')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadUsers])
    async getUsers(@Query('pagination', PaginationPipe) pagination: PaginationInterface) {
        const users = await this.service.findAll(pagination);
        return { users };
    }

    @Get('/me')
    @HttpCode(200)
    @RequirePermissions([])
    async getInfo(@Req() req: Request) {
        const userId: number = req['user']['userId'];
        const user = await this.service.findOne(userId, true);
        delete user.password;
        return { user };
    }

    @Get('/:id')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadUsers])
    async getUserInfo(@Param('id', IdPipe) id: number) {
        const user = await this.service.findOne(id, true);
        delete user.password;
        return { user };
    }

    @Post('/')
    @HttpCode(201)
    @RequirePermissions([Permissions.CreateUsers])
    async createUser(@Body() body: CreateUserDto) {
        const user = await this.service.create(body);
        delete user.password;
        return { user };
    }

    @Patch('/')
    @HttpCode(204)
    @RequirePermissions([Permissions.UpdateUsers])
    async updateUser(@Body() body: UpdateUserDto, @Req() req: Request) {
        const userId: number = req['user']['userId'];
        await this.service.update(userId, body);
        return {};
    }

    @Delete('/:id')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteUsers])
    async deleteUser(@Param('id', IdPipe) id: number) {
        await this.service.delete(id);
        return {};
    }
}
