import { AbstractOAuth1Auth } from "../auth/IOAuth1Auth";
import { AbstractOAuth2Auth } from "../auth/IOAuth2Auth";
import { AbstractRequestClient } from "../IRequestClient";

/**
 * Interface for the APIs constructors.
 * Provides a generic constructor for the APIs.
 */
export interface IApiConstructor<T> {
  new (
    baseUrl: string,
    oAuth1: AbstractOAuth1Auth | undefined | null,
    oAuth2: AbstractOAuth2Auth,
    requestClient: AbstractRequestClient
  ): T;
}

export abstract class AbstractApi {
  constructor(
    protected readonly baseUrl: string,
    protected readonly oAuth1: AbstractOAuth1Auth | undefined | null,
    protected readonly oAuth2: AbstractOAuth2Auth,
    protected readonly requestClient: AbstractRequestClient
  ) {}
}
