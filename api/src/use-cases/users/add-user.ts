import bcrypt from 'bcrypt';

import { makeUser } from 'entity-validators';
import User from 'models/User';
import { formatUserProtected } from 'use-cases/lib';

export const addUser = async (data: unknown) => {
  const user = await makeUser(data);

  if ('error' in user) return user;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);

  const newUser = await new User({ ...user, password: hashedPassword }).save();

  return formatUserProtected(newUser);
};
