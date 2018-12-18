
const shoco = require("./util/shoco.js") && window.shoco;
const smaz = require("smaz");
const lzma = require("./util/lzma.js") && window.lzma;

const encoders = [{
  id: 0,
  encode: smaz.compress,
  decode: smaz.decompress
}, {
  id: 1,
  encode: shoco.compress,
  decode: shocoDecompress
}, {
  id: 2,
  encode: lzmaCompress,
  decode: lzmaDecompress
}]

function shorten(url) {
  let shortestId = -1;
  let shortest = undefined;
  for (let encoder of encoders) {
    let compressed = encoder.encode(url);
    if (shortest === undefined || compressed.length < shortest.length) {
      shortest = compressed;
      shortestId = encoder.id;
    }
  }
  let result = "";
  for (let i = 0; i < shortest.length; i += 2) {
    let u = i + 1 < shortest.length ? shortest[i + 1] : 0;
    result += String.fromCodePoint(packUTF(shortest[i], u));
  }
  return shortestId + result;
}

function expand(url) {
  let encoder = encoders[0];
  for (let e of encoders) {
    if (e.id === +url.charAt(0)) {
      encoder = e;
    }
  }
  let bytes = [];
  url = url.substr(1);
  for (let i = 0; i < url.length; i++) {
    let unpacked = unpackUTF(url.charCodeAt(i));
    if (i === url.length - 1) {
      if (unpacked[1] === 0) {
        unpacked = [unpacked[0]];
      }
    }
    for (let byte of unpacked) {
      bytes.push(byte);
    }
  }
  return encoder.decode(bytes);
}

window.pack = packUTF;
window.unpack = unpackUTF;

function packUTF(o, u) {
  return ((u & 0xFF) << 8) | (o & 0xFF);
}

function unpackUTF(point) {
  return [point & 0xff, (point >> 8) & 0xff];
}

function lzmaCompress(str) {
  const data = [];
  for (let i = 0; i < str.length; i++) {
    data.push(str.charCodeAt(i));
  }
  return lzma.compress(data);
}

function lzmaDecompress(data) {
  let result = "";
  for (let code of lzma.decompress(data)) {
    result += String.fromCodePoint(code);
  }
  return result;
}

function shocoDecompress(data) {
  return shoco.decompress(new Uint8Array(data));
}

function validate(str) {
  return str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g) !== null;
}

export default {
  shorten: shorten,
  expand: expand,
  validate: validate
};