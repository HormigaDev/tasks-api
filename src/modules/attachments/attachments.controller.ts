import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotImplementedException,
    Param,
    Post,
    Query,
    Res,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { UserStatusGuard } from 'src/common/guards/user-status.guard';
import { AttachmentsService } from './attachments.service';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import { Permissions } from 'src/common/enums/Permissions.enum';
import { IdPipe } from 'src/common/pipes/id.pipe';
import { Sizes } from 'src/common/Sizes';
import { Response } from 'express';
import { validate as isUuid } from 'uuid';

@Controller('attachments')
@UseGuards(JwtAuthGuard, UserStatusGuard, PermissionsGuard)
export class AttachmentsController {
    constructor(private readonly service: AttachmentsService) {}

    @Get('/download/:uuid')
    @HttpCode(200)
    @RequirePermissions([Permissions.ReadAttachments])
    async getFile(@Param('uuid') uuid: string, @Res() res: Response) {
        if (!isUuid(uuid)) {
            throw new BadRequestException('Id del archivo inválido');
        }

        const attachment = await this.service.read(uuid);
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${attachment.name}${attachment.type}"`,
        });

        return res.send(attachment.getBuffer());
    }

    @Post('upload')
    @HttpCode(201)
    @UseInterceptors(
        FileInterceptor('file', {
            limits: { fileSize: Sizes.megabytes(2) },
        }),
    )
    @RequirePermissions([Permissions.CreateAttachments, Permissions.UpdateAttachments], true)
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No hay archivo para guardar');
        }
        const attachment = await this.service.save(file);
        return { attachment };
    }

    @Post('upload-multiple')
    @HttpCode(201)
    @UseInterceptors(
        FileInterceptor('files', {
            limits: { fileSize: Sizes.megabytes(2) },
        }),
    )
    @RequirePermissions([Permissions.CreateAttachments, Permissions.UpdateAttachments], true)
    async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
        if (!Array.isArray(files)) {
            throw new BadRequestException('No fue informado el array de archivos');
        }
        files = files.filter((f) => !!f);
        if (files.length === 0) {
            throw new BadRequestException('No hay archivo para guardar');
        }
        const [attachments, errors] = await this.service.saveMultiple(files);
        if (attachments.length === 0) {
            throw new BadRequestException('Archivos inválidos');
        }
        const response: Record<string, any> = { attachments };
        if (errors.length > 0) {
            response.error = {
                message: 'Algunos archivos no se guardaron correctamente',
                files: errors,
            };
        }

        return response;
    }

    @Delete(':id')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteAttachments])
    async deleteFile(@Param('id', IdPipe) id: number) {
        await this.service.delete(id);
        return {};
    }

    @Delete('/')
    @HttpCode(204)
    @RequirePermissions([Permissions.DeleteAttachments])
    async deleteMultipleFiles(@Query('ids') idList: string) {
        throw new NotImplementedException('Futuramente...');
    }
}
