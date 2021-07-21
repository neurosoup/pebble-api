import { queryResolvers as epicsQueryResolvers, mutationResolvers as epicsMutationResolvers } from './projects';

export default {
  Query: {
    ...epicsQueryResolvers,
  },
  Mutation: {
    ...epicsMutationResolvers,
  },
};
