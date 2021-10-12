type constructorObject = {
  clientSecret: string;
  clientId: string;
  redirectUri: string;
};

type GetMyCurrentPlaybackStateResponse = {
  context: {
    external_urls: {
      spotify: string;
      [attr: string]: string;
    };
    href: string;
    type: string;
    uri: string;
  };
  timestamp: number;
  progress_ms: number;
  is_playing: boolean;
  currently_playing_type: string;
  item: {
    album: {
      album_type: string;
      external_urls: {
        [attr: string]: string;
      };
      href: string;
      id: string;
      images: {
        height: number;
        url: string;
        width: number;
      }[];
      name: string;
      type: string;
      uri: string;
    };
    artists: {
      external_urls: {
        spotify: string;
        [attr: string]: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
      isrc: string;
      [att: string]: string;
    };
    external_urls: {
      spotify: string;
      [attr: string]: string;
    };
    href: string;
    id: string;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
  };
};
