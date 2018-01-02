/* https://github.com/dchest/fast-sha256-js/blob/master/LICENSE

 This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org> */

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
var CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"
document.getElementsByClassName('btn btn-outline-primary btn-lg btn-block')[0].onclick = function() {
  document.getElementById('addressToTranslate').value = ""
  document.getElementById('resultAddressBlock').style.display = 'none'
  document.getElementById('resultAddress').value = ""
}
document.getElementById('addressToTranslate').oninput = function() {
  input = document.getElementById('addressToTranslate').value
	if (input[11] == ':' && input.length == 54 && (input[12] == 'q' || input[12] == 'p')) {
    for (var i = 0; i < 11; i++) {
      if (input[i] != "bitcoincash"[i]) {
        cleanResultAddress()
        return
      }
    }
		parseAndConvertCashAddress("bitcoincash", input.slice(12))
	} else if (input[0] == '1' || input[0] == '3' && input.length > 25 && input.length < 35) {
    console.log("old address")
		parseAndConvertOldAddress(input)
	} else if ((input[0] == 'q' || input[0] == 'p') && input.length == 42) {
		parseAndConvertCashAddress("bitcoincash", input)
	} else if (input[7] == ':' && input.length == 50 && (input[8] == 'q' || input[8] == 'p')) {
    for (var i = 0; i < 7; i++) {
      if (input[i] != "bchtest"[i]) {
        cleanResultAddress()
        return
      }
    }
		parseAndConvertCashAddress("bchtest", input.slice(8))
	} else if (input[11] == ':' && input.length == 54 && (input[12] == 'Q' || input[12] == 'P')) {
    for (var i = 0; i < 11; i++) {
      if (input[i] != "BITCOINCASH"[i]) {
        cleanResultAddress()
        return
      }
    }
		parseAndConvertOldAddress(input.toLowerCase())

		// Sorry! I think uppercase testnet addresses won't be used!
	} else if (input[0] == 'm' || input[0] == 'n' || input[0] == '2') {
		parseAndConvertOldAddress(input)
	} else if ((input[0] == 'C' || input[0] == 'H') && input.length > 25 && input.length < 36) {
		parseAndConvertOldAddress(input)
	} else {
		cleanResultAddress()
	}
}

function parseAndConvertCashAddress(prefix, payloadString) {
	// PolyMod(append(ExpandPrefix("bitcoincash"), payload...)) != 0
	//payload := []byte(payloadString)
	var payloadUnparsed = []
  var CHARSET_MAP = {"q": 0, "p": 1, "z": 2, "r": 3, "y": 4, "9": 5, "x": 6, "8": 7, "g": 8, "f": 9, "2": 10, "t": 11,
  "v": 12, "d": 13, "w": 14, "0": 15, "s": 16, "3": 17, "j": 18, "n": 19, "5": 20, "4": 21, "k": 22, "h": 23,
  "c": 24, "e": 25, "6": 26, "m": 27, "u": 28, "a": 29, "7": 30, "l": 31}
  for (var i = 0; i < payloadString.length; i++) {
    payloadUnparsed.push(CHARSET_MAP[payloadString[i]])
  }
	var expandPrefix = []
	// func ExpandPrefix(prefix string) []byte {
	// ret := make(data, len(prefix) + 1)
	// for i := 0; i < len(prefix); i++ {
	//	ret[i] = byte(prefix[i]) & 0x1f;
	// }
	// ret[len(prefix)] = 0;
	// return ret;
	// }
	// https://play.golang.org/p/NMR2ImCmdpZ
	var netType = true
	if (prefix == "bitcoincash") {
		expandPrefix = [2, 9, 20, 3, 15, 9, 14, 3, 1, 19, 8, 0]
	} else if (prefix == "bchtest") {
		expandPrefix = [2, 3, 8, 20, 5, 19, 20, 0]
		netType = false
	} else {
		cleanResultAddress()
		return
	}
  var polymodInput = expandPrefix.concat(payloadUnparsed)
  polymodResult = polyMod(polymodInput)
  /*for (var i = 0; i < polymodResult.length; i++) {
    if (polymodResult[i] != 0) {
      console.log("checksum doesn't match")
      cleanResultAddress()
      return
    }
  }*/
	// Also drop the checsum
	// TODO: Fix the range
	var payload = convertBits(payloadUnparsed.slice(0,-8), 5, 8, false)
	if (payload.length == 0) {
		cleanResultAddress()
		return
	}
	var addressType = payload[0] >> 3 // 0 or 1
	craftOldAddress(addressType, payload.slice(1,21), netType)
}

