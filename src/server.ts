import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';

import { resolvers } from './resolvers';
import { ICrud, crud } from './crud';

export interface Context {
  crud: ICrud;
}

const apolloContext: Context = {
  crud: crud,
};

const schema = loadSchemaSync('./src/**/*.graphql', { loaders: [new GraphQLFileLoader()] });
const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

const startApolloServer = async () => {
  const app = express();
  const server = new ApolloServer({ schema: schemaWithResolvers, resolvers, context: apolloContext });
  await server.start();

  server.applyMiddleware({ app });

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    next();
  });

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });

  return { server, app };
};

(async function () {
  startApolloServer();
})();
