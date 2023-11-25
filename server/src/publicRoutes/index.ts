import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import {
  Role,
  LoginAPIResData,
  DetailedUser,
  SignupAPIResData,
  SignupAPIBody,
  LoginAPIBody
} from 'shared/shared-types';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getIdToken
} from 'firebase/auth';

const rootHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  return { message: 'Hello world!' };
};

const loginHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password } = JSON.parse(
      request.body as string
    ) as LoginAPIBody;
    console.log(email, password);
    if (email == null || password == null) {
      return reply
        .status(400)
        .send({ error: 'Email or password not provided.' });
    }
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential.user == null)
      throw new Error('Firebase user not found.');

    const token = await getIdToken(userCredential.user);

    const dbUser = await new PrismaClient().user.findUnique({
      where: { email: userCredential.user.email as string }
    });

    if (dbUser == null) throw new Error('Db user not found.');

    const user: DetailedUser = {
      id: dbUser.id,
      displayName: dbUser.displayName,
      role: dbUser.role as Role,
      email: dbUser.email
    };

    const res: LoginAPIResData = { user, token };
    reply.status(200).send(res);
  } catch (error) {
    reply.status(500).send({ error });
  }
};

const signUpHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { displayName, email, password } = JSON.parse(
      request.body as string
    ) as SignupAPIBody;
    if (displayName == null || email == null || password == null) {
      return reply.status(400).send({ error: 'Required fields not provided.' });
    }
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential.user == null)
      throw new Error('Firebase user not found after creation.');

    const dbUser = await new PrismaClient().user.create({
      data: {
        displayName,
        email
      }
    });

    if (dbUser == null) throw new Error('Db user creation failed.');

    const token = await getIdToken(userCredential.user);

    const user: DetailedUser = {
      id: dbUser.id,
      displayName: dbUser.displayName,
      role: dbUser.role as Role,
      email: dbUser.email
    };
    const res: SignupAPIResData = { user, token };
    reply.status(200).send(res);
  } catch (error) {
    reply.status(500).send({ error });
  }
};

const publicRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', rootHandler);

  fastify.post('/login', loginHandler);

  fastify.post('/signup', signUpHandler);
};

export default publicRoutes;
