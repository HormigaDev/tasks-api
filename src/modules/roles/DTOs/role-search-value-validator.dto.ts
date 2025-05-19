import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { RolesColumnOptions } from '../enums/RolesColumnOptions.enum';
import { SearchOperators } from 'src/common/enums/SearchOperators.enum';

@ValidatorConstraint({ name: 'RolesSearchValueValidator', async: false })
export class RolesSearchValueValidator implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean {
        const obj = args.object as any;
        const key = obj.key;
        const operator = obj.operator;

        if (operator === SearchOperators.Contain) {
            return typeof value === 'string' && value.trim().length > 0;
        }

        switch (key) {
            case RolesColumnOptions.Id:
                return this.isPositiveInt(value);

            case RolesColumnOptions.Name:
                return this.isValidName(value);

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
            case RolesColumnOptions.Id:
                return 'El ID debe ser un número entero positivo mayor que 0';
            case RolesColumnOptions.Name:
                return 'El nombre debe ser alfanumérico y puede contener espacios, guiones y guiones bajos';
            default:
                return 'Valor inválido';
        }
    }

    private isPositiveInt(val: any): boolean {
        const n = Number(val);
        return Number.isInteger(n) && n > 0;
    }

    private isValidName(val: string): boolean {
        const re = /^[\p{L}0-9 _-]+$/u;
        return typeof val === 'string' && re.test(val.trim()) && val.length > 0;
    }
}
