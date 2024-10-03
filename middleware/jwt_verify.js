
import { jwtDecode } from "jwt-decode";
import User from "../db/model/user.mode.js";
import response_handler from "../utils/res_handler.js";

export const referesh_jwt = async (req,res)=>{
    try {
        let { token } = req.body;
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
            let user=await User.findOne(
                {where:{id:decoded.id},raw:true}
            )
            let access_token = generateAccessToken({id:user.id});
            let refresh_token = generateRefreshToken({id:user.id,name:user.name});
            await User.update(
                { refresh_token: refresh_token },
                {where:{id:user.id}}
            )
            return res.status(200).send(response_handler("true",access_token, "success"));
        }
            return res.status(200).send(response_handler("true","Token Is Expired, Please Login Again", "success"));
    } catch (error) {
        return res
          .status(401)
          .send(response_handler("false", error.message, "failure"));

    }
}


export const jwt_verify = async(req, res, next) =>{
    try {
        let token = req.header['x-access-token'];
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
            let user = await User.findOne({
                where:{id:decoded.id}
            })
            if (user != null) next();
        }
        else throw new Error('Token Expire');

    } catch (error) {
        return res
          .status(400)
          .send(response_handler("false", error.message, "failure"));
    }
}


export const getUserId = async (req) => {
    try {
        let token = req.header["x-access-token"];
        const decoded = jwtDecode(token);
        return decoded.id;
    } catch (error) {
        return res
          .status(400)
          .send(response_handler("false", error.message, "failure"));
    }
}