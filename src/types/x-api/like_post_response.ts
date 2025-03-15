import { BaseResponse } from "./base_response";

export interface LikePostResponse extends BaseResponse<{ liked: boolean }> {};
