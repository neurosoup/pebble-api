import { OctokitCrud } from './octokit';

export interface ICrud {
  get: <T>(uri: string) => Promise<T | undefined>;
  put: <T>(uri: string, data: T) => Promise<T | undefined>;
}

export const crud: ICrud = new OctokitCrud();
