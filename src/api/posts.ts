import { IOAuth1Auth } from "interfaces/auth/IOAuth1Auth";
import { IOAuth2Auth } from "interfaces/auth/IOAuth2Auth";
import { IPosts } from "src/interfaces/api/IPosts";

export class Posts implements IPosts {
  constructor(private readonly oAuth1: IOAuth1Auth, private readonly oAuth2: IOAuth2Auth) {}
}
