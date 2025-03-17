"use strict";

import bencode from "bencode";
import fs from "fs";
import crypto from "crypto";
import bignum from "bignum";

function open(filepath) {
  return bencode.decode(fs.readFileSync(filepath));
  // const torrent = bencode.decode(fs.readFileSync('./puppy.torrent'));
  // return torrent.size;
}

function size(torrent) {
  const size = torrent.info.files
    ? torrent.info.files.map((file) => file.length).reduce((a, b) => a + b)
    : torrent.info.length;

  return bignum.toBuffer(size, { size: 8 });
}

function infoHash(torrent) {
  const info = bencode.encode(torrent.info);
  return crypto.createHash("sha1").update(info).digest();
}

export { open, size, infoHash };
