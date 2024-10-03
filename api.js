import { Router } from "express";
import { callback, get_referal_point, referal_point, register } from "./controller/twitter.js";
import { jwt_verify, referesh_jwt } from "./middleware/jwt_verify.js";

const route = Router();

route.get("/callback", callback);
route.post("/twitter/login", register);
route.post("/referal_point", jwt_verify, referal_point);
route.get("/get_referal_point", jwt_verify, get_referal_point);
route.post("/referesh_token", referesh_jwt);

export { route as twitter_routes };
