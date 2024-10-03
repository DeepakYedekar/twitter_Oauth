import User from "../db/model/user.mode.js";
import response_handler from "../utils/res_handler.js";

import { Client, auth } from "twitter-api-sdk";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import axios from "axios";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt_token.js";

const authClient = new auth.OAuth2User({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  callback: "https://twitter-oauth-uqu6.onrender.com/callback",
  scopes: ["tweet.read", "users.read"],
});

const STATE = "myState";
export const callback = async (req, res) => {
  try {
    const { code, state } = req.query;
    if (state !== STATE) return res.status(500).send("State isn't matching");

    let accessToken = (await authClient.requestAccessToken(code)).token
      .access_token;
    const userResponse = await axios.get(process.env.TWITTER_API, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (userResponse?.data?.data) {
      let name = userResponse?.data?.data.name;
      let id = userResponse?.data?.data.id;
      let user = await User.findOne({
        where: {
          twitter_id: id
        },
        raw:true
      });

      let accessToken = generateAccessToken(userResponse?.data?.data);
      let refereshToken = generateRefreshToken(userResponse?.data?.data);
      let data = { accessToken, refereshToken, name};

      if (user != null) {
        data.referal_code = user.referral_code;
        data.referral_points=user.referral_points; 
      } else {
        let referal_code = name.split(" ")[0] + "_" + id.substr(0, 6);
        let user=await User.create({
          twitter_id: id,
          name: name,
          referral_code: referal_code,
          refresh_token: refereshToken
        });
        data.referal_code = referal_code;
        data.referral_points = user.referral_points; 
      }

      // Send a message to the parent window and close the popup
      const script = `
        <script>
          window.opener.postMessage(${JSON.stringify(data)}, "*");
          window.close();
        </script>
      `;
      return res.send(script);
    }

    throw new Error("Internal Server Error");
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(response_handler("false", error.message));
  }
};
export const register = async (req, res) => {
  try {
    let { referal_code } = req.body;
    const authUrl = authClient.generateAuthURL({
      state: STATE,
      code_challenge_method: "s256",
    });
    if (referal_code) res.set({ referal_code: referal_code });
    return res
      .status(200)
      .send(response_handler("true", { url: authUrl }, "success"));
  } catch (error) {
    return res.status(500).send(response_handler("false", error.message));
  }
};


export const referal_point = async (req, res) => {
  try {
    let { referal_code } = req.body;
    let data=await User.increment(
      { referral_points: +10 },
      {
        where: { referral_code: referal_code }
      }
    )
    return res
      .status(200)
      .send(response_handler("true", "success"));
  } catch (error) {
    return res.status(500).send(response_handler("false", error.message));
  }
};

export const get_referal_point = async (req, res) => {
  try {
    let id=getUserId(req);
    let user = await User.findOne(
    {attributes:[referral_points]},
      { where: { id: id } }
    )
    return res.status(200).send(response_handler("true",user, "success"));
  } catch (error) {
    return res.status(500).send(response_handler("false", error.message));
  }
};