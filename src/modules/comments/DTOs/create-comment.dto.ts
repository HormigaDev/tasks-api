import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
import { IsNotNaN } from 'src/common/validators/is-not-nan.dto';
import { User } from 'src/database/model/entities/user.entity';

export class CreateCommentDto {
    @IsNotEmpty({ message: 'El contenido del mensaje es obligatorio' })
    @IsString({ message: 'El contenido del mensaje debe ser un texto válido' })
    @Length(1, 5000, { message: 'El contenido del mensaje debe tener entre 1 y 5000 caracteres' })
    readonly content: string;

    @IsNotEmpty({ message: 'El ID de la tarea es obligatorio' })
    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: 'El ID de la tarea debe ser un número válido' })
    @IsNotNaN({ message: 'El ID de la tarea debe ser un número válido' })
    @Min(1, { message: 'El ID de la tarea debe ser mayor que 0' })
    taskId: number;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: 'El ID de la subtarea debe ser un número válido' })
    @IsNotNaN({ message: 'El ID de la subtarea debe ser un número válido' })
    @Min(1, { message: 'El ID de la subtarea debe ser mayor que 0' })
    subtaskId?: number;

    @IsOptional()
    user?: User;
}
