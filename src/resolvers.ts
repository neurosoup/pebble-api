import { queryResolvers as epicsQueryResolvers, mutationResolvers as epicsMutationResolvers } from './epics/resolvers';

export const resolvers = {
  Query: {
    ...epicsQueryResolvers,
  },
  Mutation: {
    ...epicsMutationResolvers,
  },
};
