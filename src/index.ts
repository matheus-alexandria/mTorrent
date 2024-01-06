import { getPeers } from "./tracker";
import { open } from "./torrentParser";

const torrent = open("The.Bricklayer.2023.720p.WEBRip.800MB.x264-GalaxyRG.torrent");

getPeers(torrent, (peers) => {
  console.log("list of peers: ", peers);
});
