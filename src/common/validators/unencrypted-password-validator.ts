import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

export type UnencryptedPassword = string;

//CHECK
//It already exist in nest validators, @MinLength, @Match
@ValidatorConstraint({ name: 'unencryptedPasswordValidator', async: true })
@Injectable()
export class UnencryptedPasswordValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(val: UnencryptedPassword, args: ValidationArguments) {
    if (!val) return false;
    return this.isValidPassword(val);
  }

  isValidPassword(passwordToValidate: string): boolean {
    if (!passwordToValidate) return false;
    // TODO: implement validation rules
    if (passwordToValidate.length < 6) return false;
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    'password should includes number, upper case, lowercase, signs';
    return `Password is not complex enough`;
  }
}
