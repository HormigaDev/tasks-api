import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { UserColumnOptions } from '../enums/UserColumnOptions.enum';
import { SearchOperators } from 'src/common/enums/SearchOperators.enum';

@ValidatorConstraint({ name: 'UserSearchValueValidator', async: false })
export class UserSearchValueValidator implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean {
        const obj = args.object as any;
        const key = obj.key;
        const operator = obj.operator;

        // Validación específica si el operador es Contain
        if (operator === SearchOperators.Contain) {
            return typeof value === 'string' && value.trim().length > 0;
        }

        switch (key) {
            case UserColumnOptions.Id:
                return this.isPositiveInt(value);

            case UserColumnOptions.Email:
                return this.isValidEmail(value);

            case UserColumnOptions.Status:
                return this.isPositiveInt(value) && Number(value) <= 3;

            case UserColumnOptions.Name:
                return this.isValidName(value);

            case UserColumnOptions.Created:
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
            case UserColumnOptions.Id:
                return 'El ID debe ser un número entero positivo mayor que 0';
            case UserColumnOptions.Email:
                return 'El correo electrónico debe ser una dirección válida';
            case UserColumnOptions.Status:
                return 'El estado debe ser un número entero positivo entre 1 y 3';
            case UserColumnOptions.Name:
                return 'El nombre debe ser alfanumérico y puede contener espacios, guiones y guiones bajos';
            case UserColumnOptions.Created:
                return 'La fecha de creación debe ser una cadena válida en formato ISO';
            default:
                return 'Valor inválido';
        }
    }

    private isPositiveInt(val: any): boolean {
        const n = Number(val);
        return Number.isInteger(n) && n > 0;
    }

    private isValidEmail(val: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(val);
    }

    private isValidName(val: string): boolean {
        const re = /^[\p{L}0-9 _-]+$/u; // Soporte para letras Unicode
        return typeof val === 'string' && re.test(val.trim()) && val.length > 0;
    }

    private isValidDate(val: string): boolean {
        const d = new Date(val);
        return !isNaN(d.getTime());
    }
}