function craftOldAddress(kind, addressHash, netType) {
	if (netType) {
		if (kind == 0) {
			CheckEncodeBase58(addressHash, 0x00)
		} else {
			CheckEncodeBase58(addressHash, 0x05)
		}
	} else {
		if (kind == 0) {
			CheckEncodeBase58(addressHash, 0x6f)
		} else {
			CheckEncodeBase58(addressHash, 0xc4)
		}
	}
}

function CheckEncodeBase58(input, version) {
  var b = []
	// b := make([]byte, 0, 1+len(input)+4)
	b.push(version)
	b = b.concat(input)
	var h = sha256(Uint8Array.from(b))
	var h2 = sha256(h)
	//	fmt.Println("%x %x %v", checksum, []byte(h2[:4]), len(checksum))
  b = b.concat(Array.from(h2).slice(0,4))
	//fmt.Println("%x", b[len(b)-4:])
	//println(js.Global.Get("bs58").Call("encode", b).String())
  document.getElementById('resultAddress').value = EncodeBase58Simplified(b)
  document.getElementById('resultAddressBlock').style.display = 'block'
	//println(EncodeBase58(b))
}

function EncodeBase58Simplified(b) {
	// var bigRadix = big.NewInt(58)
	// var bigZero = big.NewInt(0)
	var alphabetIdx0 = 0
	var alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
	var digits = [0]
	/*for (var i = 0; i < b.length; i++) {
		var carry = b[i]
		for (var j = 0; j < digits.length; j++) {
			carry += digits[j] << 8
      if (isNaN(digits[j])) {
        alert(i)
        alert(j)
      }
			digits[j] = carry % 58
			carry = (carry / 58) | 0
		}
		while (carry > 0) {
      digits.push(carry%58)
			carry = (carry / 58) | 0
		}
	}*/
  for (var i = 0; i < b.length; i++) {
		for (var j = 0, carry = b[i]; j < digits.length; j++) {
			carry += digits[j] << 8
      if (isNaN(digits[j])) {
        alert(i)
        alert(j)
      }
			digits[j] = carry % 58
			carry = (carry / 58) | 0
		}
		while (carry > 0) {
      digits.push(carry%58)
			carry = (carry / 58) | 0
		}
	}
	var answer = ""
	// leading zero bytes
  for (var i = 0; i < b.length; i++) {
    if (b[i] != 0) {
      break
    }
    //digits.push(alphabetIdx0)
    answer = answer.concat("1")
  }
	// reverse
	for (var t = digits.length - 1; t >= 0; t--) {
    console.log(alphabet[digits[t]])
    answer = answer.concat(alphabet[digits[t]])
    //alert(alphabet[digits[t]])
    //alert(digits[t])
	}
	return answer
}

