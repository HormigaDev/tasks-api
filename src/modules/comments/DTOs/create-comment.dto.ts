import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
import { IsNotNaN } from 'src/common/validators/is-not-nan.dto';
import { User } from 'src/database/model/entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({
        description: 'Contenido del mensaje del comentario',
        example: 'Este es un comentario relevante sobre la tarea.',
        minLength: 1,
        maxLength: 5000,
        type: String,
    })
    @IsNotEmpty({ message: 'El contenido del mensaje es obligatorio' })
    @IsString({ message: 'El contenido del mensaje debe ser un texto válido' })
    @Length(1, 5000, { message: 'El contenido del mensaje debe tener entre 1 y 5000 caracteres' })
    readonly content: string;

    @ApiProperty({
        description: 'ID de la tarea a la que pertenece el comentario',
        example: 12,
        minimum: 1,
        type: Number,
    })
    @IsNotEmpty({ message: 'El ID de la tarea es obligatorio' })
    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: 'El ID de la tarea debe ser un número válido' })
    @IsNotNaN({ message: 'El ID de la tarea debe ser un número válido' })
    @Min(1, { message: 'El ID de la tarea debe ser mayor que 0' })
    readonly taskId: number;

    @ApiPropertyOptional({
        description: 'ID de la subtarea a la que pertenece el comentario, si aplica',
        example: 5,
        minimum: 1,
        type: Number,
    })
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: 'El ID de la subtarea debe ser un número válido' })
    @IsNotNaN({ message: 'El ID de la subtarea debe ser un número válido' })
    @Min(1, { message: 'El ID de la subtarea debe ser mayor que 0' })
    readonly subtaskId?: number;

    // No es necesario documentar esta propiedad en Swagger si es interna y opcional
    @IsOptional()
    user?: User;
}
