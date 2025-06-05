import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
import { IsNotNaN } from 'src/common/validators/is-not-nan.dto';
import { User } from 'src/database/model/entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EditCommentDto {
    @ApiProperty({
        description: 'ID del comentario a editar',
        example: 15,
        minimum: 1,
        type: Number,
    })
    @IsNotEmpty({ message: 'El ID del comentario es obligatorio' })
    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: 'El ID del comentario debe ser un número válido' })
    @IsNotNaN({ message: 'El ID del comentario debe ser un número válido' })
    @Min(1, { message: 'El ID del comentario debe ser mayor que 0' })
    readonly id: number;

    @ApiProperty({
        description: 'Contenido actualizado del comentario',
        example: 'Este es el nuevo contenido del comentario editado.',
        minLength: 1,
        maxLength: 5000,
        type: String,
    })
    @IsNotEmpty({ message: 'El contenido del mensaje es obligatorio' })
    @IsString({ message: 'El contenido del mensaje debe ser un texto válido' })
    @Length(1, 5000, { message: 'El contenido del mensaje debe tener entre 1 y 5000 caracteres' })
    readonly content: string;

    // Esta propiedad es opcional y probablemente interna, no se documenta en Swagger
    @IsOptional()
    user?: User;
}
