"use strict";

import fs from "fs";
import bencode from "bencode";
import getPeers from "./tracker";

const torrent = bencode.decode(fs.readFileSync("puppy.torrent"));

getPeers(torrent, (peers) => {
  console.log("list of peers: ", peers);
});3
