import { IHttpAdapter, IHttpFetchResponse } from "src/interfaces/IHttpAdapter";

export class FetchAdapter implements IHttpAdapter {
  public fetch<T>(url: string, options?: RequestInit): Promise<IHttpFetchResponse<T>> {
    return fetch(url, options);
  }
}
