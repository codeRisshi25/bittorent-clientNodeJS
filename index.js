"use strict";

import getPeers from "./tracker.js";
import { open } from "./torrentParser.js";

const torrent = open('./testfile.torrent');

console.log("Searching for peers...");

getPeers(torrent, (peers) => {
  console.log("list of peers: ", peers);
});
