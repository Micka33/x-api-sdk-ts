export interface IHttpFetchResponse<T> {
  ok: boolean;
  status: number;
  headers: Headers;
  json: () => Promise<T>;
  text: () => Promise<string>;
}

export interface IHttpAdapter {
  fetch<T>(url: string, options?: RequestInit): Promise<IHttpFetchResponse<T>>;
}
