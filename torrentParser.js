import bencode from 'bencode'
import fs from "fs";

function open (filepath) {
    return bencode.decode(fs.readFileSync(filepath));
    // const torrent = bencode.decode(fs.readFileSync('./puppy.torrent'));
    // return torrent.size;
};

function size () {
    // ...
}

function infoHash () {
    // ...
}

export default { open , size , infoHash};

