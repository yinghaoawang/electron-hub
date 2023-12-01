import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { TokenPayload } from 'types';

const { JWT_SECRET } = process.env;
if (JWT_SECRET == null) {
  throw new Error('JWT_SECRET environment variable is not defined.');
}

const createToken = (email: string) => {
  const expiresIn = '30d'; // Token expiration time
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn });
  return token;
};

export const verifyToken = (token: string) => {
  const payload: TokenPayload = jwt.verify(
    token,
    JWT_SECRET
  ) as JwtPayload as TokenPayload;
  return payload;
};

export const signIn = async (email: string, password: string) => {
  const dbUser = await new PrismaClient().user.findUnique({
    where: { email }
  });
  if (dbUser == null) throw new Error('User not found.');
  const isPasswordValid = await bcrypt.compare(password, dbUser.hashedPassword);
  if (!isPasswordValid) throw new Error('Password is incorrect.');
  const token = createToken(email);
  return { dbUser, token };
};

export const createUser = async (
  displayName: string,
  email: string,
  password: string
) => {
  const dbUser = await new PrismaClient().user.findUnique({
    where: { email }
  });
  if (dbUser != null) throw new Error('User already exists.');
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await new PrismaClient().user.create({
    data: { displayName, email, hashedPassword }
  });
  const token = createToken(email);
  return { dbUser: newUser, token };
};
