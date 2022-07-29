import { SEPARATOR } from './constants';
import { Numbers } from './enums';
import { QueryParameters } from './types';

export const makeQueryString = (queryParameters: QueryParameters): string => {
  return `?${(Object.entries(queryParameters) as [keyof QueryParameters, number | string][])
    .map((parameter): string => `${parameter[Numbers.Zero]}=${parameter[Numbers.One]}`)
    .join(SEPARATOR.query)}`;
};

export const makeUrl = (
  base: string,
  endpoint: string,
  id?: number,
  queryParameters?: QueryParameters
): string => {
  const idString: string = id ? `${SEPARATOR.url}${id}` : SEPARATOR.url;
  if (queryParameters) {
    return `${base}${SEPARATOR.url}${endpoint}${idString}${makeQueryString(queryParameters)}`;
  }
  return `${base}${SEPARATOR.url}${endpoint}${idString}`;
};