function parseAndConvertOldAddress(oldAddress) {
	// var ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
	// ALPHABET_MAP := make(map[rune]uint8)
	// for i, e := range ALPHABET {
	// 	ALPHABET_MAP[e] = uint8(i)
	// }
	// fmt.Println(ALPHABET_MAP)
	var ALPHABET_MAP = {86: 28, 100: 36, 118: 53, 50: 1, 54: 5, 57: 8, 71: 15,
		74: 17, 66: 10, 77: 20, 99: 35, 75: 18, 111: 46, 112: 47, 117: 52, 52: 3, 83: 25, 113: 48,
		67: 11, 68: 12, 98: 34, 104: 40, 121: 56, 85: 27, 122: 57, 109: 44, 115: 50, 56: 7, 72: 16,
		90: 32, 97: 33, 102: 38, 76: 19, 84: 26, 107: 43, 78: 21, 81: 23, 88: 30, 101: 37, 65: 9,
		51: 2, 103: 39, 106: 42, 116: 51, 49: 0, 53: 4, 82: 24, 105: 41, 114: 49, 70: 14, 55: 6,
		69: 13, 87: 29, 89: 31, 120: 55, 80: 22, 110: 45, 119: 54}

	var bytes = [0]
	for (var i = 0; i < oldAddress.length; i++) {
		var value = ALPHABET_MAP[oldAddress.charCodeAt(i)]
    if (value == undefined) {
      console.log("undefined value")
    }
		if (value == 0 && oldAddress[i] != '1') {
      console.log("kndw")
			cleanResultAddress()
			return
		}
		var carry = value
		for (var j = 0; j < bytes.length; j++) {
			carry += bytes[j] * 58
			bytes[j] = carry & 0xff
			carry = carry >> 8
		}
		while (carry > 0) {
			bytes.push(carry&0xff)
			carry = carry >> 8
		}
	}
console.log(bytes.length)
	var numZeros = 0
	for (numZeros = 0; numZeros < oldAddress.length; numZeros++) {
		if (oldAddress[numZeros] != '1') {
			break
		}
	}
  var val = []
  for (var i = 0; i < numZeros + bytes.length; i++) {
    val.push(0)
  }
  for (var i = 0; i < bytes.length; i++) {
    val[i] = bytes[i]
  }

	if (val.length < 5) {
		cleanResultAddress()
		return
	}
  console.log("cp1")
	var answer = new Array()
	for (var t = val.length - 1; t >= 0; t--) {
		answer.push(val[t])
	}
	var version = answer[0]
	var h = sha256(Uint8Array.from(answer.slice(0,-4)))
	var h2 = sha256(h)
	if (h2[0] != answer[answer.length-4] || h2[1] != answer[answer.length-3] || h2[2] != answer[answer.length-2] || h2[3] != answer[answer.length-1]) {
    console.log("checksum doesn't match!")
		cleanResultAddress()
		return
	}
	var payload = answer.slice(1, answer.length-4)
	if (version == 0x00) {
		craftCashAddress(0, payload, true)
	} else if (version == 0x05) {
		craftCashAddress(1, payload, true)
	} else if (version == 0x6f) {
		craftCashAddress(0, payload, false)
	} else if (version == 0xc4) {
		craftCashAddress(1, payload, false)
	} else if (version == 0x1c) {
		craftCashAddress(0, payload, true)
	} else if (version == 0x28) {
		craftCashAddress(1, payload, true)
	} else {
		cleanResultAddress()
	}
}

function packCashAddressData(addressType, addressHash) {
	// Pack addr data with version byte.
	var versionByte = addressType << 3
	var encodedSize = (addressHash.length - 20) / 4
	if ((addressHash.length-20)%4 != 0) {
		return []
	}
	if (encodedSize < 0 || encodedSize > 8) {
		return []
	}
	versionByte |= encodedSize
	var addressHashUint = []
  for (var i = 0; i < addressHash.length; i++) {
    addressHashUint.push(addressHash[i])
  }
  var data = [versionByte].concat(addressHashUint)
	return convertBits(data, 8, 5, true)
}

