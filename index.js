"use strict";

import getPeers from "./src/tracker.js";
import { open } from "./src/torrentParser.js";
import "./src/download.js";

const torrent = open('./testfile.torrent');

console.log("Searching for peers...");

getPeers(torrent, (peers) => {
  console.log("list of peers: ", peers);
});
