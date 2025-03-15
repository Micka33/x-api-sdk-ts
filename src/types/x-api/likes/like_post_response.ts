import type { IBaseResponse } from '../base_response';

export interface ILikePostResponse extends IBaseResponse<{ liked: boolean }> {};
