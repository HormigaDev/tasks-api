import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNotNaN(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isNotNaN',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                    return typeof Number(value) === 'number' && !isNaN(value);
                },
                defaultMessage(_args: ValidationArguments) {
                    return `${propertyName} no puede ser NaN`;
                },
            },
        });
    };
}
