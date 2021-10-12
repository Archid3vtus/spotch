import axios, { Axios, AxiosRequestConfig } from "axios";
import qs from "querystring";

export class Spotify {
  clientSecret: string;
  clientId: string;
  redirectUri: string;

  private accessToken: string;
  private refreshToken: string;

  constructor(params: constructorObject) {
    this.clientSecret = params.clientSecret;
    this.clientId = params.clientId;
    this.redirectUri = params.redirectUri;

    this.accessToken = null;
    this.refreshToken = null;
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  createAuthorizeURL(scopes: string[]) {
    return `https://accounts.spotify.com/authorize?client_id=${
      this.clientId
    }&response_type=code&scope=${encodeURIComponent(
      scopes.join(" ")
    )}&redirect_uri=${encodeURIComponent(this.redirectUri)}&show_dialog=true`;
  }

  async authorizationCodeGrant(code: string): Promise<any> {
    const options: AxiosRequestConfig = {
      url: "https://accounts.spotify.com/api/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${this.clientId}:${this.clientSecret}`
        ).toString("base64")}`,
      },
      params: {
        grant_type: "authorization_code",
        code,
        redirect_uri: this.redirectUri,
      },
    };

    return axios(options);
    /*
    return axios.post(
      "https://accounts.spotify.com/api/token",
      {
        grant_type: "authorization_code",
        code,
        redirect_uri: this.redirectUri,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`
          ).toString("base64")}`,
        },
      }
    );
    */
  }

  async getMyCurrentPlaybackState(): Promise<GetMyCurrentPlaybackStateResponse> {
    let response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      }
    );

    return new Promise((res, rej) => {
      if (!!response.data) {
        res(response.data);
      } else {
        rej(response);
      }
    });
  }
}
