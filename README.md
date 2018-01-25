## CashAddress.github.io

The **fastest**, the **most minimal** Javascript implementation of Bitcoin Cash Address conversion.

See it live: [CashAddress.github.io](https://cashaddress.github.io/)

BTW, did you know that CashAddress.github.io was the **first** CashAddr translator? (Dec 20)

Important files of repository:

- [**lib.js**](/lib.js)

- [**main.js**](/main.js)

- [**index.html**](/index.html)

- [fast-sha256.min.js](/fast-sha256.min.js)

- [lib.min.js](/lib.min.js)

- [main.min.js](/main.min.js)

- [qrcode.min.js](/qrcode.min.js)

- [styles.bundle.css](/styles.bundle.css)

### Contribution

We're having hard times being innovative, (a.k.a. we implemented everything that is useful), and the users
are preferring our alternatives, since `cashaddr.bitcoincash.org` looks more trustworthy than `cashaddress.github.io`. We are ALWAYS open to idea (or code) donations!

### Code to be copy pasted

While CashAddrJS, a really famous library, uses 10 KB of code to encode Cash Address, our tiny code (1.09 KB when minified) can do it much faster!

Copy paste this code to encode an Cash Address:

```javascript
// Copyright (c) 2018 DesWurstes
// MIT LICENSE

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

function craftCashAddress(kind, addressHash, mainNet, withPrefix) {
  var payload = packCashAddressData(kind, addressHash);
  if (mainNet === true) {
    var expandPrefix = [2, 9, 20, 3, 15, 9, 14, 3, 1, 19, 8, 0];
  } else {
    var expandPrefix = [2, 3, 8, 20, 5, 19, 20, 0];
  }
  var enc = expandPrefix.concat(payload);
  var mod = polyMod(enc.concat([0, 0, 0, 0, 0, 0, 0, 0]));
  var mod_0 = mod[0];
  var mod_1 = mod[1];
  var retChecksum = new Array(8);
  for (var i = 7; i > 5; i--) {
    retChecksum[i] = mod_1 & 31;
    mod_1 >>>= 5;
    mod_1 |= (mod_0 & 31) << 27;
    mod_0 >>>= 5;
  }
  for (; i > 0; i--) {
    retChecksum[i] = mod_1 & 31;
    mod_1 >>>= 5;
  }
  retChecksum[0] = mod_1;
  var combined = payload.concat(retChecksum);
  var ret = "";
  if (withPrefix) {
 		if (mainNet == true) {
    	ret = "bitcoincash:";
  		} else {
    	ret = "bchtest:";
  	}
  }
  for (var i = 0; i < combined.length; i++) {
    ret = ret.concat(CHARSET[combined[i]]);
  }
  return ret
}

function polyMod(v) {
  var c_0 = 0;
  var c_1 = 1;
  var c0 = 0;
  for (var i = 0; i < v.length; i++) {
    c0 = c_0 >>> 3;
    c_0 = c_0 & 7;
    c_0 = (c_0 << 5) | (c_1 >>> 27);
    c_1 &= 0x07ffffff;
    c_1 <<= 5;
    c_1 ^= v[i];
    if (c0 === 0) {
      continue;
    }
    if (c0 & 1) {
      c_0 ^= 0x98;
      c_1 ^= 0xf2bc8e61;
    }
    if (c0 & 2) {
      c_0 ^= 0x79;
      c_1 ^= 0xb76d99e2;
    }
    if (c0 & 4) {
      c_0 ^= 0xf3;
      c_1 ^= 0x3e5fb3c4;
    }
    if (c0 & 8) {
      c_0 ^= 0xae;
      c_1 ^= 0x2eabe2a8;
    }
    if (c0 & 16) {
      c_0 ^= 0x1e;
      c_1 ^= 0x4f43e470;
    }
  }
  return [c_0, c_1 ^ 1];
}

function packCashAddressData(addressType, addressHash) {
  var versionByte = addressType << 3;
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
      return [];
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
    return [];
  }
  return ret;
}
```