function convertBits(data, fromBits, tobits, pad) {
	// General power-of-2 base conversion.
	var acc = 0
	var bits = 0
	var ret = []
	var maxv = (1 << tobits) - 1
	var maxAcc = (1 << (fromBits + tobits - 1)) - 1
  for (var i = 0; i < data.length; i++) {
    var value = data[i]
    if (value < 0 || (value >> fromBits) !== 0) {
      return null;
    }
    acc = ((acc << fromBits) | value) & maxAcc
    bits += fromBits
    while (bits >= tobits) {
      bits -= tobits
      ret.push((acc>>bits)&maxv)
    }
  }
	if (pad) {
		if (bits > 0) {
      ret.push((acc<<(tobits-bits))&maxv)
		}
	} else if (bits >= fromBits || ((acc<<(tobits-bits))&maxv) != 0) {
		return []
	}
	return ret
}

function craftCashAddress(kind, addressHash, netType) {
	var payload = packCashAddressData(kind, addressHash)
	//checksum := CreateChecksum(prefix, payload)
	if (payload.length == 0) {
		cleanResultAddress()
		return
	}
  console.log(payload.length) // 34
  console.log("cp2")
	// func ExpandPrefix(prefix string) []byte {
	// ret := make(data, len(prefix) + 1)
	// for i := 0; i < len(prefix); i++ {
	//	ret[i] = byte(prefix[i]) & 0x1f;
	// }
	// ret[len(prefix)] = 0;
	// return ret;
	// }
	// https://play.golang.org/p/NMR2ImCmdpZ
	var expandPrefix = []
	if (netType == true) {
		expandPrefix = [2, 9, 20, 3, 15, 9, 14, 3, 1, 19, 8, 0]
	} else {
		expandPrefix = [2, 3, 8, 20, 5, 19, 20, 0]
	}
  enc = expandPrefix.concat(payload)
	// Append 8 zeroes.
	/*enc = enc.concat([0, 0, 0, 0, 0, 0, 0, 0])
	// Determine what to XOR into those 8 zeroes.
	var mod = PolyMod(enc)
	var retChecksum = [0,0,0,0,0,0,0,0]
	for i := 0; i < 8; i++ {
		// Convert the 5-bit groups in mod to checksum values.
		retChecksum[i] = byte((mod >> uint(5*(7-i))) & 0x1f)
	}*/
  //var toMod = getAsBitArray(enc.concat([0,0,0,0,0,0,0,0]))
  console.log("ok")
  var mod = polyMod(enc.concat([0,0,0,0,0,0,0,0]))
  var retChecksum = []
  for (var i = 0; i < 8; i++) {
    // Convert the 5-bit groups in mod to checksum values.
    // retChecksum[i] = (mod >> uint(5*(7-i))) & 0x1f
    retChecksum[i] = getAs5bitArray((rShift(mod, 5*(7-i))).slice(-5))[0]
    console.log((rShift(mod, 5*(7-i))).slice(-5))
  }
  console.log(mod/*.slice(-5)*/)
	var combined = payload.concat(retChecksum)
  console.log(retChecksum)
	var ret = ""
	if (netType == true) {
		ret = "bitcoincash:"
	} else {
		ret = "bchtest:"
	}
  for (var i = 0; i < combined.length; i++) {
    ret = ret.concat(CHARSET[combined[i]])
  }
	if (ret.length == 54 || ret.length == 50) {
    document.getElementById('resultAddress').value = ret
    document.getElementById('resultAddressBlock').style.display = 'block'
	} else {
		cleanResultAddress()
	}
}

function cleanResultAddress() {
  document.getElementById('resultAddress').value = ""
  document.getElementById('resultAddressBlock').style.display = "none"
}

