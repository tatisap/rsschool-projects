import { SEPARATOR } from '../constants/others-constants';
import { Numbers } from '../types/enums';
import { QueryParameters } from '../types/types';

export const makeQueryString = (queryParameters: QueryParameters): string => {
  return `?${(Object.entries(queryParameters) as [keyof QueryParameters, number | string][])
    .map(
      (parameter: [keyof QueryParameters, number | string]): string =>
        `${parameter[Numbers.Zero]}=${parameter[Numbers.One]}`
    )
    .join(SEPARATOR.query)}`;
};

export const makeUrl = (
  base: string,
  endpoint: string,
  id?: string,
  queryParameters?: QueryParameters
): string => {
  const idString: string = id ? `${SEPARATOR.url}${id}` : SEPARATOR.url;
  if (queryParameters) {
    return `${base}${SEPARATOR.url}${endpoint}${idString}${makeQueryString(queryParameters)}`;
  }
  return `${base}${SEPARATOR.url}${endpoint}${idString}`;
};
