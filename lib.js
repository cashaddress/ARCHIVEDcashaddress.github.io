// The MIT License (MIT)
//
// Copyright (c) 2013 Artem S Vybornov
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// The MIT License (MIT)
// Copyright base-x contributors (c) 2016
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// https://github.com/cryptocoinjs/base-x/blob/master/index.js
// base-x encoding
// Forked from https://github.com/cryptocoinjs/bs58
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas
// Merged Buffer refactorings from base58-native by Stephen Pair
// Copyright (c) 2013 BitPay Inc

// Copyright (c) 2017 Pieter Wuille
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// ISC License

// Copyright (c) 2013-2016 The btcsuite developers

// Permission to use, copy, modify, and distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

const CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"
const CHARSET_MAP = {"q": 0, "p": 1, "z": 2, "r": 3, "y": 4, "9": 5, "x": 6, "8": 7, "g": 8, "f": 9, "2": 10, "t": 11,
"v": 12, "d": 13, "w": 14, "0": 15, "s": 16, "3": 17, "j": 18, "n": 19, "5": 20, "4": 21, "k": 22, "h": 23,
"c": 24, "e": 25, "6": 26, "m": 27, "u": 28, "a": 29, "7": 30, "l": 31}
const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
const ALPHABET_MAP = {"1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6,
  "8": 7, "9": 8, "A": 9, "B": 10, "C": 11, "D": 12, "E": 13, "F": 14, "G": 15,
  "H": 16, "J": 17, "K": 18, "L": 19, "M": 20, "N": 21, "P": 22, "Q": 23, "R": 24,
  "S": 25, "T": 26, "U": 27, "V": 28, "W": 29, "X": 30, "Y": 31, "Z": 32, "a": 33,
  "b": 34, "c": 35, "d": 36, "e": 37, "f": 38, "g": 39, "h": 40, "i": 41, "j": 42,
  "k": 43, "m": 44, "n": 45, "o": 46, "p": 47, "q": 48, "r": 49, "s": 50, "t": 51,
  "u": 52, "v": 53, "w": 54, "x": 55, "y": 56, "z": 57}
function parseAndConvertCashAddress(prefix, payloadString) {
  var payloadUnparsed = [];
  for (var i = 0; i < payloadString.length; i++) {
    if (payloadString[i] == undefined) {
      throw "Unexpected character!"
    }
    payloadUnparsed.push(CHARSET_MAP[payloadString[i]]);
  }
  var expandPrefix = [];
  // func ExpandPrefix(prefix string) []byte {
  // ret := make(data, len(prefix) + 1)
  // for i := 0; i < len(prefix); i++ {
  //	ret[i] = byte(prefix[i]) & 0x1f;
  // }
  // ret[len(prefix)] = 0;
  // return ret;
  // }
  // https://play.golang.org/p/NMR2ImCmdpZ
  var netType = true;
  if (prefix == "bitcoincash") {
    expandPrefix = [2, 9, 20, 3, 15, 9, 14, 3, 1, 19, 8, 0];
  } else {
    /*if (prefix == "bchtest")*/ expandPrefix = [2, 3, 8, 20, 5, 19, 20, 0];
    netType = false;
  }
  var polymodInput = expandPrefix.concat(payloadUnparsed);
  var polymodResult = polyMod(polymodInput);
  for (var i = 0; i < polymodResult.length; i++) {
    if (polymodResult[i] != 0) {
      var syndromes = {};
      var c = [];
      var t = 0;
      for (var p = 0; p < polymodInput.length; p++) {
        for (var e = 1; e < 32; e++) {
          polymodInput[p] ^= e;
          c = polyMod(polymodInput);
          t = 0;
          for (var k = 0; k < c.length; k++) {
            t += c[k];
          }
          if (t == 0) {
            correctedAddress = rebuildAddress(polymodInput);
            document.getElementById("correctedButton").style = "";
            return "";
          }
          //syndromes[simplify(xor(c, polymodResult))] = p * 32 + e
          polymodInput[p] ^= e;
        }
      }
      /*for (var s0 in syndromes) {
          if (simplify(xor(s0, polymodResult)) in syndromes) {
            console.log("is")
            //console.log(polymodInput[syndromes[s0]>>5])
            //console.log(rebuildAddress(polymodInput))
            polymodInput[syndromes[s0]>>5] ^= syndromes[s0] % 32
            //console.log(rebuildAddress(polymodInput))
            //console.log(polymodInput[syndromes[s0]>>5])
            //console.log(polymodInput[syndromes[simplify(xor(s0, polymodResult))]>>5])
            polymodInput[syndromes[simplify(xor(s0, polymodResult))]>>5] ^= syndromes[simplify(xor(s0, polymodResult))] % 32
            //console.log(rebuildAddress(polymodInput))
            //console.log(polymodInput[syndromes[simplify(xor(s0, polymodResult))]>>5])
            if (syndromes[s0]>>5 >= polymodInput.length || syndromes[simplify(xor(s0, polymodResult))]>>5 >= polymodInput.length) {
              alert("er")
            }
            // Set rebuildAddress(polymodInput)
            correctedAddress = rebuildAddress(polymodInput)
            console.log(correctedAddress)
            document.getElementById('correctedButton').style = ""
            //polymodInput[syndromes[s0]>>5] ^= syndromes[s0] % 32
            //polymodInput[syndromes[simplify(xor(s0, polymodResult))]>>5] ^= syndromes[simplify(xor(s0, polymodResult))] % 32
            //return
          }
        }*/
      throw "Can't correct errors!"
    }
  }
  var payload = convertBits(payloadUnparsed.slice(0, -8), 5, 8, false);
  var addressType = payload[0] >> 3; // 0 (P2PKH) or 1 (P2SH)
  return craftOldAddress(addressType, payload.slice(1, 21), netType);
}