!function(t,e){var i={};!function(t){"use strict";function e(t,e,i,r,n){for(var h,f,a,o,u,d,p,c,b,g,l,y,v;n>=64;){for(h=e[0],f=e[1],a=e[2],o=e[3],u=e[4],d=e[5],p=e[6],c=e[7],g=0;g<16;g++)l=r+4*g,t[g]=(255&i[l])<<24|(255&i[l+1])<<16|(255&i[l+2])<<8|255&i[l+3];for(g=16;g<64;g++)b=t[g-2],y=(b>>>17|b<<15)^(b>>>19|b<<13)^b>>>10,b=t[g-15],v=(b>>>7|b<<25)^(b>>>18|b<<14)^b>>>3,t[g]=(y+t[g-7]|0)+(v+t[g-16]|0);for(g=0;g<64;g++)y=(((u>>>6|u<<26)^(u>>>11|u<<21)^(u>>>25|u<<7))+(u&d^~u&p)|0)+(c+(s[g]+t[g]|0)|0)|0,v=((h>>>2|h<<30)^(h>>>13|h<<19)^(h>>>22|h<<10))+(h&f^h&a^f&a)|0,c=p,p=d,d=u,u=o+y|0,o=a,a=f,f=h,h=y+v|0;e[0]+=h,e[1]+=f,e[2]+=a,e[3]+=o,e[4]+=u,e[5]+=d,e[6]+=p,e[7]+=c,r+=64,n-=64}return r}function i(t){var e=(new r).update(t),i=e.digest();return e.clean(),i}t.__esModule=!0,t.digestLength=32,t.blockSize=64;var s=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);var r=function(){function i(){this.digestLength=t.digestLength,this.blockSize=t.blockSize,this.state=new Int32Array(8),this.temp=new Int32Array(64),this.buffer=new Uint8Array(128),this.bufferLength=0,this.bytesHashed=0,this.finished=!1,this.reset()}return i.prototype.reset=function(){return this.state[0]=1779033703,this.state[1]=3144134277,this.state[2]=1013904242,this.state[3]=2773480762,this.state[4]=1359893119,this.state[5]=2600822924,this.state[6]=528734635,this.state[7]=1541459225,this.bufferLength=0,this.bytesHashed=0,this.finished=!1,this},i.prototype.clean=function(){for(t=0;t<this.buffer.length;t++)this.buffer[t]=0;for(var t=0;t<this.temp.length;t++)this.temp[t]=0;this.reset()},i.prototype.update=function(t,i){if(void 0===i&&(i=t.length),this.finished)throw new Error("SHA256: can't update because hash was finished.");var s=0;if(this.bytesHashed+=i,this.bufferLength>0){for(;this.bufferLength<64&&i>0;)this.buffer[this.bufferLength++]=t[s++],i--;64===this.bufferLength&&(e(this.temp,this.state,this.buffer,0,64),this.bufferLength=0)}for(i>=64&&(s=e(this.temp,this.state,t,s,i),i%=64);i>0;)this.buffer[this.bufferLength++]=t[s++],i--;return this},i.prototype.finish=function(t){if(!this.finished){var i=this.bytesHashed,s=this.bufferLength,r=i/536870912|0,n=i<<3,h=i%64<56?64:128;this.buffer[s]=128;for(f=s+1;f<h-8;f++)this.buffer[f]=0;this.buffer[h-8]=r>>>24&255,this.buffer[h-7]=r>>>16&255,this.buffer[h-6]=r>>>8&255,this.buffer[h-5]=r>>>0&255,this.buffer[h-4]=n>>>24&255,this.buffer[h-3]=n>>>16&255,this.buffer[h-2]=n>>>8&255,this.buffer[h-1]=n>>>0&255,e(this.temp,this.state,this.buffer,0,h),this.finished=!0}for(var f=0;f<8;f++)t[4*f+0]=this.state[f]>>>24&255,t[4*f+1]=this.state[f]>>>16&255,t[4*f+2]=this.state[f]>>>8&255,t[4*f+3]=this.state[f]>>>0&255;return this},i.prototype.digest=function(){var t=new Uint8Array(this.digestLength);return this.finish(t),t},i.prototype._saveState=function(t){for(var e=0;e<this.state.length;e++)t[e]=this.state[e]},i.prototype._restoreState=function(t,e){for(var i=0;i<this.state.length;i++)this.state[i]=t[i];this.bytesHashed=e,this.finished=!1,this.bufferLength=0},i}();t.Hash=r;var n=function(){function t(t){this.inner=new r,this.outer=new r,this.blockSize=this.inner.blockSize,this.digestLength=this.inner.digestLength;var e=new Uint8Array(this.blockSize);if(t.length>this.blockSize)(new r).update(t).finish(e).clean();else for(i=0;i<t.length;i++)e[i]=t[i];for(i=0;i<e.length;i++)e[i]^=54;this.inner.update(e);for(i=0;i<e.length;i++)e[i]^=106;this.outer.update(e),this.istate=new Uint32Array(8),this.ostate=new Uint32Array(8),this.inner._saveState(this.istate),this.outer._saveState(this.ostate);for(var i=0;i<e.length;i++)e[i]=0}return t.prototype.reset=function(){return this.inner._restoreState(this.istate,this.inner.blockSize),this.outer._restoreState(this.ostate,this.outer.blockSize),this},t.prototype.clean=function(){for(var t=0;t<this.istate.length;t++)this.ostate[t]=this.istate[t]=0;this.inner.clean(),this.outer.clean()},t.prototype.update=function(t){return this.inner.update(t),this},t.prototype.finish=function(t){return this.outer.finished?this.outer.finish(t):(this.inner.finish(t),this.outer.update(t,this.digestLength).finish(t)),this},t.prototype.digest=function(){var t=new Uint8Array(this.digestLength);return this.finish(t),t},t}();t.HMAC=n;t.hash=i,t.default=i;t.hmac=function(t,e){var i=new n(t).update(e),s=i.digest();return i.clean(),s};t.pbkdf2=function(t,e,i,s){for(var r=new n(t),h=r.digestLength,f=new Uint8Array(4),a=new Uint8Array(h),o=new Uint8Array(h),u=new Uint8Array(s),d=0;d*h<s;d++){var p=d+1;f[0]=p>>>24&255,f[1]=p>>>16&255,f[2]=p>>>8&255,f[3]=p>>>0&255,r.reset(),r.update(e),r.update(f),r.finish(o);for(b=0;b<h;b++)a[b]=o[b];for(b=2;b<=i;b++){r.reset(),r.update(o).finish(o);for(var c=0;c<h;c++)a[c]^=o[c]}for(var b=0;b<h&&d*h+b<s;b++)u[d*h+b]=a[b]}for(d=0;d<h;d++)a[d]=o[d]=0;for(d=0;d<4;d++)f[d]=0;return r.clean(),u}}(i);var s=i.default;for(var r in i)s[r]=i[r];"object"==typeof module&&"object"==typeof module.exports?module.exports=s:"function"==typeof define&&define.amd?define(function(){return s}):t.sha256=s}(this);

