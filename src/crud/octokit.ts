import { ApolloError } from 'apollo-server-express';
import { Blob, User } from '@octokit/graphql-schema';
import { graphql } from '@octokit/graphql';
import { ICrud } from '.';
import { Octokit } from '@octokit/core';
import { restEndpointMethods, RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import { unionBy } from 'lodash';

require('dotenv').config();

type CreateOrUpdateFileContentsResponse = RestEndpointMethodTypes['repos']['createOrUpdateFileContents']['response'];
type GetContentResponse = RestEndpointMethodTypes['repos']['getContent']['response'];
type GetContentResponseDataUnions = Pick<GetContentResponse, 'data'>['data'];
const getContentResponseDataInstance: GetContentResponseDataUnions = [];
type GetContentResponseData = typeof getContentResponseDataInstance[0];

const GITHUB_OWNER = `${process.env.GITHUB_OWNER}`;
const GITHUB_REPO = `${process.env.GITHUB_REPO}`;

export class OctokitCrud implements ICrud {
  private graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });

  private MyOctokit = Octokit.plugin(restEndpointMethods);
  private octokit = new this.MyOctokit({ auth: process.env.GITHUB_TOKEN });

  private throwError = (e: any) => {
    console.error(e);
    throw new ApolloError(`Gitrows error ${e.code} : ${e.message.description}`);
  };

  public get = async <T>(uri: string): Promise<T | undefined> => {
    let error: any;
    try {
      const { viewer } = await this.graphqlWithAuth<{ viewer: User }>(`
        {
          viewer {
            repository(name: "${GITHUB_REPO}") {
              name
              object(expression: "main:${uri}") {
                ... on Blob {
                  text
                }
              }
            }
          }
        }
      `);

      const blob = viewer.repository?.object as Blob;
      return blob && blob.text ? (JSON.parse(blob.text) as T) : undefined;
    } catch (e) {
      console.error(e);
      throw new ApolloError(`${e}`, e.code);
    }
  };

  public put = async <T>(uri: string, data: T): Promise<T | undefined> => {
    //Check if resource already exists
    let sha: string | undefined = undefined;
    let baseArray: T[] | undefined = undefined;

    try {
      const baseResponse: GetContentResponse = await this.octokit.rest.repos.getContent({ owner: GITHUB_OWNER, repo: GITHUB_REPO, path: uri });
      const baseData = baseResponse.data as GetContentResponseData;
      if (baseData.content) {
        const baseContent = Buffer.from(baseData.content, 'base64').toString('utf-8');
        const base = JSON.parse(baseContent);
        baseArray = !Array.isArray(base) ? [base] : base;
        sha = baseData.sha;
      }
    } catch (e) {
      // no viable resource found : so consider it's a file creation
    }

    //Eventually update base with data
    const dataArray = !Array.isArray(data) ? [data] : data;
    const createdOrUpdated = baseArray ? unionBy(dataArray, baseArray, 'id') : dataArray;

    //Create or update resource
    const content = Buffer.from(JSON.stringify(createdOrUpdated, null, 2), 'utf-8').toString('base64');
    const response: CreateOrUpdateFileContentsResponse = await this.octokit.rest.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: uri,
      content,
      sha,
      message: `${sha ? 'Update' : 'Create'} ${uri}`,
    });
    return response.status === 201 ? data : undefined;
  };
}
