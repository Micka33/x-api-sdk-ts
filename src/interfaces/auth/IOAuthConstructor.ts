import { IHttpAdapter } from "../IHttpAdapter";

/**
 * Interface for the APIs constructors.
 * Provides a generic constructor for the APIs.
 */
export interface IOAuthConstructor<Config, T> {
  new (
    config: Config,
    httpAdapter: IHttpAdapter
  ): T;
}

export abstract class AbstractOAuthConstructor<Config> {
  constructor(
    protected readonly config: Config,
    protected readonly httpAdapter: IHttpAdapter
  ) {};
}
