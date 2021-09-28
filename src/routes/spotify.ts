import { Router } from "express";
import SpotifyWebApi from "spotify-web-api-node";
require("dotenv").config();

let router = Router();

var spotifyWebApi = new SpotifyWebApi({
  clientSecret: process.env["clientSecret"],
  clientId: process.env["clientId"],
  redirectUri: process.env["redirectUri"],
});

var scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-currently-playing",
  "user-read-playback-state",
];

router.get("/login", (req, res) => {
  let authorizeUrl = spotifyWebApi.createAuthorizeURL(scopes, "STATE-FODA");
  res.status(200).send(authorizeUrl);
});

router.get("/callback", (req: { query: { code: string } }, res) => {
  spotifyWebApi
    .authorizationCodeGrant(req.query.code)
    .then((data) => {
      const { access_token, refresh_token } = data.body;
      spotifyWebApi.setAccessToken(access_token);
      spotifyWebApi.setRefreshToken(refresh_token);

      return res.status(200).send({ msg: "User logged" });
    })
    .catch((error) => {
      return res.status(500).send({ error: "Internal server error" });
    });
});

router.get(
  "/whatsplaying",
  async (req: { [attr: string]: any; query: { username: string } }, res) => {
    try {
      let data = await spotifyWebApi.getMyCurrentPlaybackState();
      let { name: artistName } = JSON.parse(JSON.stringify(data)).body.item
        .artists[0];

      if (!!data.body.item) {
        res
          .status(200)
          .send(
            `${req.query.username} is currently listening to ${artistName} - ${data.body.item.name}. \n\n${data.body.item.external_urls.spotify}`
          );
      } else {
        throw { code: 404, error: "User not listening to anything now" };
      }

      spotifyWebApi
        .refreshAccessToken()
        .then((data) => {
          console.log("Token refreshed");

          spotifyWebApi.setAccessToken(data.body.access_token);
        })
        .catch((error) => {
          throw error;
        });
    } catch (e: any) {
      if (!!e.code) {
        return res.status(e.code).send({ error: e.error });
      }

      console.log(e);
      res.status(500).send({ error: "Internal server error" });
    }
  }
);

export default router;