function craftOldAddress(kind, addressHash, netType) {
  if (netType) {
    if (kind == 0) {
      return CheckEncodeBase58(addressHash, 0x00);
    } else {
      return CheckEncodeBase58(addressHash, 0x05);
    }
  } else {
    if (kind == 0) {
      return CheckEncodeBase58(addressHash, 0x6f);
    } else {
      return CheckEncodeBase58(addressHash, 0xc4);
    }
  }
}

function CheckEncodeBase58(input, version) {
  var b = [version];
  b = b.concat(input);
  var h = sha256(Uint8Array.from(b));
  var h2 = sha256(h);
  b = b.concat(Array.from(h2).slice(0, 4));
  return EncodeBase58Simplified(b);
}

function EncodeBase58Simplified(b) {
  var digits = [0];
  for (var i = 0; i < b.length; i++) {
    for (var j = 0, carry = b[i]; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      // https://jsperf.com/different-ways-to-truncate
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  var answer = "";
  // leading zero bytes
  for (var i = 0; i < b.length && b[i] === 0; i++) {
    answer = answer.concat("1");
  }
  // reverse
  for (var t = digits.length - 1; t >= 0; t--) {
    answer = answer.concat(ALPHABET[digits[t]]);
  }
  return answer;
}

function parseAndConvertOldAddress(oldAddress) {
  var bytes = [0];
  for (var i = 0; i < oldAddress.length; i++) {
    var value = ALPHABET_MAP[oldAddress[i]];
    if (value == undefined) {
      throw "Unexpected character!"
    }
    for (var j = 0; j < bytes.length; j++) {
      value += bytes[j] * 58;
      bytes[j] = value & 0xff;
      value >>= 8;
    }
    while (value > 0) {
      bytes.push(value & 0xff);
      value >>= 8;
    }
  }

  for (var i = 0; i < oldAddress.length && oldAddress[i] === "1"; i++) {
    bytes.push(0);
  }
  bytes = bytes.reverse();
  var version = bytes[0];
  var h = sha256(Uint8Array.from(bytes.slice(0, -4)));
  var h2 = sha256(h);
  if (
    h2[0] != bytes[bytes.length - 4] ||
    h2[1] != bytes[bytes.length - 3] ||
    h2[2] != bytes[bytes.length - 2] ||
    h2[3] != bytes[bytes.length - 1]
  ) {
    throw "Address checksum doesn't match! Did you type it wrong?"
  }
  var payload = bytes.slice(1, bytes.length - 4);
  if (version == 0x00) {
    return craftCashAddress(0, payload, true);
  } else if (version == 0x05) {
    return craftCashAddress(1, payload, true);
  } else if (version == 0x6f) {
    return craftCashAddress(0, payload, false);
  } else if (version == 0xc4) {
    return craftCashAddress(1, payload, false);
  } else if (version == 0x1c) {
    return craftCashAddress(0, payload, true);
  } else if (version == 0x28) {
    return craftCashAddress(1, payload, true);
  } else {
    throw "Unknown version byte"
  }
}

function packCashAddressData(addressType, addressHash) {
  // Pack addr data with version byte.
  var versionByte = addressType << 3;
  // Those addresses are not in use!
  /*var encodedSize = (addressHash.length - 20) / 4
  	if ((addressHash.length-20)%4 != 0) {
  		return []
  	}
  	if (encodedSize < 0 || encodedSize > 8) {
  		return []
  	}
  	versionByte |= encodedSize*/
  var data = [versionByte].concat(addressHash);
  return convertBits(data, 8, 5, true);
}

function convertBits(data, fromBits, tobits, pad) {
  // General power-of-2 base conversion.
  var acc = 0;
  var bits = 0;
  var ret = [];
  var maxv = (1 << tobits) - 1;
  var maxAcc = (1 << (fromBits + tobits - 1)) - 1;
  for (var i = 0; i < data.length; i++) {
    var value = data[i];
    if (value < 0 || value >> fromBits !== 0) {
      throw "convertBits error!"
    }
    acc = ((acc << fromBits) | value) & maxAcc;
    bits += fromBits;
    while (bits >= tobits) {
      bits -= tobits;
      ret.push((acc >> bits) & maxv);
    }
  }
  if (pad) {
    if (bits > 0) {
      ret.push((acc << (tobits - bits)) & maxv);
    }
  } else if (bits >= fromBits || ((acc << (tobits - bits)) & maxv) != 0) {
    throw "convertBits error!"
  }
  return ret;
}

function craftCashAddress(kind, addressHash, netType) {
  var payload = packCashAddressData(kind, addressHash);
  // func ExpandPrefix(prefix string) []byte {
  // ret := make(data, len(prefix) + 1)
  // for i := 0; i < len(prefix); i++ {
  //	ret[i] = byte(prefix[i]) & 0x1f;
  // }
  // ret[len(prefix)] = 0;
  // return ret;
  // }
  // https://play.golang.org/p/NMR2ImCmdpZ
  var expandPrefix = [];
  if (netType == true) {
    expandPrefix = [2, 9, 20, 3, 15, 9, 14, 3, 1, 19, 8, 0];
  } else {
    expandPrefix = [2, 3, 8, 20, 5, 19, 20, 0];
  }
  var enc = expandPrefix.concat(payload);
  var mod = polyMod(enc.concat([0, 0, 0, 0, 0, 0, 0, 0]));
  var retChecksum = [];
  for (var i = 0; i < 8; i++) {
    // Convert the 5-bit groups in mod to checksum values.
    // retChecksum[i] = (mod >> uint(5*(7-i))) & 0x1f
    retChecksum[i] = simplify(and(rShift(mod, 5 * (7 - i)), [31]))[0];
  }
  var combined = payload.concat(retChecksum);
  var ret = "";
  if (netType == true) {
    ret = "bitcoincash:";
  } else {
    ret = "bchtest:";
  }
  for (var i = 0; i < combined.length; i++) {
    ret = ret.concat(CHARSET[combined[i]]);
  }
  if (ret.length == 54 || ret.length == 50) {
    return ret;
  } else {
    throw "Unexpected converted address length!"
  }
}

function and(a, b) {
  var t = a.length - b.length;
  c = [];
  if (t >= 0) {
    for (var i = 0; i < b.length; i++) {
      c.push(a[i + t] & b[i]);
    }
  } else {
    for (var i = 0; i < a.length; i++) {
      c.push(a[i] & b[i - t]);
    }
  }
  return c;
}

function xor(a, b) {
  var t = a.length - b.length;
  var c = [];
  if (t > 0) {
    b = Array(t)
      .fill(0)
      .concat(b);
  } else if (t < 0) {
    a = Array(-t)
      .fill(0)
      .concat(a);
  }
  for (var i = 0; i < a.length; i++) {
    c.push(a[i] ^ b[i]);
  }
  return c;
}

function rShift(a, b) {
  // 35 >= b >= 0
  if (a.length === 0) {
    return [0];
  }
  if (b > 31) {
    var t = a.slice(0, -1);
    b -= 32;
  } else {
    var t = a.slice(0);
  }
  if (b === 0) {
    return t;
  }
  for (var i = t.length - 1; i > 0; i--) {
    t[i] >>>= b;
    // alternative code:
    t[i] |= (t[i - 1] & ((2 << (b + 1)) - 1)) << (32 - b);
  }
  t[0] >>>= b;
  if (t[0] === 0) {
    return t.slice(1);
  }
  return t;
}

function add5zerosAtTheEnd(a) {
  a = [0].concat(a);
  for (var i = 1; i < a.length; i++) {
    a[i - 1] |= a[i] >>> 27;
    a[i] <<= 5;
  }
  return a;
}

function polyMod(v) {
  var c = [0, 1];
  var c0 = [0];
  var temp = [];
  for (var i = 0; i < v.length; i++) {
    c0 = rShift(c, 35);
    c = xor(add5zerosAtTheEnd(and(c, [7, -1])), [v[i]]);
    if (c0.length === 0) {
      continue;
    }
    if (c0[0] & 1) {
      c = xor(c, [0x98, 0xf2bc8e61]);
    }
    if (c0[0] & 2) {
      c = xor(c, [0x79, 0xb76d99e2]);
    }
    if (c0[0] & 4) {
      c = xor(c, [0xf3, 0x3e5fb3c4]);
    }
    if (c0[0] & 8) {
      c = xor(c, [0xae, 0x2eabe2a8]);
    }
    if (c0[0] & 16) {
      c = xor(c, [0x1e, 0x4f43e470]);
    }
  }
  return xor(c, [1]);
}

function rebuildAddress(bytes) {
  var ret = "";
  var i = 0;
  while (bytes[i] != 0 && i < bytes.length) {
    ret = ret.concat(String.fromCharCode(96 + bytes[i]));
    i++;
  }
  ret = ret.concat(":");
  for (i++; i < bytes.length; i++) {
    ret = ret.concat(CHARSET[bytes[i]]);
  }
  return ret;
}

function simplify(v) {
  if (v.length === 0) {
    return [0];
  }
  var i = 0;
  while (v[i] === 0) {
    i++;
  }
  var z = v.slice(i);
  if (z.length === 0) {
    z = [0];
  }
  return z;
}
