import fastify from 'fastify';

const server = fastify();

const { ADDRESS = 'localhost', PORT = '8080' } = process.env;

server.get('/', async (request, reply) => {
  return { message: 'Hello world!' };
});

server.get('/ping', async (request, reply) => {
  return 'pong\n';
});

server.listen({ host: ADDRESS, port: parseInt(PORT, 10) }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Fastify server started on ${address}`);
});
