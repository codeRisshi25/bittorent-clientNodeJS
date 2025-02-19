"use strict";

import dgram from "dgram";
import { Buffer } from "buffer";
import { URL } from "url";
import crypto from 'crypto';

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
  const buf = Buffer.alloc(16);

  // connection id
  buf.writeUInt32BE(0x417,0);
  buf.writeUInt32BE(0x27101980,4);
  // action
  buf.writeUInt32BE(0,0); 
  // transaction id
  crypto.randomBytes(4).copy(buf,12):

  return buf;
}

function parseConnResp(res) {
  return {
    action : res.readUInt32BE(0),
    transactionId : res.readUInt32BE(4),
    connectionId : res.slice(8)
  }
}

function buildAnnounceReq(connId) {
  // ...
}

function parseAnnounceResp(res) {
  // ...
}

export default getPeers;