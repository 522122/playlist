import { js2xml } from "https://deno.land/x/js2xml@1.0.4/mod.ts";
import { relative } from "https://deno.land/std@0.224.0/path/mod.ts";

// const command = new Deno.Command("mediainfo", {
//   args: ["--Output=JSON", this.location],
// });

// const {code, stdout} = command.outputSync()

// console.log(new TextDecoder().decode(stdout))

class Track {
  location = "";

  constructor({ location }: { location: string }) {
    this.location = location;
  }

  json({ baseUrl, mediaFolder }: { baseUrl: string; mediaFolder: string }) {
    return {
      location: new URL(
        encodeURI(relative(mediaFolder, this.location)),
        baseUrl
      ).toString(),
    };
  }
}

class Playlist {
  tracks: Track[] = [];
  title = "";
  baseUrl = "";
  mediaFolder = "";

  constructor({
    title,
    baseUrl,
    mediaFolder,
  }: {
    title: string;
    baseUrl: string;
    mediaFolder: string;
  }) {
    this.baseUrl = baseUrl;
    this.title = title;
    this.mediaFolder = mediaFolder;
  }

  get length() {
    return this.tracks.length;
  }

  track({ location }: { location: string }) {
    this.tracks.push(
      new Track({
        location,
      })
    );
    return this;
  }

  toXML() {
    return js2xml(this.json(), {
      compact: true,
      spaces: 4,
    });
  }

  json() {
    return {
      _declaration: { _attributes: { version: "1.0", encoding: "utf-8" } },
      playlist: {
        title: this.title,
        trackList: {
          track: this.tracks.map((track) =>
            track.json({ baseUrl: this.baseUrl, mediaFolder: this.mediaFolder })
          ),
        },
      },
    };
  }
}

export default Playlist;
