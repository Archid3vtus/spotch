import { Router } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { Spotify } from "../modules/Spotify";
require("dotenv").config();

let router = Router();

var spotify = new Spotify({
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
  let authorizeUrl = spotify.createAuthorizeURL(scopes);
  res.status(200).redirect(authorizeUrl);
});

router.get("/callback", (req: { query: { code: string; error: any } }, res) => {
  spotify
    .authorizationCodeGrant(req.query.code)
    .then(({ data }) => {
      const { access_token, refresh_token } = data;
      spotify.setAccessToken(access_token);
      spotify.setRefreshToken(refresh_token);

      return res.status(200).send({ msg: "User logged", access_token });
    })
    .catch((promiseError) => {
      console.log(req.query.error);

      return res.status(500).send({ error: "Internal server error" });
    });
});

router.get(
  "/whatsplaying",
  async (req: { [attr: string]: any; query: { username: string } }, res) => {
    try {
      let data = await spotify.getMyCurrentPlaybackState();

      if (!!data.item) {
        res
          .status(200)
          .send(
            `${req.query.username} is currently listening to ${data.item.artists[0].name} - ${data.item.name}. \n\n${data.item.external_urls.spotify}`
          );
      } else {
        throw { code: 404, error: "User not listening to anything now" };
      }
    } catch (e: any) {
      console.log(e.status);
      if (!!e.status && e.status === 204) {
        return res.send(
          `${req.query.username} is not listening to anything now.`
        );
      }

      return res.status(500).send({ error: "Internal server error" });
    }
  }
);

export default router;
