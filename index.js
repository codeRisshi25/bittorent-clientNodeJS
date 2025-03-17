"use strict";

import getPeers from "./tracker";
import {open} from "./torrentParser";

const torrent = open('puppy.torrent');

getPeers(torrent, (peers) => {
  console.log("list of peers: ", peers);
});3
