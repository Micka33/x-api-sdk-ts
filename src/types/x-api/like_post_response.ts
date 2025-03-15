import { BaseResponse } from "./response_type";

export interface LikePostResponse extends BaseResponse<{ liked: boolean }> {};