function and(a, b) {
  var t = a.length - b.length
  c = []
  if (t > 0) {
    b = Array(t).fill(0).concat(b)
  } else if (t < 0) {
    a = Array(-t).fill(0).concat(a)
  }
  for (var i = 0; i < a.length; i++) {
    c.push(((a[i] == b[i]) && (a[i] == 0)) ? 1 : 0)
  }
  return c
}

function xor(a, b) {
  var t = a.length - b.length
  var c = []
  if (t > 0) {
    b = Array(t).fill(0).concat(b)
  } else if (t < 0) {
    a = Array(-t).fill(0).concat(a)
  }
  for (var i = 0; i < a.length; i++) {
    c.push(a[i] != b[i] ? 1 : 0)
  }
  return c
}
// Big endian
function rShift(a, b) {
  if (a.length <= b) {
    return [0]
  }
  if (b == 0) {
    return a
  }
  return a.slice(0, -b)
}

function getAs5bitArray(a) {
  if (a.length % 5 != 0) {
    console.log("returning false")
    console.log(a.length)
    a = Array(5 - (a.length % 5)).fill(0).concat(a)
    console.log(a)
    //return false
  }
  var c = []
  for (var i = 0; i < a.length; i += 5) {
    c.push(16 * a[i] + 8 * a[i + 1] + 4 * a[i + 2] + 2 * a[i + 3] + a[i + 4])
  }
  return c
}

