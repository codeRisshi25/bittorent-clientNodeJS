"use strict";

import net from "net";
import { Buffer } from "buffer";
import getPeers from "./tracker.js";

function main(torrent) {
  getPeers(torrent, (peers) => {
    peers.forEach(download);
  });
}

function download(peer) {
  const socket = new net.Socket();
  socket.on("error", console.log);
  socket.connect(peer.port, peer.ip, function () {
    socket.write(Buffer.from("hello world"));
  });

  socket.on("data", (responseBuffer) => {
    // do something with response Buffer
  });
}

export default main;