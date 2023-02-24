import * as bcrypt from 'bcrypt';
import { NotImplementedException } from '@nestjs/common';

import { Constants } from '../constants/constants';

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, Constants.SALT_OR_ROUNDS);

  return hashedPassword;
};

export const hashPasswordSync = (password: string): string => {
  throw new NotImplementedException();
};

export const matchHashedPassword = async (password: string, hash: string): Promise<boolean> => {
  const isPasswordValid = await bcrypt.compare(password, hash);
  return isPasswordValid;
};
