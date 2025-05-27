import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { MilestoneColumnOptions } from '../enums/MilestoneColumnOptions.enum';
import { SearchOperators } from 'src/common/enums/SearchOperators.enum';

@ValidatorConstraint({ name: 'MilestoneSearchValueValidator', async: false })
export class MilestoneSearchValueValidator implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean {
        const obj = args.object as any;
        const key = obj.key;
        const operator = obj.operator;

        if (operator === SearchOperators.Contain) {
            return typeof value === 'string' && value.trim().length > 0;
        }

        switch (key) {
            case MilestoneColumnOptions.Id:
                return this.isPositiveInt(value);

            case MilestoneColumnOptions.Title:
                return this.isValidTitle(value);

            case MilestoneColumnOptions.ExpectedDate:
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
            case MilestoneColumnOptions.Id:
                return 'El ID debe ser un número entero positivo mayor que 0';
            case MilestoneColumnOptions.Title:
                return 'El título debe ser una cadena de texto no vacía y válida';
            case MilestoneColumnOptions.ExpectedDate:
                return 'La fecha esperada debe ser una cadena válida en formato ISO (YYYY-MM-DD)';
            default:
                return 'Valor inválido para el filtro';
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
