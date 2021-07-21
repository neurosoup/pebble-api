import { Context } from '../../server';
import { Project, Query } from '../../types';

export default async (parent: Query, args: Record<string, any>, context: Context): Promise<Project[] | []> => {
  const path = 'projects.json';
  const result = await context.crud.get<Project[]>(path);
  return result || [];
};
