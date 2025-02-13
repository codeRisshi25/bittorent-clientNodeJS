"use strict";

import dgram from "dgram";
import { Buffer } from "buffer";
import { URL } from "url";

const getPeers = (torrent, callback) => {
  const socket = dgram.createSocket("udp4");
  const myUrl = Buffer.from(torrent.announce).toString("utf8");

  // send connect request
  udpSend(socket, buildConnReq(), url);

  socket.on("message", (res) => {
    if (respType(res) === "connect") {
      // recieve and parse connect response
      const connResp = parseConnResp(res);
      // send announce request
      const announceReq = buildAnnounceReq(connResp.connectionId);
      udpSend(socket, announceResp, myUrl);
    } else if (respType(res) === "announce") {
      // parse announce response
      const announceResp = parseAnnounceResp(resp);
      callback(announceResp.peers);
    }
  });
};

function udpSend(socket, message, rawUrl, callback = () => {}) {
  const url = new URL(rawUrl);
  socket.send(message, 0, message.length, url.port, url.host, callback);
}

function respType(res) {
  // ...
}

function buildConnReq() {
  // ...
}

function parseConnResp(res) {
  // ...
}

function buildAnnounceReq(connId) {
  // ...
}

function parseAnnounceResp(res) {
  // ...
}

export default getPeers;