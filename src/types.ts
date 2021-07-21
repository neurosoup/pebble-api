export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Epic = {
  __typename?: 'Epic';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createOrUpdateProject: Project;
  deleteProject: Project;
  dummy?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateOrUpdateProjectArgs = {
  name: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID'];
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  epics?: Maybe<Array<Epic>>;
};

export type Query = {
  __typename?: 'Query';
  dummy?: Maybe<Scalars['Boolean']>;
  projects?: Maybe<Array<Project>>;
};
