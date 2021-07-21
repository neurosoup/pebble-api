import { Context } from '../../server';
import { Mutation, MutationCreateOrUpdateProjectArgs, Project } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export default async (parent: Mutation, args: MutationCreateOrUpdateProjectArgs, context: Context): Promise<Project> => {
  const name = args.name;
  const id = args.id || uuidv4();
  const path = `projects.json`;
  const project: Project = {
    id,
    name,
  };

  await context.crud.put(path, project);

  return project;
};