function getAsBitArray(v) {
  if (v[0] >> 5 != 0) {
    console.log("bit error!")
  }
  var c = []
  for (var i = 0; i < v.length; i++) {
    c = c.concat([v >> 4, (v >> 3)&1, (v >> 2)&1, (v >> 1)&1, v&1])
  }
  return c
}

function polyMod(v) {
  var c = [1]
  for (var i = 0; i < v.length; i++) {
    var c0 = rShift(c, 35)
    console.log(c0.length)
    console.log(c.length)
    c = xor(c.slice(c.length - 35, c.length).concat([0,0,0,0,0]), getAsBitArray(v[i]))
    console.log(c.length)
    if (c0.length < 5) {
      c0 = Array(5-c0.length).fill(0).concat(c0)
    } else if (c0.length != 5) {
      console.log("unknown error")
      //console.log(c0.length)
    }
    if (c0[c0.length] != 0) {
      c = xor(c, [1,0,0,1,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,1,1,1,0,0,1,0,0,0,1,1,1,0,0,1,1,0,0,0,0,1])
    }
    if (c0[c0.length-1] != 0) {
      c = xor(c, [1,1,1,1,0,0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,0,1,1,0,0,1,1,1,1,0,0,0,1,0])
    }
    if (c0[c0.length-2] != 0) {
      c = xor(c, [1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,0,1,0,1,1,1,1,1,1,0,1,1,0,0,1,1,1,1,0,0,0,1,0,0])
    }
    if (c0[c0.length-3] != 0) {
      c = xor(c, [1,0,1,0,1,1,1,0,0,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,0,0,0,1,0,1,0,1,0,1,0,0,0])
    }
    if (c0[c0.length-4] != 0) {
      c = xor(c, [1,1,1,1,0,0,1,0,0,1,1,1,1,0,1,0,0,0,0,1,1,1,1,1,0,0,1,0,0,0,1,1,1,0,0,0,0])
    }
  }
  return xor(c, [1])
}

// document.write(getHexAsBitArray("07ffffffff").join(","));
function getHexAsBitArray(v) {
  var c = []
  for (var i = 0; i < v.length; i++) {
    if (v[i] == "0") {
      c = c.concat([0,0,0,0])
    } else if (v[i] == "1") {
      c = c.concat([0,0,0,1])
    } else if (v[i] == "2") {
      c = c.concat([0,0,1,0])
    } else if (v[i] == "3") {
      c = c.concat([0,0,1,1])
    } else if (v[i] == "4") {
      c = c.concat([0,1,0,0])
    } else if (v[i] == "5") {
      c = c.concat([0,1,0,1])
    } else if (v[i] == "6") {
      c = c.concat([0,1,1,0])
    } else if (v[i] == "7") {
      c = c.concat([0,1,1,1])
    } else if (v[i] == "8") {
      c = c.concat([1,0,0,0])
    } else if (v[i] == "9") {
      c = c.concat([1,0,0,1])
    } else if (v[i] == "A") {
      c = c.concat([1,0,1,0])
    } else if (v[i] == "B") {
      c = c.concat([1,0,1,1])
    } else if (v[i] == "C") {
      c = c.concat([1,1,0,0])
    } else if (v[i] == "D") {
      c = c.concat([1,1,0,1])
    } else if (v[i] == "E") {
      c = c.concat([1,1,1,0])
    } else if (v[i] == "F") {
      c = c.concat([1,1,1,1])
    }
  }
  return c
}
