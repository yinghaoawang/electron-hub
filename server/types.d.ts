import { FastifyRequest } from 'fastify';
import { DetailedUser } from 'shared/shared-types';
import { Socket as SocketIOSocket } from 'socket.io';
import { JwtPayload } from 'jsonwebtoken';
import {
  FastifyRequest as BaseFastifyRequest,
  RawServerBase,
  RawRequestDefaultExpression,
  FastifySchema,
  FastifyTypeProvider,
  ContextConfigDefault,
  FastifyBaseLogger,
  ResolveFastifyRequestType,
  FastifyRequestType,
  FastifyInstance,
  RequestRouteOptions
} from 'fastify';

export interface Socket extends SocketIOSocket {
  user?: DetailedUser;
}
export interface AuthenticatedRequest<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  SchemaCompiler extends FastifySchema = FastifySchema,
  TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
  ContextConfig = ContextConfigDefault,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
  RequestType extends FastifyRequestType = ResolveFastifyRequestType<
    TypeProvider,
    SchemaCompiler,
    RouteGeneric
  >
> extends BaseFastifyRequest<
      RouteGenericInterface,
      RawServerDefault,
      RawRequestDefaultExpression<RawServer>,
      FastifySchema,
      FastifyTypeProviderDefault,
      ContextConfigDefault,
      FastifyBaseLogger,
      ResolveFastifyRequestType<TypeProvider, SchemaCompiler, RouteGeneric>
    >,
    FastifyRequest {
  user?: DetailedUser;
}

export interface TokenPayload extends JwtPayload {
  email: string;
  iat: number;
  exp: number;
}