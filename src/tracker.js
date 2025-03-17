"use strict";

import dgram from "dgram";
import { Buffer } from "buffer";
import { URL } from "url";
import crypto from "crypto";
import genId from "./util.js";
import { size , infoHash } from "../src/torrentParser.js";

const getPeers = (torrent, callback) => {
  const socket = dgram.createSocket("udp4");
  const myUrl = Buffer.from(torrent.announce).toString("utf8");
  console.log("Tracker URL:", myUrl);

  // send connect request
  udpSend(socket, buildConnReq(), myUrl);

  socket.on("message", (res) => {
    if (respType(res) === "connect") {
      // recieve and parse connect response
      const connResp = parseConnResp(res);
      console.log("Connection response :",connResp);
      // send announce request
      const announceReq = buildAnnounceReq(connResp.connectionId, torrent);
      udpSend(socket, announceReq, myUrl);

    } else if (respType(res) === "announce") {
      // parse announce response
      const announceResp = parseAnnounceResp(res);
      console.log("Announce response :",announceResp);
      callback(announceResp.peers);
    }
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
};

function udpSend(socket, message, rawUrl, callback = () => {}) {
  const url = new URL(rawUrl);
  console.log(url.port, url.hostname);
  socket.send(message, 0, message.length, url.port, url.hostname, callback);
}

function respType(res) {
  const action = res.readUInt32BE(0);
  if (action === 0 ) return 'connect';
  if (action === 1 ) return 'announce';
}

function buildConnReq() {
  const buf = Buffer.allocUnsafe(16);
  // connection id
  buf.writeUInt32BE(0x417,0);
  buf.writeUInt32BE(0x27101980,4);
  // action
  buf.writeUInt32BE(0,8); 
  // transaction id
  crypto.randomBytes(4).copy(buf,12);

  return buf;
}

function parseConnResp(res) {
  return {
    action : res.readUInt32BE(0),
    transactionId : res.readUInt32BE(4),
    connectionId : res.slice(8)
  }
}

function buildAnnounceReq(connId, torrent, port=6881) {
  const buf = Buffer.allocUnsafe(98);
  // connection string
  connId.copy(buf,0);
  // action
  buf.writeUInt32BE(1,8);
  // transaction id
  crypto.randomBytes(4).copy(buf,12);
  //info hash
  infoHash(torrent).copy(buf,16)
  // peerId
  genId().copy(buf,36);
  // downloaded
  Buffer.alloc(8).copy(buf,56);
  // left
  size(torrent).copy(buf,64);
  //uploaded
  Buffer.alloc(8).copy(buf,72);
  // event
  buf.writeUInt32BE(0,88);
  // ip address
  buf.writeUInt32BE(0,80);
  // key
  crypto.randomBytes(4).copy(buf,88);
  // num want
  buf.writeInt32BE(-1, 92);
  // port
  buf.writeUInt16BE(port, 96);

  return buf;
}

function parseAnnounceResp(resp) {
  function group(iterable, groupSize) {
    let groups = [];
    for (let i = 0; i < iterable.length; i += groupSize) {
      groups.push(iterable.slice(i, i + groupSize));
    }
    return groups;
  }

  return {
    action: resp.readUInt32BE(0),
    transactionId: resp.readUInt32BE(4),
    leechers: resp.readUInt32BE(8),
    seeders: resp.readUInt32BE(12),
    peers: group(resp.slice(20), 6).map(address => {
      return {
        ip: address.slice(0, 4).join('.'),
        port: address.readUInt16BE(4)
      }
    })
  }
}

export default getPeers;