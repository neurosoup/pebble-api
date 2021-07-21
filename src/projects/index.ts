import { IResolverObject } from 'apollo-server-express';

import createOrUpdateProject from './resolvers/createOrUpdateProject';
import projects from './resolvers/projects';

export const queryResolvers: IResolverObject = {
  projects,
};

export const mutationResolvers: IResolverObject = {
  createOrUpdateProject,
};
