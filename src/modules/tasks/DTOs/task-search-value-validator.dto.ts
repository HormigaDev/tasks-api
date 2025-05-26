import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { TaskColumnOptions } from '../enums/TaskColumnOptions.enum';
import { SearchOperators } from 'src/common/enums/SearchOperators.enum';

@ValidatorConstraint({ name: 'TaskSearchValueValidator', async: false })
export class TaskSearchValueValidator implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean {
        const obj = args.object as any;
        const key = obj.key;
        const operator = obj.operator;

        if (operator === SearchOperators.Contain) {
            return typeof value === 'string' && value.trim().length > 0;
        }

        switch (key) {
            case TaskColumnOptions.Id:
                return this.isPositiveInt(value);

            case TaskColumnOptions.Title:
                return this.isValidTitle(value);

            case TaskColumnOptions.CreatedAt:
            case TaskColumnOptions.UpdatedAt:
                return this.isValidDate(value);

            default:
                return false;
        }
    }

    defaultMessage(args: ValidationArguments): string {
        const obj = args.object as any;
        const key = obj.key;
        const operator = obj.operator;

        if (operator === SearchOperators.Contain) {
            return 'El operador "CONTIENE" solo permite valores de tipo texto no vacío';
        }

        switch (key) {
            case TaskColumnOptions.Id:
                return 'El ID debe ser un número entero positivo mayor que 0';
            case TaskColumnOptions.Title:
                return 'El título debe ser una cadena de texto no vacía y válida';
            case TaskColumnOptions.CreatedAt:
            case TaskColumnOptions.UpdatedAt:
                return 'La fecha debe ser una cadena válida en formato ISO';
            default:
                return 'Valor inválido';
        }
    }

    private isPositiveInt(val: any): boolean {
        const n = Number(val);
        return Number.isInteger(n) && n > 0;
    }

    private isValidTitle(val: string): boolean {
        return typeof val === 'string' && val.trim().length > 0;
    }

    private isValidDate(val: string): boolean {
        const d = new Date(val);
        return !isNaN(d.getTime());
    }
}
