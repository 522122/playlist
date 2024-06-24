import { recursiveReaddir } from "https://deno.land/x/recursive_readdir@v2.0.0/mod.ts";
import { extname } from "https://deno.land/std@0.224.0/path/mod.ts";

import Playlist from "./lib/Playlist.ts";
import { type AppConfig } from "./types.ts";

const main = async () => {
  console.time("Time taken to generate playlist");

  const { default: config } = (await import("./app.json", {
    with: { type: "json" },
  })) as {
    default: AppConfig;
  };

  const playlist = new Playlist({
    title: config.playlistTitle,
    baseUrl: config.baseUrl,
    mediaFolder: config.mediaFolder,
  });

  const extensionsSet = new Set(config.extensions);

  (await recursiveReaddir(config.mediaFolder)).forEach((file) => {
    if (!extensionsSet.has(extname(file))) return;
    playlist.track({
      location: file,
    });
  });

  await Deno.writeTextFile(config.outputFileName, playlist.toXML());

  console.log(`${playlist.length} tracks added to ${config.outputFileName}`);
  console.timeEnd("Time taken to generate playlist");
};

main();
