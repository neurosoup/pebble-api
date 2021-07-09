import { IResolverObject } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';
import { Context } from '../server';
import { Mutation, MutationCreateOrUpdateProjectArgs, Project, Query } from '../types';

export const queryResolvers: IResolverObject = {
  projects: async (parent: Query, args: Record<string, any>, context: Context): Promise<Project[] | []> => {
    const path = 'projects.json';
    const result = await context.crud.get<Project[]>(path);
    return result || [];
  },
};

export const mutationResolvers: IResolverObject = {
  createOrUpdateProject: async (parent: Mutation, args: MutationCreateOrUpdateProjectArgs, context: Context): Promise<Project> => {
    const name = args.name;
    const id = args.id || uuidv4();
    const path = `projects.json`;
    const project: Project = {
      id,
      name,
    };

    await context.crud.put(path, project);

    return project;
  },
};
