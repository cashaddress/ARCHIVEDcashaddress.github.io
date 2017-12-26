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
var polymodInput = new Uint8Array()
var isPolymodCorrect = false
var polymodAppend = new Uint8Array()
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
  for (var i = 0; i < payloadString.length; i++) {
    for (var t = 0; t < CHARSET.length; t++) {
      if (t == payloadString[i]) {
        payloadUnparsed.push(t)
      }
    }
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
  polymodInput = expandPrefix.concat(payloadUnparsed)
	if (!isPolymodCorrect) {
		cleanResultAddress()
		return
	}
	// Also drop the checsum
	// TODO: Fix the range
	var payload = convertBits(payloadUnparsed.slice(0, payloadUnparsed.length-8), 5, 8, false)
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
	var h = sha256_bytes(b)
	var h2 = sha256_bytes(h)
	//	fmt.Println("%x %x %v", checksum, []byte(h2[:4]), len(checksum))
  b = b.concat(h2.slice(0,4))
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
	for (var i = 0; i < b.length; i++) {
		var carry = b[i]
		for (var j = 0; j < digits.length; j++) {
			carry += digits[j] << 8
			digits[j] = carry % 58
			carry = (carry / 58) | 0
		}
		while (carry > 0) {
      digits.push(carry%58)
			carry = (carry / 58) | 0
		}
	}

	// leading zero bytes
  for (var i = 0; i < b.length; i++) {
    if (b[i] != 0) {
      break
    }
    digits.push(alphabetIdx0)
  }

	// reverse
	var answer = ""
	for (var t = digits.length - 1; t >= 0; t--) {
		answer.push(alphabet[digits[t]])
	}
	return string(answer)
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
		var value = ALPHABET_MAP[oldAddress[i]]
		if (value == 0 && oldAddress[i] != '1') {
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
	var answer = new Array()
	for (var t = val.length - 1; t >= 0; t--) {
		answer.push(val[t])
	}
	var version = answer[0]
	var h = sha256_bytes(answer.slice(0,-4))
	var h2 = sha256_bytes(h)
	if (h2[0] != answer[answer.length-4] || h2[1] != answer[answer.length-3] || h2[2] != answer[answer.length-2] || h2[3] != answer[answer.length-1]) {
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
  polymodInput = enc
  polyMod()
	var combined = payload.concat(polymodAppend)
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
    document.getElementById('resultAddressBlock').style.display = block
	} else {
		cleanResultAddress()
	}
}

function cleanResultAddress() {
  document.getElementById('resultAddress').value = ""
  document.getElementById('resultAddressBlock').style.display = "none"
}

function sha256_asm(n,i,r){"use asm";var f=0,t=0,u=0,e=0,c=0,o=0,a=0,s=0,h=0,v=0;var _=0,m=0,l=0,w=0,b=0,k=0,p=0,d=0,g=0,y=0,A=0,U=0,j=0,q=0,x=0,z=0;var B=new n.Uint8Array(r);function C(n,i,r,h,v,_,m,l,w,b,k,p,d,g,y,A){n=n|0;i=i|0;r=r|0;h=h|0;v=v|0;_=_|0;m=m|0;l=l|0;w=w|0;b=b|0;k=k|0;p=p|0;d=d|0;g=g|0;y=y|0;A=A|0;var U=0,j=0,q=0,x=0,z=0,B=0,C=0,D=0;U=f;j=t;q=u;x=e;z=c;B=o;C=a;D=s;D=n+D+(z>>>6^z>>>11^z>>>25^z<<26^z<<21^z<<7)+(C^z&(B^C))+0x428a2f98|0;x=x+D|0;D=D+(U&j^q&(U^j))+(U>>>2^U>>>13^U>>>22^U<<30^U<<19^U<<10)|0;C=i+C+(x>>>6^x>>>11^x>>>25^x<<26^x<<21^x<<7)+(B^x&(z^B))+0x71374491|0;q=q+C|0;C=C+(D&U^j&(D^U))+(D>>>2^D>>>13^D>>>22^D<<30^D<<19^D<<10)|0;B=r+B+(q>>>6^q>>>11^q>>>25^q<<26^q<<21^q<<7)+(z^q&(x^z))+0xb5c0fbcf|0;j=j+B|0;B=B+(C&D^U&(C^D))+(C>>>2^C>>>13^C>>>22^C<<30^C<<19^C<<10)|0;z=h+z+(j>>>6^j>>>11^j>>>25^j<<26^j<<21^j<<7)+(x^j&(q^x))+0xe9b5dba5|0;U=U+z|0;z=z+(B&C^D&(B^C))+(B>>>2^B>>>13^B>>>22^B<<30^B<<19^B<<10)|0;x=v+x+(U>>>6^U>>>11^U>>>25^U<<26^U<<21^U<<7)+(q^U&(j^q))+0x3956c25b|0;D=D+x|0;x=x+(z&B^C&(z^B))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;q=_+q+(D>>>6^D>>>11^D>>>25^D<<26^D<<21^D<<7)+(j^D&(U^j))+0x59f111f1|0;C=C+q|0;q=q+(x&z^B&(x^z))+(x>>>2^x>>>13^x>>>22^x<<30^x<<19^x<<10)|0;j=m+j+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(U^C&(D^U))+0x923f82a4|0;B=B+j|0;j=j+(q&x^z&(q^x))+(q>>>2^q>>>13^q>>>22^q<<30^q<<19^q<<10)|0;U=l+U+(B>>>6^B>>>11^B>>>25^B<<26^B<<21^B<<7)+(D^B&(C^D))+0xab1c5ed5|0;z=z+U|0;U=U+(j&q^x&(j^q))+(j>>>2^j>>>13^j>>>22^j<<30^j<<19^j<<10)|0;D=w+D+(z>>>6^z>>>11^z>>>25^z<<26^z<<21^z<<7)+(C^z&(B^C))+0xd807aa98|0;x=x+D|0;D=D+(U&j^q&(U^j))+(U>>>2^U>>>13^U>>>22^U<<30^U<<19^U<<10)|0;C=b+C+(x>>>6^x>>>11^x>>>25^x<<26^x<<21^x<<7)+(B^x&(z^B))+0x12835b01|0;q=q+C|0;C=C+(D&U^j&(D^U))+(D>>>2^D>>>13^D>>>22^D<<30^D<<19^D<<10)|0;B=k+B+(q>>>6^q>>>11^q>>>25^q<<26^q<<21^q<<7)+(z^q&(x^z))+0x243185be|0;j=j+B|0;B=B+(C&D^U&(C^D))+(C>>>2^C>>>13^C>>>22^C<<30^C<<19^C<<10)|0;z=p+z+(j>>>6^j>>>11^j>>>25^j<<26^j<<21^j<<7)+(x^j&(q^x))+0x550c7dc3|0;U=U+z|0;z=z+(B&C^D&(B^C))+(B>>>2^B>>>13^B>>>22^B<<30^B<<19^B<<10)|0;x=d+x+(U>>>6^U>>>11^U>>>25^U<<26^U<<21^U<<7)+(q^U&(j^q))+0x72be5d74|0;D=D+x|0;x=x+(z&B^C&(z^B))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;q=g+q+(D>>>6^D>>>11^D>>>25^D<<26^D<<21^D<<7)+(j^D&(U^j))+0x80deb1fe|0;C=C+q|0;q=q+(x&z^B&(x^z))+(x>>>2^x>>>13^x>>>22^x<<30^x<<19^x<<10)|0;j=y+j+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(U^C&(D^U))+0x9bdc06a7|0;B=B+j|0;j=j+(q&x^z&(q^x))+(q>>>2^q>>>13^q>>>22^q<<30^q<<19^q<<10)|0;U=A+U+(B>>>6^B>>>11^B>>>25^B<<26^B<<21^B<<7)+(D^B&(C^D))+0xc19bf174|0;z=z+U|0;U=U+(j&q^x&(j^q))+(j>>>2^j>>>13^j>>>22^j<<30^j<<19^j<<10)|0;n=(i>>>7^i>>>18^i>>>3^i<<25^i<<14)+(y>>>17^y>>>19^y>>>10^y<<15^y<<13)+n+b|0;D=n+D+(z>>>6^z>>>11^z>>>25^z<<26^z<<21^z<<7)+(C^z&(B^C))+0xe49b69c1|0;x=x+D|0;D=D+(U&j^q&(U^j))+(U>>>2^U>>>13^U>>>22^U<<30^U<<19^U<<10)|0;i=(r>>>7^r>>>18^r>>>3^r<<25^r<<14)+(A>>>17^A>>>19^A>>>10^A<<15^A<<13)+i+k|0;C=i+C+(x>>>6^x>>>11^x>>>25^x<<26^x<<21^x<<7)+(B^x&(z^B))+0xefbe4786|0;q=q+C|0;C=C+(D&U^j&(D^U))+(D>>>2^D>>>13^D>>>22^D<<30^D<<19^D<<10)|0;r=(h>>>7^h>>>18^h>>>3^h<<25^h<<14)+(n>>>17^n>>>19^n>>>10^n<<15^n<<13)+r+p|0;B=r+B+(q>>>6^q>>>11^q>>>25^q<<26^q<<21^q<<7)+(z^q&(x^z))+0x0fc19dc6|0;j=j+B|0;B=B+(C&D^U&(C^D))+(C>>>2^C>>>13^C>>>22^C<<30^C<<19^C<<10)|0;h=(v>>>7^v>>>18^v>>>3^v<<25^v<<14)+(i>>>17^i>>>19^i>>>10^i<<15^i<<13)+h+d|0;z=h+z+(j>>>6^j>>>11^j>>>25^j<<26^j<<21^j<<7)+(x^j&(q^x))+0x240ca1cc|0;U=U+z|0;z=z+(B&C^D&(B^C))+(B>>>2^B>>>13^B>>>22^B<<30^B<<19^B<<10)|0;v=(_>>>7^_>>>18^_>>>3^_<<25^_<<14)+(r>>>17^r>>>19^r>>>10^r<<15^r<<13)+v+g|0;x=v+x+(U>>>6^U>>>11^U>>>25^U<<26^U<<21^U<<7)+(q^U&(j^q))+0x2de92c6f|0;D=D+x|0;x=x+(z&B^C&(z^B))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;_=(m>>>7^m>>>18^m>>>3^m<<25^m<<14)+(h>>>17^h>>>19^h>>>10^h<<15^h<<13)+_+y|0;q=_+q+(D>>>6^D>>>11^D>>>25^D<<26^D<<21^D<<7)+(j^D&(U^j))+0x4a7484aa|0;C=C+q|0;q=q+(x&z^B&(x^z))+(x>>>2^x>>>13^x>>>22^x<<30^x<<19^x<<10)|0;m=(l>>>7^l>>>18^l>>>3^l<<25^l<<14)+(v>>>17^v>>>19^v>>>10^v<<15^v<<13)+m+A|0;j=m+j+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(U^C&(D^U))+0x5cb0a9dc|0;B=B+j|0;j=j+(q&x^z&(q^x))+(q>>>2^q>>>13^q>>>22^q<<30^q<<19^q<<10)|0;l=(w>>>7^w>>>18^w>>>3^w<<25^w<<14)+(_>>>17^_>>>19^_>>>10^_<<15^_<<13)+l+n|0;U=l+U+(B>>>6^B>>>11^B>>>25^B<<26^B<<21^B<<7)+(D^B&(C^D))+0x76f988da|0;z=z+U|0;U=U+(j&q^x&(j^q))+(j>>>2^j>>>13^j>>>22^j<<30^j<<19^j<<10)|0;w=(b>>>7^b>>>18^b>>>3^b<<25^b<<14)+(m>>>17^m>>>19^m>>>10^m<<15^m<<13)+w+i|0;D=w+D+(z>>>6^z>>>11^z>>>25^z<<26^z<<21^z<<7)+(C^z&(B^C))+0x983e5152|0;x=x+D|0;D=D+(U&j^q&(U^j))+(U>>>2^U>>>13^U>>>22^U<<30^U<<19^U<<10)|0;b=(k>>>7^k>>>18^k>>>3^k<<25^k<<14)+(l>>>17^l>>>19^l>>>10^l<<15^l<<13)+b+r|0;C=b+C+(x>>>6^x>>>11^x>>>25^x<<26^x<<21^x<<7)+(B^x&(z^B))+0xa831c66d|0;q=q+C|0;C=C+(D&U^j&(D^U))+(D>>>2^D>>>13^D>>>22^D<<30^D<<19^D<<10)|0;k=(p>>>7^p>>>18^p>>>3^p<<25^p<<14)+(w>>>17^w>>>19^w>>>10^w<<15^w<<13)+k+h|0;B=k+B+(q>>>6^q>>>11^q>>>25^q<<26^q<<21^q<<7)+(z^q&(x^z))+0xb00327c8|0;j=j+B|0;B=B+(C&D^U&(C^D))+(C>>>2^C>>>13^C>>>22^C<<30^C<<19^C<<10)|0;p=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(b>>>17^b>>>19^b>>>10^b<<15^b<<13)+p+v|0;z=p+z+(j>>>6^j>>>11^j>>>25^j<<26^j<<21^j<<7)+(x^j&(q^x))+0xbf597fc7|0;U=U+z|0;z=z+(B&C^D&(B^C))+(B>>>2^B>>>13^B>>>22^B<<30^B<<19^B<<10)|0;d=(g>>>7^g>>>18^g>>>3^g<<25^g<<14)+(k>>>17^k>>>19^k>>>10^k<<15^k<<13)+d+_|0;x=d+x+(U>>>6^U>>>11^U>>>25^U<<26^U<<21^U<<7)+(q^U&(j^q))+0xc6e00bf3|0;D=D+x|0;x=x+(z&B^C&(z^B))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;g=(y>>>7^y>>>18^y>>>3^y<<25^y<<14)+(p>>>17^p>>>19^p>>>10^p<<15^p<<13)+g+m|0;q=g+q+(D>>>6^D>>>11^D>>>25^D<<26^D<<21^D<<7)+(j^D&(U^j))+0xd5a79147|0;C=C+q|0;q=q+(x&z^B&(x^z))+(x>>>2^x>>>13^x>>>22^x<<30^x<<19^x<<10)|0;y=(A>>>7^A>>>18^A>>>3^A<<25^A<<14)+(d>>>17^d>>>19^d>>>10^d<<15^d<<13)+y+l|0;j=y+j+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(U^C&(D^U))+0x06ca6351|0;B=B+j|0;j=j+(q&x^z&(q^x))+(q>>>2^q>>>13^q>>>22^q<<30^q<<19^q<<10)|0;A=(n>>>7^n>>>18^n>>>3^n<<25^n<<14)+(g>>>17^g>>>19^g>>>10^g<<15^g<<13)+A+w|0;U=A+U+(B>>>6^B>>>11^B>>>25^B<<26^B<<21^B<<7)+(D^B&(C^D))+0x14292967|0;z=z+U|0;U=U+(j&q^x&(j^q))+(j>>>2^j>>>13^j>>>22^j<<30^j<<19^j<<10)|0;n=(i>>>7^i>>>18^i>>>3^i<<25^i<<14)+(y>>>17^y>>>19^y>>>10^y<<15^y<<13)+n+b|0;D=n+D+(z>>>6^z>>>11^z>>>25^z<<26^z<<21^z<<7)+(C^z&(B^C))+0x27b70a85|0;x=x+D|0;D=D+(U&j^q&(U^j))+(U>>>2^U>>>13^U>>>22^U<<30^U<<19^U<<10)|0;i=(r>>>7^r>>>18^r>>>3^r<<25^r<<14)+(A>>>17^A>>>19^A>>>10^A<<15^A<<13)+i+k|0;C=i+C+(x>>>6^x>>>11^x>>>25^x<<26^x<<21^x<<7)+(B^x&(z^B))+0x2e1b2138|0;q=q+C|0;C=C+(D&U^j&(D^U))+(D>>>2^D>>>13^D>>>22^D<<30^D<<19^D<<10)|0;r=(h>>>7^h>>>18^h>>>3^h<<25^h<<14)+(n>>>17^n>>>19^n>>>10^n<<15^n<<13)+r+p|0;B=r+B+(q>>>6^q>>>11^q>>>25^q<<26^q<<21^q<<7)+(z^q&(x^z))+0x4d2c6dfc|0;j=j+B|0;B=B+(C&D^U&(C^D))+(C>>>2^C>>>13^C>>>22^C<<30^C<<19^C<<10)|0;h=(v>>>7^v>>>18^v>>>3^v<<25^v<<14)+(i>>>17^i>>>19^i>>>10^i<<15^i<<13)+h+d|0;z=h+z+(j>>>6^j>>>11^j>>>25^j<<26^j<<21^j<<7)+(x^j&(q^x))+0x53380d13|0;U=U+z|0;z=z+(B&C^D&(B^C))+(B>>>2^B>>>13^B>>>22^B<<30^B<<19^B<<10)|0;v=(_>>>7^_>>>18^_>>>3^_<<25^_<<14)+(r>>>17^r>>>19^r>>>10^r<<15^r<<13)+v+g|0;x=v+x+(U>>>6^U>>>11^U>>>25^U<<26^U<<21^U<<7)+(q^U&(j^q))+0x650a7354|0;D=D+x|0;x=x+(z&B^C&(z^B))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;_=(m>>>7^m>>>18^m>>>3^m<<25^m<<14)+(h>>>17^h>>>19^h>>>10^h<<15^h<<13)+_+y|0;q=_+q+(D>>>6^D>>>11^D>>>25^D<<26^D<<21^D<<7)+(j^D&(U^j))+0x766a0abb|0;C=C+q|0;q=q+(x&z^B&(x^z))+(x>>>2^x>>>13^x>>>22^x<<30^x<<19^x<<10)|0;m=(l>>>7^l>>>18^l>>>3^l<<25^l<<14)+(v>>>17^v>>>19^v>>>10^v<<15^v<<13)+m+A|0;j=m+j+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(U^C&(D^U))+0x81c2c92e|0;B=B+j|0;j=j+(q&x^z&(q^x))+(q>>>2^q>>>13^q>>>22^q<<30^q<<19^q<<10)|0;l=(w>>>7^w>>>18^w>>>3^w<<25^w<<14)+(_>>>17^_>>>19^_>>>10^_<<15^_<<13)+l+n|0;U=l+U+(B>>>6^B>>>11^B>>>25^B<<26^B<<21^B<<7)+(D^B&(C^D))+0x92722c85|0;z=z+U|0;U=U+(j&q^x&(j^q))+(j>>>2^j>>>13^j>>>22^j<<30^j<<19^j<<10)|0;w=(b>>>7^b>>>18^b>>>3^b<<25^b<<14)+(m>>>17^m>>>19^m>>>10^m<<15^m<<13)+w+i|0;D=w+D+(z>>>6^z>>>11^z>>>25^z<<26^z<<21^z<<7)+(C^z&(B^C))+0xa2bfe8a1|0;x=x+D|0;D=D+(U&j^q&(U^j))+(U>>>2^U>>>13^U>>>22^U<<30^U<<19^U<<10)|0;b=(k>>>7^k>>>18^k>>>3^k<<25^k<<14)+(l>>>17^l>>>19^l>>>10^l<<15^l<<13)+b+r|0;C=b+C+(x>>>6^x>>>11^x>>>25^x<<26^x<<21^x<<7)+(B^x&(z^B))+0xa81a664b|0;q=q+C|0;C=C+(D&U^j&(D^U))+(D>>>2^D>>>13^D>>>22^D<<30^D<<19^D<<10)|0;k=(p>>>7^p>>>18^p>>>3^p<<25^p<<14)+(w>>>17^w>>>19^w>>>10^w<<15^w<<13)+k+h|0;B=k+B+(q>>>6^q>>>11^q>>>25^q<<26^q<<21^q<<7)+(z^q&(x^z))+0xc24b8b70|0;j=j+B|0;B=B+(C&D^U&(C^D))+(C>>>2^C>>>13^C>>>22^C<<30^C<<19^C<<10)|0;p=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(b>>>17^b>>>19^b>>>10^b<<15^b<<13)+p+v|0;z=p+z+(j>>>6^j>>>11^j>>>25^j<<26^j<<21^j<<7)+(x^j&(q^x))+0xc76c51a3|0;U=U+z|0;z=z+(B&C^D&(B^C))+(B>>>2^B>>>13^B>>>22^B<<30^B<<19^B<<10)|0;d=(g>>>7^g>>>18^g>>>3^g<<25^g<<14)+(k>>>17^k>>>19^k>>>10^k<<15^k<<13)+d+_|0;x=d+x+(U>>>6^U>>>11^U>>>25^U<<26^U<<21^U<<7)+(q^U&(j^q))+0xd192e819|0;D=D+x|0;x=x+(z&B^C&(z^B))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;g=(y>>>7^y>>>18^y>>>3^y<<25^y<<14)+(p>>>17^p>>>19^p>>>10^p<<15^p<<13)+g+m|0;q=g+q+(D>>>6^D>>>11^D>>>25^D<<26^D<<21^D<<7)+(j^D&(U^j))+0xd6990624|0;C=C+q|0;q=q+(x&z^B&(x^z))+(x>>>2^x>>>13^x>>>22^x<<30^x<<19^x<<10)|0;y=(A>>>7^A>>>18^A>>>3^A<<25^A<<14)+(d>>>17^d>>>19^d>>>10^d<<15^d<<13)+y+l|0;j=y+j+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(U^C&(D^U))+0xf40e3585|0;B=B+j|0;j=j+(q&x^z&(q^x))+(q>>>2^q>>>13^q>>>22^q<<30^q<<19^q<<10)|0;A=(n>>>7^n>>>18^n>>>3^n<<25^n<<14)+(g>>>17^g>>>19^g>>>10^g<<15^g<<13)+A+w|0;U=A+U+(B>>>6^B>>>11^B>>>25^B<<26^B<<21^B<<7)+(D^B&(C^D))+0x106aa070|0;z=z+U|0;U=U+(j&q^x&(j^q))+(j>>>2^j>>>13^j>>>22^j<<30^j<<19^j<<10)|0;n=(i>>>7^i>>>18^i>>>3^i<<25^i<<14)+(y>>>17^y>>>19^y>>>10^y<<15^y<<13)+n+b|0;D=n+D+(z>>>6^z>>>11^z>>>25^z<<26^z<<21^z<<7)+(C^z&(B^C))+0x19a4c116|0;x=x+D|0;D=D+(U&j^q&(U^j))+(U>>>2^U>>>13^U>>>22^U<<30^U<<19^U<<10)|0;i=(r>>>7^r>>>18^r>>>3^r<<25^r<<14)+(A>>>17^A>>>19^A>>>10^A<<15^A<<13)+i+k|0;C=i+C+(x>>>6^x>>>11^x>>>25^x<<26^x<<21^x<<7)+(B^x&(z^B))+0x1e376c08|0;q=q+C|0;C=C+(D&U^j&(D^U))+(D>>>2^D>>>13^D>>>22^D<<30^D<<19^D<<10)|0;r=(h>>>7^h>>>18^h>>>3^h<<25^h<<14)+(n>>>17^n>>>19^n>>>10^n<<15^n<<13)+r+p|0;B=r+B+(q>>>6^q>>>11^q>>>25^q<<26^q<<21^q<<7)+(z^q&(x^z))+0x2748774c|0;j=j+B|0;B=B+(C&D^U&(C^D))+(C>>>2^C>>>13^C>>>22^C<<30^C<<19^C<<10)|0;h=(v>>>7^v>>>18^v>>>3^v<<25^v<<14)+(i>>>17^i>>>19^i>>>10^i<<15^i<<13)+h+d|0;z=h+z+(j>>>6^j>>>11^j>>>25^j<<26^j<<21^j<<7)+(x^j&(q^x))+0x34b0bcb5|0;U=U+z|0;z=z+(B&C^D&(B^C))+(B>>>2^B>>>13^B>>>22^B<<30^B<<19^B<<10)|0;v=(_>>>7^_>>>18^_>>>3^_<<25^_<<14)+(r>>>17^r>>>19^r>>>10^r<<15^r<<13)+v+g|0;x=v+x+(U>>>6^U>>>11^U>>>25^U<<26^U<<21^U<<7)+(q^U&(j^q))+0x391c0cb3|0;D=D+x|0;x=x+(z&B^C&(z^B))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;_=(m>>>7^m>>>18^m>>>3^m<<25^m<<14)+(h>>>17^h>>>19^h>>>10^h<<15^h<<13)+_+y|0;q=_+q+(D>>>6^D>>>11^D>>>25^D<<26^D<<21^D<<7)+(j^D&(U^j))+0x4ed8aa4a|0;C=C+q|0;q=q+(x&z^B&(x^z))+(x>>>2^x>>>13^x>>>22^x<<30^x<<19^x<<10)|0;m=(l>>>7^l>>>18^l>>>3^l<<25^l<<14)+(v>>>17^v>>>19^v>>>10^v<<15^v<<13)+m+A|0;j=m+j+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(U^C&(D^U))+0x5b9cca4f|0;B=B+j|0;j=j+(q&x^z&(q^x))+(q>>>2^q>>>13^q>>>22^q<<30^q<<19^q<<10)|0;l=(w>>>7^w>>>18^w>>>3^w<<25^w<<14)+(_>>>17^_>>>19^_>>>10^_<<15^_<<13)+l+n|0;U=l+U+(B>>>6^B>>>11^B>>>25^B<<26^B<<21^B<<7)+(D^B&(C^D))+0x682e6ff3|0;z=z+U|0;U=U+(j&q^x&(j^q))+(j>>>2^j>>>13^j>>>22^j<<30^j<<19^j<<10)|0;w=(b>>>7^b>>>18^b>>>3^b<<25^b<<14)+(m>>>17^m>>>19^m>>>10^m<<15^m<<13)+w+i|0;D=w+D+(z>>>6^z>>>11^z>>>25^z<<26^z<<21^z<<7)+(C^z&(B^C))+0x748f82ee|0;x=x+D|0;D=D+(U&j^q&(U^j))+(U>>>2^U>>>13^U>>>22^U<<30^U<<19^U<<10)|0;b=(k>>>7^k>>>18^k>>>3^k<<25^k<<14)+(l>>>17^l>>>19^l>>>10^l<<15^l<<13)+b+r|0;C=b+C+(x>>>6^x>>>11^x>>>25^x<<26^x<<21^x<<7)+(B^x&(z^B))+0x78a5636f|0;q=q+C|0;C=C+(D&U^j&(D^U))+(D>>>2^D>>>13^D>>>22^D<<30^D<<19^D<<10)|0;k=(p>>>7^p>>>18^p>>>3^p<<25^p<<14)+(w>>>17^w>>>19^w>>>10^w<<15^w<<13)+k+h|0;B=k+B+(q>>>6^q>>>11^q>>>25^q<<26^q<<21^q<<7)+(z^q&(x^z))+0x84c87814|0;j=j+B|0;B=B+(C&D^U&(C^D))+(C>>>2^C>>>13^C>>>22^C<<30^C<<19^C<<10)|0;p=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(b>>>17^b>>>19^b>>>10^b<<15^b<<13)+p+v|0;z=p+z+(j>>>6^j>>>11^j>>>25^j<<26^j<<21^j<<7)+(x^j&(q^x))+0x8cc70208|0;U=U+z|0;z=z+(B&C^D&(B^C))+(B>>>2^B>>>13^B>>>22^B<<30^B<<19^B<<10)|0;d=(g>>>7^g>>>18^g>>>3^g<<25^g<<14)+(k>>>17^k>>>19^k>>>10^k<<15^k<<13)+d+_|0;x=d+x+(U>>>6^U>>>11^U>>>25^U<<26^U<<21^U<<7)+(q^U&(j^q))+0x90befffa|0;D=D+x|0;x=x+(z&B^C&(z^B))+(z>>>2^z>>>13^z>>>22^z<<30^z<<19^z<<10)|0;g=(y>>>7^y>>>18^y>>>3^y<<25^y<<14)+(p>>>17^p>>>19^p>>>10^p<<15^p<<13)+g+m|0;q=g+q+(D>>>6^D>>>11^D>>>25^D<<26^D<<21^D<<7)+(j^D&(U^j))+0xa4506ceb|0;C=C+q|0;q=q+(x&z^B&(x^z))+(x>>>2^x>>>13^x>>>22^x<<30^x<<19^x<<10)|0;y=(A>>>7^A>>>18^A>>>3^A<<25^A<<14)+(d>>>17^d>>>19^d>>>10^d<<15^d<<13)+y+l|0;j=y+j+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(U^C&(D^U))+0xbef9a3f7|0;B=B+j|0;j=j+(q&x^z&(q^x))+(q>>>2^q>>>13^q>>>22^q<<30^q<<19^q<<10)|0;A=(n>>>7^n>>>18^n>>>3^n<<25^n<<14)+(g>>>17^g>>>19^g>>>10^g<<15^g<<13)+A+w|0;U=A+U+(B>>>6^B>>>11^B>>>25^B<<26^B<<21^B<<7)+(D^B&(C^D))+0xc67178f2|0;z=z+U|0;U=U+(j&q^x&(j^q))+(j>>>2^j>>>13^j>>>22^j<<30^j<<19^j<<10)|0;f=f+U|0;t=t+j|0;u=u+q|0;e=e+x|0;c=c+z|0;o=o+B|0;a=a+C|0;s=s+D|0}function D(n){n=n|0;C(B[n|0]<<24|B[n|1]<<16|B[n|2]<<8|B[n|3],B[n|4]<<24|B[n|5]<<16|B[n|6]<<8|B[n|7],B[n|8]<<24|B[n|9]<<16|B[n|10]<<8|B[n|11],B[n|12]<<24|B[n|13]<<16|B[n|14]<<8|B[n|15],B[n|16]<<24|B[n|17]<<16|B[n|18]<<8|B[n|19],B[n|20]<<24|B[n|21]<<16|B[n|22]<<8|B[n|23],B[n|24]<<24|B[n|25]<<16|B[n|26]<<8|B[n|27],B[n|28]<<24|B[n|29]<<16|B[n|30]<<8|B[n|31],B[n|32]<<24|B[n|33]<<16|B[n|34]<<8|B[n|35],B[n|36]<<24|B[n|37]<<16|B[n|38]<<8|B[n|39],B[n|40]<<24|B[n|41]<<16|B[n|42]<<8|B[n|43],B[n|44]<<24|B[n|45]<<16|B[n|46]<<8|B[n|47],B[n|48]<<24|B[n|49]<<16|B[n|50]<<8|B[n|51],B[n|52]<<24|B[n|53]<<16|B[n|54]<<8|B[n|55],B[n|56]<<24|B[n|57]<<16|B[n|58]<<8|B[n|59],B[n|60]<<24|B[n|61]<<16|B[n|62]<<8|B[n|63])}function E(n){n=n|0;B[n|0]=f>>>24;B[n|1]=f>>>16&255;B[n|2]=f>>>8&255;B[n|3]=f&255;B[n|4]=t>>>24;B[n|5]=t>>>16&255;B[n|6]=t>>>8&255;B[n|7]=t&255;B[n|8]=u>>>24;B[n|9]=u>>>16&255;B[n|10]=u>>>8&255;B[n|11]=u&255;B[n|12]=e>>>24;B[n|13]=e>>>16&255;B[n|14]=e>>>8&255;B[n|15]=e&255;B[n|16]=c>>>24;B[n|17]=c>>>16&255;B[n|18]=c>>>8&255;B[n|19]=c&255;B[n|20]=o>>>24;B[n|21]=o>>>16&255;B[n|22]=o>>>8&255;B[n|23]=o&255;B[n|24]=a>>>24;B[n|25]=a>>>16&255;B[n|26]=a>>>8&255;B[n|27]=a&255;B[n|28]=s>>>24;B[n|29]=s>>>16&255;B[n|30]=s>>>8&255;B[n|31]=s&255}function F(){f=0x6a09e667;t=0xbb67ae85;u=0x3c6ef372;e=0xa54ff53a;c=0x510e527f;o=0x9b05688c;a=0x1f83d9ab;s=0x5be0cd19;h=v=0}function G(n,i,r,_,m,l,w,b,k,p){n=n|0;i=i|0;r=r|0;_=_|0;m=m|0;l=l|0;w=w|0;b=b|0;k=k|0;p=p|0;f=n;t=i;u=r;e=_;c=m;o=l;a=w;s=b;h=k;v=p}function H(n,i){n=n|0;i=i|0;var r=0;if(n&63)return-1;while((i|0)>=64){D(n);n=n+64|0;i=i-64|0;r=r+64|0}h=h+r|0;if(h>>>0<r>>>0)v=v+1|0;return r|0}function I(n,i,r){n=n|0;i=i|0;r=r|0;var f=0,t=0;if(n&63)return-1;if(~r)if(r&31)return-1;if((i|0)>=64){f=H(n,i)|0;if((f|0)==-1)return-1;n=n+f|0;i=i-f|0}f=f+i|0;h=h+i|0;if(h>>>0<i>>>0)v=v+1|0;B[n|i]=0x80;if((i|0)>=56){for(t=i+1|0;(t|0)<64;t=t+1|0)B[n|t]=0x00;D(n);i=0;B[n|0]=0}for(t=i+1|0;(t|0)<59;t=t+1|0)B[n|t]=0;B[n|56]=v>>>21&255;B[n|57]=v>>>13&255;B[n|58]=v>>>5&255;B[n|59]=v<<3&255|h>>>29;B[n|60]=h>>>21&255;B[n|61]=h>>>13&255;B[n|62]=h>>>5&255;B[n|63]=h<<3&255;D(n);if(~r)E(r);return f|0}function J(){f=_;t=m;u=l;e=w;c=b;o=k;a=p;s=d;h=64;v=0}function K(){f=g;t=y;u=A;e=U;c=j;o=q;a=x;s=z;h=64;v=0}function L(n,i,r,B,D,E,G,H,I,J,K,L,M,N,O,P){n=n|0;i=i|0;r=r|0;B=B|0;D=D|0;E=E|0;G=G|0;H=H|0;I=I|0;J=J|0;K=K|0;L=L|0;M=M|0;N=N|0;O=O|0;P=P|0;F();C(n^0x5c5c5c5c,i^0x5c5c5c5c,r^0x5c5c5c5c,B^0x5c5c5c5c,D^0x5c5c5c5c,E^0x5c5c5c5c,G^0x5c5c5c5c,H^0x5c5c5c5c,I^0x5c5c5c5c,J^0x5c5c5c5c,K^0x5c5c5c5c,L^0x5c5c5c5c,M^0x5c5c5c5c,N^0x5c5c5c5c,O^0x5c5c5c5c,P^0x5c5c5c5c);g=f;y=t;A=u;U=e;j=c;q=o;x=a;z=s;F();C(n^0x36363636,i^0x36363636,r^0x36363636,B^0x36363636,D^0x36363636,E^0x36363636,G^0x36363636,H^0x36363636,I^0x36363636,J^0x36363636,K^0x36363636,L^0x36363636,M^0x36363636,N^0x36363636,O^0x36363636,P^0x36363636);_=f;m=t;l=u;w=e;b=c;k=o;p=a;d=s;h=64;v=0}function M(n,i,r){n=n|0;i=i|0;r=r|0;var h=0,v=0,_=0,m=0,l=0,w=0,b=0,k=0,p=0;if(n&63)return-1;if(~r)if(r&31)return-1;p=I(n,i,-1)|0;h=f,v=t,_=u,m=e,l=c,w=o,b=a,k=s;K();C(h,v,_,m,l,w,b,k,0x80000000,0,0,0,0,0,0,768);if(~r)E(r);return p|0}function N(n,i,r,h,v){n=n|0;i=i|0;r=r|0;h=h|0;v=v|0;var _=0,m=0,l=0,w=0,b=0,k=0,p=0,d=0,g=0,y=0,A=0,U=0,j=0,q=0,x=0,z=0;if(n&63)return-1;if(~v)if(v&31)return-1;B[n+i|0]=r>>>24;B[n+i+1|0]=r>>>16&255;B[n+i+2|0]=r>>>8&255;B[n+i+3|0]=r&255;M(n,i+4|0,-1)|0;_=g=f,m=y=t,l=A=u,w=U=e,b=j=c,k=q=o,p=x=a,d=z=s;h=h-1|0;while((h|0)>0){J();C(g,y,A,U,j,q,x,z,0x80000000,0,0,0,0,0,0,768);g=f,y=t,A=u,U=e,j=c,q=o,x=a,z=s;K();C(g,y,A,U,j,q,x,z,0x80000000,0,0,0,0,0,0,768);g=f,y=t,A=u,U=e,j=c,q=o,x=a,z=s;_=_^f;m=m^t;l=l^u;w=w^e;b=b^c;k=k^o;p=p^a;d=d^s;h=h-1|0}f=_;t=m;u=l;e=w;c=b;o=k;a=p;s=d;if(~v)E(v);return 0}return{reset:F,init:G,process:H,finish:I,hmac_reset:J,hmac_init:L,hmac_finish:M,pbkdf2_generate_block:N}}

var _sha256_block_size = 64,
    _sha256_hash_size = 32;

function sha256_constructor ( options ) {
    options = options || {};

    this.heap = _heap_init( Uint8Array, options );
    this.asm = options.asm || sha256_asm( { Uint8Array: Uint8Array }, null, this.heap.buffer );

    this.BLOCK_SIZE = _sha256_block_size;
    this.HASH_SIZE = _sha256_hash_size;

    this.reset();
}

sha256_constructor.BLOCK_SIZE = _sha256_block_size;
sha256_constructor.HASH_SIZE = _sha256_hash_size;
sha256_constructor.NAME = "sha256";

var sha256_prototype = sha256_constructor.prototype;
sha256_prototype.reset =   function hash_reset () {
    this.result = null;
    this.pos = 0;
    this.len = 0;

    this.asm.reset();

    return this;
}
sha256_prototype.process = function hash_process ( data ) {
    if ( this.result !== null )
        throw new IllegalStateError("state must be reset before processing new data");

    if ( is_string(data) )
        data = string_to_bytes(data);

    if ( is_buffer(data) )
        data = new Uint8Array(data);

    if ( !is_bytes(data) )
        throw new TypeError("data isn't of expected type");

    var asm = this.asm,
        heap = this.heap,
        hpos = this.pos,
        hlen = this.len,
        dpos = 0,
        dlen = data.length,
        wlen = 0;

    while ( dlen > 0 ) {
        wlen = _heap_write( heap, hpos+hlen, data, dpos, dlen );
        hlen += wlen;
        dpos += wlen;
        dlen -= wlen;

        wlen = asm.process( hpos, hlen );

        hpos += wlen;
        hlen -= wlen;

        if ( !hlen ) hpos = 0;
    }

    this.pos = hpos;
    this.len = hlen;

    return this;
}

sha256_prototype.finish =  function hash_finish () {
    if ( this.result !== null )
        throw new IllegalStateError("state must be reset before processing new data");

    this.asm.finish( this.pos, this.len, 0 );

    this.result = new Uint8Array(this.HASH_SIZE);
    this.result.set( this.heap.subarray( 0, this.HASH_SIZE ) );

    this.pos = 0;
    this.len = 0;

    return this;
}

var sha256_instance = null;

function get_sha256_instance () {
    if ( sha256_instance === null ) sha256_instance = new sha256_constructor( { heapSize: 0x100000 } );
    return sha256_instance;
}

function sha256_bytes ( data ) {
    return get_sha256_instance().reset().process(data).finish().result;
}

function polyMod() {
  "use strict";
  (function() {

  Error.stackTraceLimit=Infinity;var $global,$module;if(typeof window!=="undefined"){$global=window;}else if(typeof self!=="undefined"){$global=self;}else if(typeof global!=="undefined"){$global=global;$global.require=require;}else{$global=this;}if($global===undefined||$global.Array===undefined){throw new Error("no global object found");}if(typeof module!=="undefined"){$module=module;}var $packages={},$idCounter=0;var $keys=function(m){return m?Object.keys(m):[];};var $flushConsole=function(){};var $throwRuntimeError;var $throwNilPointerError=function(){$throwRuntimeError("invalid memory address or nil pointer dereference");};var $call=function(fn,rcvr,args){return fn.apply(rcvr,args);};var $makeFunc=function(fn){return function(){return $externalize(fn(this,new($sliceType($jsObjectPtr))($global.Array.prototype.slice.call(arguments,[]))),$emptyInterface);};};var $unused=function(v){};var $mapArray=function(array,f){var newArray=new array.constructor(array.length);for(var i=0;i<array.length;i++){newArray[i]=f(array[i]);}return newArray;};var $methodVal=function(recv,name){var vals=recv.$methodVals||{};recv.$methodVals=vals;var f=vals[name];if(f!==undefined){return f;}var method=recv[name];f=function(){$stackDepthOffset--;try{return method.apply(recv,arguments);}finally{$stackDepthOffset++;}};vals[name]=f;return f;};var $methodExpr=function(typ,name){var method=typ.prototype[name];if(method.$expr===undefined){method.$expr=function(){$stackDepthOffset--;try{if(typ.wrapped){arguments[0]=new typ(arguments[0]);}return Function.call.apply(method,arguments);}finally{$stackDepthOffset++;}};}return method.$expr;};var $ifaceMethodExprs={};var $ifaceMethodExpr=function(name){var expr=$ifaceMethodExprs["$"+name];if(expr===undefined){expr=$ifaceMethodExprs["$"+name]=function(){$stackDepthOffset--;try{return Function.call.apply(arguments[0][name],arguments);}finally{$stackDepthOffset++;}};}return expr;};var $subslice=function(slice,low,high,max){if(low<0||high<low||max<high||high>slice.$capacity||max>slice.$capacity){$throwRuntimeError("slice bounds out of range");}var s=new slice.constructor(slice.$array);s.$offset=slice.$offset+low;s.$length=slice.$length-low;s.$capacity=slice.$capacity-low;if(high!==undefined){s.$length=high-low;}if(max!==undefined){s.$capacity=max-low;}return s;};var $substring=function(str,low,high){if(low<0||high<low||high>str.length){$throwRuntimeError("slice bounds out of range");}return str.substring(low,high);};var $sliceToArray=function(slice){if(slice.$array.constructor!==Array){return slice.$array.subarray(slice.$offset,slice.$offset+slice.$length);}return slice.$array.slice(slice.$offset,slice.$offset+slice.$length);};var $decodeRune=function(str,pos){var c0=str.charCodeAt(pos);if(c0<0x80){return[c0,1];}if(c0!==c0||c0<0xC0){return[0xFFFD,1];}var c1=str.charCodeAt(pos+1);if(c1!==c1||c1<0x80||0xC0<=c1){return[0xFFFD,1];}if(c0<0xE0){var r=(c0&0x1F)<<6|(c1&0x3F);if(r<=0x7F){return[0xFFFD,1];}return[r,2];}var c2=str.charCodeAt(pos+2);if(c2!==c2||c2<0x80||0xC0<=c2){return[0xFFFD,1];}if(c0<0xF0){var r=(c0&0x0F)<<12|(c1&0x3F)<<6|(c2&0x3F);if(r<=0x7FF){return[0xFFFD,1];}if(0xD800<=r&&r<=0xDFFF){return[0xFFFD,1];}return[r,3];}var c3=str.charCodeAt(pos+3);if(c3!==c3||c3<0x80||0xC0<=c3){return[0xFFFD,1];}if(c0<0xF8){var r=(c0&0x07)<<18|(c1&0x3F)<<12|(c2&0x3F)<<6|(c3&0x3F);if(r<=0xFFFF||0x10FFFF<r){return[0xFFFD,1];}return[r,4];}return[0xFFFD,1];};var $encodeRune=function(r){if(r<0||r>0x10FFFF||(0xD800<=r&&r<=0xDFFF)){r=0xFFFD;}if(r<=0x7F){return String.fromCharCode(r);}if(r<=0x7FF){return String.fromCharCode(0xC0|r>>6,0x80|(r&0x3F));}if(r<=0xFFFF){return String.fromCharCode(0xE0|r>>12,0x80|(r>>6&0x3F),0x80|(r&0x3F));}return String.fromCharCode(0xF0|r>>18,0x80|(r>>12&0x3F),0x80|(r>>6&0x3F),0x80|(r&0x3F));};var $stringToBytes=function(str){var array=new Uint8Array(str.length);for(var i=0;i<str.length;i++){array[i]=str.charCodeAt(i);}return array;};var $bytesToString=function(slice){if(slice.$length===0){return"";}var str="";for(var i=0;i<slice.$length;i+=10000){str+=String.fromCharCode.apply(undefined,slice.$array.subarray(slice.$offset+i,slice.$offset+Math.min(slice.$length,i+10000)));}return str;};var $stringToRunes=function(str){var array=new Int32Array(str.length);var rune,j=0;for(var i=0;i<str.length;i+=rune[1],j++){rune=$decodeRune(str,i);array[j]=rune[0];}return array.subarray(0,j);};var $runesToString=function(slice){if(slice.$length===0){return"";}var str="";for(var i=0;i<slice.$length;i++){str+=$encodeRune(slice.$array[slice.$offset+i]);}return str;};var $copyString=function(dst,src){var n=Math.min(src.length,dst.$length);for(var i=0;i<n;i++){dst.$array[dst.$offset+i]=src.charCodeAt(i);}return n;};var $copySlice=function(dst,src){var n=Math.min(src.$length,dst.$length);$copyArray(dst.$array,src.$array,dst.$offset,src.$offset,n,dst.constructor.elem);return n;};var $copyArray=function(dst,src,dstOffset,srcOffset,n,elem){if(n===0||(dst===src&&dstOffset===srcOffset)){return;}if(src.subarray){dst.set(src.subarray(srcOffset,srcOffset+n),dstOffset);return;}switch(elem.kind){case $kindArray:case $kindStruct:if(dst===src&&dstOffset>srcOffset){for(var i=n-1;i>=0;i--){elem.copy(dst[dstOffset+i],src[srcOffset+i]);}return;}for(var i=0;i<n;i++){elem.copy(dst[dstOffset+i],src[srcOffset+i]);}return;}if(dst===src&&dstOffset>srcOffset){for(var i=n-1;i>=0;i--){dst[dstOffset+i]=src[srcOffset+i];}return;}for(var i=0;i<n;i++){dst[dstOffset+i]=src[srcOffset+i];}};var $clone=function(src,type){var clone=type.zero();type.copy(clone,src);return clone;};var $pointerOfStructConversion=function(obj,type){if(obj.$proxies===undefined){obj.$proxies={};obj.$proxies[obj.constructor.string]=obj;}var proxy=obj.$proxies[type.string];if(proxy===undefined){var properties={};for(var i=0;i<type.elem.fields.length;i++){(function(fieldProp){properties[fieldProp]={get:function(){return obj[fieldProp];},set:function(value){obj[fieldProp]=value;}};})(type.elem.fields[i].prop);}proxy=Object.create(type.prototype,properties);proxy.$val=proxy;obj.$proxies[type.string]=proxy;proxy.$proxies=obj.$proxies;}return proxy;};var $append=function(slice){return $internalAppend(slice,arguments,1,arguments.length-1);};var $appendSlice=function(slice,toAppend){if(toAppend.constructor===String){var bytes=$stringToBytes(toAppend);return $internalAppend(slice,bytes,0,bytes.length);}return $internalAppend(slice,toAppend.$array,toAppend.$offset,toAppend.$length);};var $internalAppend=function(slice,array,offset,length){if(length===0){return slice;}var newArray=slice.$array;var newOffset=slice.$offset;var newLength=slice.$length+length;var newCapacity=slice.$capacity;if(newLength>newCapacity){newOffset=0;newCapacity=Math.max(newLength,slice.$capacity<1024?slice.$capacity*2:Math.floor(slice.$capacity*5/4));if(slice.$array.constructor===Array){newArray=slice.$array.slice(slice.$offset,slice.$offset+slice.$length);newArray.length=newCapacity;var zero=slice.constructor.elem.zero;for(var i=slice.$length;i<newCapacity;i++){newArray[i]=zero();}}else{newArray=new slice.$array.constructor(newCapacity);newArray.set(slice.$array.subarray(slice.$offset,slice.$offset+slice.$length));}}$copyArray(newArray,array,newOffset+slice.$length,offset,length,slice.constructor.elem);var newSlice=new slice.constructor(newArray);newSlice.$offset=newOffset;newSlice.$length=newLength;newSlice.$capacity=newCapacity;return newSlice;};var $equal=function(a,b,type){if(type===$jsObjectPtr){return a===b;}switch(type.kind){case $kindComplex64:case $kindComplex128:return a.$real===b.$real&&a.$imag===b.$imag;case $kindInt64:case $kindUint64:return a.$high===b.$high&&a.$low===b.$low;case $kindArray:if(a.length!==b.length){return false;}for(var i=0;i<a.length;i++){if(!$equal(a[i],b[i],type.elem)){return false;}}return true;case $kindStruct:for(var i=0;i<type.fields.length;i++){var f=type.fields[i];if(!$equal(a[f.prop],b[f.prop],f.typ)){return false;}}return true;case $kindInterface:return $interfaceIsEqual(a,b);default:return a===b;}};var $interfaceIsEqual=function(a,b){if(a===$ifaceNil||b===$ifaceNil){return a===b;}if(a.constructor!==b.constructor){return false;}if(a.constructor===$jsObjectPtr){return a.object===b.object;}if(!a.constructor.comparable){$throwRuntimeError("comparing uncomparable type "+a.constructor.string);}return $equal(a.$val,b.$val,a.constructor);};var $min=Math.min;var $mod=function(x,y){return x%y;};var $parseInt=parseInt;var $parseFloat=function(f){if(f!==undefined&&f!==null&&f.constructor===Number){return f;}return parseFloat(f);};var $froundBuf=new Float32Array(1);var $fround=Math.fround||function(f){$froundBuf[0]=f;return $froundBuf[0];};var $imul=Math.imul||function(a,b){var ah=(a>>>16)&0xffff;var al=a&0xffff;var bh=(b>>>16)&0xffff;var bl=b&0xffff;return((al*bl)+(((ah*bl+al*bh)<<16)>>>0)>>0);};var $floatKey=function(f){if(f!==f){$idCounter++;return"NaN$"+$idCounter;}return String(f);};var $flatten64=function(x){return x.$high*4294967296+x.$low;};var $shiftLeft64=function(x,y){if(y===0){return x;}if(y<32){return new x.constructor(x.$high<<y|x.$low>>>(32-y),(x.$low<<y)>>>0);}if(y<64){return new x.constructor(x.$low<<(y-32),0);}return new x.constructor(0,0);};var $shiftRightInt64=function(x,y){if(y===0){return x;}if(y<32){return new x.constructor(x.$high>>y,(x.$low>>>y|x.$high<<(32-y))>>>0);}if(y<64){return new x.constructor(x.$high>>31,(x.$high>>(y-32))>>>0);}if(x.$high<0){return new x.constructor(-1,4294967295);}return new x.constructor(0,0);};var $shiftRightUint64=function(x,y){if(y===0){return x;}if(y<32){return new x.constructor(x.$high>>>y,(x.$low>>>y|x.$high<<(32-y))>>>0);}if(y<64){return new x.constructor(0,x.$high>>>(y-32));}return new x.constructor(0,0);};var $mul64=function(x,y){var high=0,low=0;if((y.$low&1)!==0){high=x.$high;low=x.$low;}for(var i=1;i<32;i++){if((y.$low&1<<i)!==0){high+=x.$high<<i|x.$low>>>(32-i);low+=(x.$low<<i)>>>0;}}for(var i=0;i<32;i++){if((y.$high&1<<i)!==0){high+=x.$low<<i;}}return new x.constructor(high,low);};var $div64=function(x,y,returnRemainder){if(y.$high===0&&y.$low===0){$throwRuntimeError("integer divide by zero");}var s=1;var rs=1;var xHigh=x.$high;var xLow=x.$low;if(xHigh<0){s=-1;rs=-1;xHigh=-xHigh;if(xLow!==0){xHigh--;xLow=4294967296-xLow;}}var yHigh=y.$high;var yLow=y.$low;if(y.$high<0){s*=-1;yHigh=-yHigh;if(yLow!==0){yHigh--;yLow=4294967296-yLow;}}var high=0,low=0,n=0;while(yHigh<2147483648&&((xHigh>yHigh)||(xHigh===yHigh&&xLow>yLow))){yHigh=(yHigh<<1|yLow>>>31)>>>0;yLow=(yLow<<1)>>>0;n++;}for(var i=0;i<=n;i++){high=high<<1|low>>>31;low=(low<<1)>>>0;if((xHigh>yHigh)||(xHigh===yHigh&&xLow>=yLow)){xHigh=xHigh-yHigh;xLow=xLow-yLow;if(xLow<0){xHigh--;xLow+=4294967296;}low++;if(low===4294967296){high++;low=0;}}yLow=(yLow>>>1|yHigh<<(32-1))>>>0;yHigh=yHigh>>>1;}if(returnRemainder){return new x.constructor(xHigh*rs,xLow*rs);}return new x.constructor(high*s,low*s);};var $divComplex=function(n,d){var ninf=n.$real===Infinity||n.$real===-Infinity||n.$imag===Infinity||n.$imag===-Infinity;var dinf=d.$real===Infinity||d.$real===-Infinity||d.$imag===Infinity||d.$imag===-Infinity;var nnan=!ninf&&(n.$real!==n.$real||n.$imag!==n.$imag);var dnan=!dinf&&(d.$real!==d.$real||d.$imag!==d.$imag);if(nnan||dnan){return new n.constructor(NaN,NaN);}if(ninf&&!dinf){return new n.constructor(Infinity,Infinity);}if(!ninf&&dinf){return new n.constructor(0,0);}if(d.$real===0&&d.$imag===0){if(n.$real===0&&n.$imag===0){return new n.constructor(NaN,NaN);}return new n.constructor(Infinity,Infinity);}var a=Math.abs(d.$real);var b=Math.abs(d.$imag);if(a<=b){var ratio=d.$real/d.$imag;var denom=d.$real*ratio+d.$imag;return new n.constructor((n.$real*ratio+n.$imag)/denom,(n.$imag*ratio-n.$real)/denom);}var ratio=d.$imag/d.$real;var denom=d.$imag*ratio+d.$real;return new n.constructor((n.$imag*ratio+n.$real)/denom,(n.$imag-n.$real*ratio)/denom);};var $kindBool=1;var $kindInt=2;var $kindInt8=3;var $kindInt16=4;var $kindInt32=5;var $kindInt64=6;var $kindUint=7;var $kindUint8=8;var $kindUint16=9;var $kindUint32=10;var $kindUint64=11;var $kindUintptr=12;var $kindFloat32=13;var $kindFloat64=14;var $kindComplex64=15;var $kindComplex128=16;var $kindArray=17;var $kindChan=18;var $kindFunc=19;var $kindInterface=20;var $kindMap=21;var $kindPtr=22;var $kindSlice=23;var $kindString=24;var $kindStruct=25;var $kindUnsafePointer=26;var $methodSynthesizers=[];var $addMethodSynthesizer=function(f){if($methodSynthesizers===null){f();return;}$methodSynthesizers.push(f);};var $synthesizeMethods=function(){$methodSynthesizers.forEach(function(f){f();});$methodSynthesizers=null;};var $ifaceKeyFor=function(x){if(x===$ifaceNil){return'nil';}var c=x.constructor;return c.string+'$'+c.keyFor(x.$val);};var $identity=function(x){return x;};var $typeIDCounter=0;var $idKey=function(x){if(x.$id===undefined){$idCounter++;x.$id=$idCounter;}return String(x.$id);};var $newType=function(size,kind,string,named,pkg,exported,constructor){var typ;switch(kind){case $kindBool:case $kindInt:case $kindInt8:case $kindInt16:case $kindInt32:case $kindUint:case $kindUint8:case $kindUint16:case $kindUint32:case $kindUintptr:case $kindUnsafePointer:typ=function(v){this.$val=v;};typ.wrapped=true;typ.keyFor=$identity;break;case $kindString:typ=function(v){this.$val=v;};typ.wrapped=true;typ.keyFor=function(x){return"$"+x;};break;case $kindFloat32:case $kindFloat64:typ=function(v){this.$val=v;};typ.wrapped=true;typ.keyFor=function(x){return $floatKey(x);};break;case $kindInt64:typ=function(high,low){this.$high=(high+Math.floor(Math.ceil(low)/4294967296))>>0;this.$low=low>>>0;this.$val=this;};typ.keyFor=function(x){return x.$high+"$"+x.$low;};break;case $kindUint64:typ=function(high,low){this.$high=(high+Math.floor(Math.ceil(low)/4294967296))>>>0;this.$low=low>>>0;this.$val=this;};typ.keyFor=function(x){return x.$high+"$"+x.$low;};break;case $kindComplex64:typ=function(real,imag){this.$real=$fround(real);this.$imag=$fround(imag);this.$val=this;};typ.keyFor=function(x){return x.$real+"$"+x.$imag;};break;case $kindComplex128:typ=function(real,imag){this.$real=real;this.$imag=imag;this.$val=this;};typ.keyFor=function(x){return x.$real+"$"+x.$imag;};break;case $kindArray:typ=function(v){this.$val=v;};typ.wrapped=true;typ.ptr=$newType(4,$kindPtr,"*"+string,false,"",false,function(array){this.$get=function(){return array;};this.$set=function(v){typ.copy(this,v);};this.$val=array;});typ.init=function(elem,len){typ.elem=elem;typ.len=len;typ.comparable=elem.comparable;typ.keyFor=function(x){return Array.prototype.join.call($mapArray(x,function(e){return String(elem.keyFor(e)).replace(/\\/g,"\\\\").replace(/\$/g,"\\$");}),"$");};typ.copy=function(dst,src){$copyArray(dst,src,0,0,src.length,elem);};typ.ptr.init(typ);Object.defineProperty(typ.ptr.nil,"nilCheck",{get:$throwNilPointerError});};break;case $kindChan:typ=function(v){this.$val=v;};typ.wrapped=true;typ.keyFor=$idKey;typ.init=function(elem,sendOnly,recvOnly){typ.elem=elem;typ.sendOnly=sendOnly;typ.recvOnly=recvOnly;};break;case $kindFunc:typ=function(v){this.$val=v;};typ.wrapped=true;typ.init=function(params,results,variadic){typ.params=params;typ.results=results;typ.variadic=variadic;typ.comparable=false;};break;case $kindInterface:typ={implementedBy:{},missingMethodFor:{}};typ.keyFor=$ifaceKeyFor;typ.init=function(methods){typ.methods=methods;methods.forEach(function(m){$ifaceNil[m.prop]=$throwNilPointerError;});};break;case $kindMap:typ=function(v){this.$val=v;};typ.wrapped=true;typ.init=function(key,elem){typ.key=key;typ.elem=elem;typ.comparable=false;};break;case $kindPtr:typ=constructor||function(getter,setter,target){this.$get=getter;this.$set=setter;this.$target=target;this.$val=this;};typ.keyFor=$idKey;typ.init=function(elem){typ.elem=elem;typ.wrapped=(elem.kind===$kindArray);typ.nil=new typ($throwNilPointerError,$throwNilPointerError);};break;case $kindSlice:typ=function(array){if(array.constructor!==typ.nativeArray){array=new typ.nativeArray(array);}this.$array=array;this.$offset=0;this.$length=array.length;this.$capacity=array.length;this.$val=this;};typ.init=function(elem){typ.elem=elem;typ.comparable=false;typ.nativeArray=$nativeArray(elem.kind);typ.nil=new typ([]);};break;case $kindStruct:typ=function(v){this.$val=v;};typ.wrapped=true;typ.ptr=$newType(4,$kindPtr,"*"+string,false,pkg,exported,constructor);typ.ptr.elem=typ;typ.ptr.prototype.$get=function(){return this;};typ.ptr.prototype.$set=function(v){typ.copy(this,v);};typ.init=function(pkgPath,fields){typ.pkgPath=pkgPath;typ.fields=fields;fields.forEach(function(f){if(!f.typ.comparable){typ.comparable=false;}});typ.keyFor=function(x){var val=x.$val;return $mapArray(fields,function(f){return String(f.typ.keyFor(val[f.prop])).replace(/\\/g,"\\\\").replace(/\$/g,"\\$");}).join("$");};typ.copy=function(dst,src){for(var i=0;i<fields.length;i++){var f=fields[i];switch(f.typ.kind){case $kindArray:case $kindStruct:f.typ.copy(dst[f.prop],src[f.prop]);continue;default:dst[f.prop]=src[f.prop];continue;}}};var properties={};fields.forEach(function(f){properties[f.prop]={get:$throwNilPointerError,set:$throwNilPointerError};});typ.ptr.nil=Object.create(constructor.prototype,properties);typ.ptr.nil.$val=typ.ptr.nil;$addMethodSynthesizer(function(){var synthesizeMethod=function(target,m,f){if(target.prototype[m.prop]!==undefined){return;}target.prototype[m.prop]=function(){var v=this.$val[f.prop];if(f.typ===$jsObjectPtr){v=new $jsObjectPtr(v);}if(v.$val===undefined){v=new f.typ(v);}return v[m.prop].apply(v,arguments);};};fields.forEach(function(f){if(f.anonymous){$methodSet(f.typ).forEach(function(m){synthesizeMethod(typ,m,f);synthesizeMethod(typ.ptr,m,f);});$methodSet($ptrType(f.typ)).forEach(function(m){synthesizeMethod(typ.ptr,m,f);});}});});};break;default:$panic(new $String("invalid kind: "+kind));}switch(kind){case $kindBool:case $kindMap:typ.zero=function(){return false;};break;case $kindInt:case $kindInt8:case $kindInt16:case $kindInt32:case $kindUint:case $kindUint8:case $kindUint16:case $kindUint32:case $kindUintptr:case $kindUnsafePointer:case $kindFloat32:case $kindFloat64:typ.zero=function(){return 0;};break;case $kindString:typ.zero=function(){return"";};break;case $kindInt64:case $kindUint64:case $kindComplex64:case $kindComplex128:var zero=new typ(0,0);typ.zero=function(){return zero;};break;case $kindPtr:case $kindSlice:typ.zero=function(){return typ.nil;};break;case $kindChan:typ.zero=function(){return $chanNil;};break;case $kindFunc:typ.zero=function(){return $throwNilPointerError;};break;case $kindInterface:typ.zero=function(){return $ifaceNil;};break;case $kindArray:typ.zero=function(){var arrayClass=$nativeArray(typ.elem.kind);if(arrayClass!==Array){return new arrayClass(typ.len);}var array=new Array(typ.len);for(var i=0;i<typ.len;i++){array[i]=typ.elem.zero();}return array;};break;case $kindStruct:typ.zero=function(){return new typ.ptr();};break;default:$panic(new $String("invalid kind: "+kind));}typ.id=$typeIDCounter;$typeIDCounter++;typ.size=size;typ.kind=kind;typ.string=string;typ.named=named;typ.pkg=pkg;typ.exported=exported;typ.methods=[];typ.methodSetCache=null;typ.comparable=true;return typ;};var $methodSet=function(typ){if(typ.methodSetCache!==null){return typ.methodSetCache;}var base={};var isPtr=(typ.kind===$kindPtr);if(isPtr&&typ.elem.kind===$kindInterface){typ.methodSetCache=[];return[];}var current=[{typ:isPtr?typ.elem:typ,indirect:isPtr}];var seen={};while(current.length>0){var next=[];var mset=[];current.forEach(function(e){if(seen[e.typ.string]){return;}seen[e.typ.string]=true;if(e.typ.named){mset=mset.concat(e.typ.methods);if(e.indirect){mset=mset.concat($ptrType(e.typ).methods);}}switch(e.typ.kind){case $kindStruct:e.typ.fields.forEach(function(f){if(f.anonymous){var fTyp=f.typ;var fIsPtr=(fTyp.kind===$kindPtr);next.push({typ:fIsPtr?fTyp.elem:fTyp,indirect:e.indirect||fIsPtr});}});break;case $kindInterface:mset=mset.concat(e.typ.methods);break;}});mset.forEach(function(m){if(base[m.name]===undefined){base[m.name]=m;}});current=next;}typ.methodSetCache=[];Object.keys(base).sort().forEach(function(name){typ.methodSetCache.push(base[name]);});return typ.methodSetCache;};var $Bool=$newType(1,$kindBool,"bool",true,"",false,null);var $Int=$newType(4,$kindInt,"int",true,"",false,null);var $Int8=$newType(1,$kindInt8,"int8",true,"",false,null);var $Int16=$newType(2,$kindInt16,"int16",true,"",false,null);var $Int32=$newType(4,$kindInt32,"int32",true,"",false,null);var $Int64=$newType(8,$kindInt64,"int64",true,"",false,null);var $Uint=$newType(4,$kindUint,"uint",true,"",false,null);var $Uint8=$newType(1,$kindUint8,"uint8",true,"",false,null);var $Uint16=$newType(2,$kindUint16,"uint16",true,"",false,null);var $Uint32=$newType(4,$kindUint32,"uint32",true,"",false,null);var $Uint64=$newType(8,$kindUint64,"uint64",true,"",false,null);var $Uintptr=$newType(4,$kindUintptr,"uintptr",true,"",false,null);var $Float32=$newType(4,$kindFloat32,"float32",true,"",false,null);var $Float64=$newType(8,$kindFloat64,"float64",true,"",false,null);var $Complex64=$newType(8,$kindComplex64,"complex64",true,"",false,null);var $Complex128=$newType(16,$kindComplex128,"complex128",true,"",false,null);var $String=$newType(8,$kindString,"string",true,"",false,null);var $UnsafePointer=$newType(4,$kindUnsafePointer,"unsafe.Pointer",true,"",false,null);var $nativeArray=function(elemKind){switch(elemKind){case $kindInt:return Int32Array;case $kindInt8:return Int8Array;case $kindInt16:return Int16Array;case $kindInt32:return Int32Array;case $kindUint:return Uint32Array;case $kindUint8:return Uint8Array;case $kindUint16:return Uint16Array;case $kindUint32:return Uint32Array;case $kindUintptr:return Uint32Array;case $kindFloat32:return Float32Array;case $kindFloat64:return Float64Array;default:return Array;}};var $toNativeArray=function(elemKind,array){var nativeArray=$nativeArray(elemKind);if(nativeArray===Array){return array;}return new nativeArray(array);};var $arrayTypes={};var $arrayType=function(elem,len){var typeKey=elem.id+"$"+len;var typ=$arrayTypes[typeKey];if(typ===undefined){typ=$newType(12,$kindArray,"["+len+"]"+elem.string,false,"",false,null);$arrayTypes[typeKey]=typ;typ.init(elem,len);}return typ;};var $chanType=function(elem,sendOnly,recvOnly){var string=(recvOnly?"<-":"")+"chan"+(sendOnly?"<- ":" ")+elem.string;var field=sendOnly?"SendChan":(recvOnly?"RecvChan":"Chan");var typ=elem[field];if(typ===undefined){typ=$newType(4,$kindChan,string,false,"",false,null);elem[field]=typ;typ.init(elem,sendOnly,recvOnly);}return typ;};var $Chan=function(elem,capacity){if(capacity<0||capacity>2147483647){$throwRuntimeError("makechan: size out of range");}this.$elem=elem;this.$capacity=capacity;this.$buffer=[];this.$sendQueue=[];this.$recvQueue=[];this.$closed=false;};var $chanNil=new $Chan(null,0);$chanNil.$sendQueue=$chanNil.$recvQueue={length:0,push:function(){},shift:function(){return undefined;},indexOf:function(){return-1;}};var $funcTypes={};var $funcType=function(params,results,variadic){var typeKey=$mapArray(params,function(p){return p.id;}).join(",")+"$"+$mapArray(results,function(r){return r.id;}).join(",")+"$"+variadic;var typ=$funcTypes[typeKey];if(typ===undefined){var paramTypes=$mapArray(params,function(p){return p.string;});if(variadic){paramTypes[paramTypes.length-1]="..."+paramTypes[paramTypes.length-1].substr(2);}var string="func("+paramTypes.join(", ")+")";if(results.length===1){string+=" "+results[0].string;}else if(results.length>1){string+=" ("+$mapArray(results,function(r){return r.string;}).join(", ")+")";}typ=$newType(4,$kindFunc,string,false,"",false,null);$funcTypes[typeKey]=typ;typ.init(params,results,variadic);}return typ;};var $interfaceTypes={};var $interfaceType=function(methods){var typeKey=$mapArray(methods,function(m){return m.pkg+","+m.name+","+m.typ.id;}).join("$");var typ=$interfaceTypes[typeKey];if(typ===undefined){var string="interface {}";if(methods.length!==0){string="interface { "+$mapArray(methods,function(m){return(m.pkg!==""?m.pkg+".":"")+m.name+m.typ.string.substr(4);}).join("; ")+" }";}typ=$newType(8,$kindInterface,string,false,"",false,null);$interfaceTypes[typeKey]=typ;typ.init(methods);}return typ;};var $emptyInterface=$interfaceType([]);var $ifaceNil={};var $error=$newType(8,$kindInterface,"error",true,"",false,null);$error.init([{prop:"Error",name:"Error",pkg:"",typ:$funcType([],[$String],false)}]);var $mapTypes={};var $mapType=function(key,elem){var typeKey=key.id+"$"+elem.id;var typ=$mapTypes[typeKey];if(typ===undefined){typ=$newType(4,$kindMap,"map["+key.string+"]"+elem.string,false,"",false,null);$mapTypes[typeKey]=typ;typ.init(key,elem);}return typ;};var $makeMap=function(keyForFunc,entries){var m={};for(var i=0;i<entries.length;i++){var e=entries[i];m[keyForFunc(e.k)]=e;}return m;};var $ptrType=function(elem){var typ=elem.ptr;if(typ===undefined){typ=$newType(4,$kindPtr,"*"+elem.string,false,"",elem.exported,null);elem.ptr=typ;typ.init(elem);}return typ;};var $newDataPointer=function(data,constructor){if(constructor.elem.kind===$kindStruct){return data;}return new constructor(function(){return data;},function(v){data=v;});};var $indexPtr=function(array,index,constructor){array.$ptr=array.$ptr||{};return array.$ptr[index]||(array.$ptr[index]=new constructor(function(){return array[index];},function(v){array[index]=v;}));};var $sliceType=function(elem){var typ=elem.slice;if(typ===undefined){typ=$newType(12,$kindSlice,"[]"+elem.string,false,"",false,null);elem.slice=typ;typ.init(elem);}return typ;};var $makeSlice=function(typ,length,capacity){capacity=capacity||length;if(length<0||length>2147483647){$throwRuntimeError("makeslice: len out of range");}if(capacity<0||capacity<length||capacity>2147483647){$throwRuntimeError("makeslice: cap out of range");}var array=new typ.nativeArray(capacity);if(typ.nativeArray===Array){for(var i=0;i<capacity;i++){array[i]=typ.elem.zero();}}var slice=new typ(array);slice.$length=length;return slice;};var $structTypes={};var $structType=function(pkgPath,fields){var typeKey=$mapArray(fields,function(f){return f.name+","+f.typ.id+","+f.tag;}).join("$");var typ=$structTypes[typeKey];if(typ===undefined){var string="struct { "+$mapArray(fields,function(f){return f.name+" "+f.typ.string+(f.tag!==""?(" \""+f.tag.replace(/\\/g,"\\\\").replace(/"/g, "\\\"")+"\""):"");}).join("; ")+" }";if(fields.length===0){string="struct {}";}typ=$newType(0,$kindStruct,string,false,"",false,function(){this.$val=this;for(var i=0;i<fields.length;i++){var f=fields[i];var arg=arguments[i];this[f.prop]=arg!==undefined?arg:f.typ.zero();}});$structTypes[typeKey]=typ;typ.init(pkgPath,fields);}return typ;};var $assertType=function(value,type,returnTuple){var isInterface=(type.kind===$kindInterface),ok,missingMethod="";if(value===$ifaceNil){ok=false;}else if(!isInterface){ok=value.constructor===type;}else{var valueTypeString=value.constructor.string;ok=type.implementedBy[valueTypeString];if(ok===undefined){ok=true;var valueMethodSet=$methodSet(value.constructor);var interfaceMethods=type.methods;for(var i=0;i<interfaceMethods.length;i++){var tm=interfaceMethods[i];var found=false;for(var j=0;j<valueMethodSet.length;j++){var vm=valueMethodSet[j];if(vm.name===tm.name&&vm.pkg===tm.pkg&&vm.typ===tm.typ){found=true;break;}}if(!found){ok=false;type.missingMethodFor[valueTypeString]=tm.name;break;}}type.implementedBy[valueTypeString]=ok;}if(!ok){missingMethod=type.missingMethodFor[valueTypeString];}}if(!ok){if(returnTuple){return[type.zero(),false];}$panic(new $packages["runtime"].TypeAssertionError.ptr("",(value===$ifaceNil?"":value.constructor.string),type.string,missingMethod));}if(!isInterface){value=value.$val;}if(type===$jsObjectPtr){value=value.object;}return returnTuple?[value,true]:value;};var $stackDepthOffset=0;var $getStackDepth=function(){var err=new Error();if(err.stack===undefined){return undefined;}return $stackDepthOffset+err.stack.split("\n").length;};var $panicStackDepth=null,$panicValue;var $callDeferred=function(deferred,jsErr,fromPanic){if(!fromPanic&&deferred!==null&&deferred.index>=$curGoroutine.deferStack.length){throw jsErr;}if(jsErr!==null){var newErr=null;try{$curGoroutine.deferStack.push(deferred);$panic(new $jsErrorPtr(jsErr));}catch(err){newErr=err;}$curGoroutine.deferStack.pop();$callDeferred(deferred,newErr);return;}if($curGoroutine.asleep){return;}$stackDepthOffset--;var outerPanicStackDepth=$panicStackDepth;var outerPanicValue=$panicValue;var localPanicValue=$curGoroutine.panicStack.pop();if(localPanicValue!==undefined){$panicStackDepth=$getStackDepth();$panicValue=localPanicValue;}try{while(true){if(deferred===null){deferred=$curGoroutine.deferStack[$curGoroutine.deferStack.length-1];if(deferred===undefined){$panicStackDepth=null;if(localPanicValue.Object instanceof Error){throw localPanicValue.Object;}var msg;if(localPanicValue.constructor===$String){msg=localPanicValue.$val;}else if(localPanicValue.Error!==undefined){msg=localPanicValue.Error();}else if(localPanicValue.String!==undefined){msg=localPanicValue.String();}else{msg=localPanicValue;}throw new Error(msg);}}var call=deferred.pop();if(call===undefined){$curGoroutine.deferStack.pop();if(localPanicValue!==undefined){deferred=null;continue;}return;}var r=call[0].apply(call[2],call[1]);if(r&&r.$blk!==undefined){deferred.push([r.$blk,[],r]);if(fromPanic){throw null;}return;}if(localPanicValue!==undefined&&$panicStackDepth===null){throw null;}}}finally{if(localPanicValue!==undefined){if($panicStackDepth!==null){$curGoroutine.panicStack.push(localPanicValue);}$panicStackDepth=outerPanicStackDepth;$panicValue=outerPanicValue;}$stackDepthOffset++;}};var $panic=function(value){$curGoroutine.panicStack.push(value);$callDeferred(null,null,true);};var $recover=function(){if($panicStackDepth===null||($panicStackDepth!==undefined&&$panicStackDepth!==$getStackDepth()-2)){return $ifaceNil;}$panicStackDepth=null;return $panicValue;};var $throw=function(err){throw err;};var $noGoroutine={asleep:false,exit:false,deferStack:[],panicStack:[]};var $curGoroutine=$noGoroutine,$totalGoroutines=0,$awakeGoroutines=0,$checkForDeadlock=true;var $mainFinished=false;var $go=function(fun,args){$totalGoroutines++;$awakeGoroutines++;var $goroutine=function(){try{$curGoroutine=$goroutine;var r=fun.apply(undefined,args);if(r&&r.$blk!==undefined){fun=function(){return r.$blk();};args=[];return;}$goroutine.exit=true;}catch(err){if(!$goroutine.exit){throw err;}}finally{$curGoroutine=$noGoroutine;if($goroutine.exit){$totalGoroutines--;$goroutine.asleep=true;}if($goroutine.asleep){$awakeGoroutines--;if(!$mainFinished&&$awakeGoroutines===0&&$checkForDeadlock){console.error("fatal error: all goroutines are asleep - deadlock!");if($global.process!==undefined){$global.process.exit(2);}}}}};$goroutine.asleep=false;$goroutine.exit=false;$goroutine.deferStack=[];$goroutine.panicStack=[];$schedule($goroutine);};var $scheduled=[];var $runScheduled=function(){try{var r;while((r=$scheduled.shift())!==undefined){r();}}finally{if($scheduled.length>0){setTimeout($runScheduled,0);}}};var $schedule=function(goroutine){if(goroutine.asleep){goroutine.asleep=false;$awakeGoroutines++;}$scheduled.push(goroutine);if($curGoroutine===$noGoroutine){$runScheduled();}};var $setTimeout=function(f,t){$awakeGoroutines++;return setTimeout(function(){$awakeGoroutines--;f();},t);};var $block=function(){if($curGoroutine===$noGoroutine){$throwRuntimeError("cannot block in JavaScript callback, fix by wrapping code in goroutine");}$curGoroutine.asleep=true;};var $send=function(chan,value){if(chan.$closed){$throwRuntimeError("send on closed channel");}var queuedRecv=chan.$recvQueue.shift();if(queuedRecv!==undefined){queuedRecv([value,true]);return;}if(chan.$buffer.length<chan.$capacity){chan.$buffer.push(value);return;}var thisGoroutine=$curGoroutine;var closedDuringSend;chan.$sendQueue.push(function(closed){closedDuringSend=closed;$schedule(thisGoroutine);return value;});$block();return{$blk:function(){if(closedDuringSend){$throwRuntimeError("send on closed channel");}}};};var $recv=function(chan){var queuedSend=chan.$sendQueue.shift();if(queuedSend!==undefined){chan.$buffer.push(queuedSend(false));}var bufferedValue=chan.$buffer.shift();if(bufferedValue!==undefined){return[bufferedValue,true];}if(chan.$closed){return[chan.$elem.zero(),false];}var thisGoroutine=$curGoroutine;var f={$blk:function(){return this.value;}};var queueEntry=function(v){f.value=v;$schedule(thisGoroutine);};chan.$recvQueue.push(queueEntry);$block();return f;};var $close=function(chan){if(chan.$closed){$throwRuntimeError("close of closed channel");}chan.$closed=true;while(true){var queuedSend=chan.$sendQueue.shift();if(queuedSend===undefined){break;}queuedSend(true);}while(true){var queuedRecv=chan.$recvQueue.shift();if(queuedRecv===undefined){break;}queuedRecv([chan.$elem.zero(),false]);}};var $select=function(comms){var ready=[];var selection=-1;for(var i=0;i<comms.length;i++){var comm=comms[i];var chan=comm[0];switch(comm.length){case 0:selection=i;break;case 1:if(chan.$sendQueue.length!==0||chan.$buffer.length!==0||chan.$closed){ready.push(i);}break;case 2:if(chan.$closed){$throwRuntimeError("send on closed channel");}if(chan.$recvQueue.length!==0||chan.$buffer.length<chan.$capacity){ready.push(i);}break;}}if(ready.length!==0){selection=ready[Math.floor(Math.random()*ready.length)];}if(selection!==-1){var comm=comms[selection];switch(comm.length){case 0:return[selection];case 1:return[selection,$recv(comm[0])];case 2:$send(comm[0],comm[1]);return[selection];}}var entries=[];var thisGoroutine=$curGoroutine;var f={$blk:function(){return this.selection;}};var removeFromQueues=function(){for(var i=0;i<entries.length;i++){var entry=entries[i];var queue=entry[0];var index=queue.indexOf(entry[1]);if(index!==-1){queue.splice(index,1);}}};for(var i=0;i<comms.length;i++){(function(i){var comm=comms[i];switch(comm.length){case 1:var queueEntry=function(value){f.selection=[i,value];removeFromQueues();$schedule(thisGoroutine);};entries.push([comm[0].$recvQueue,queueEntry]);comm[0].$recvQueue.push(queueEntry);break;case 2:var queueEntry=function(){if(comm[0].$closed){$throwRuntimeError("send on closed channel");}f.selection=[i];removeFromQueues();$schedule(thisGoroutine);return comm[1];};entries.push([comm[0].$sendQueue,queueEntry]);comm[0].$sendQueue.push(queueEntry);break;}})(i);}$block();return f;};var $jsObjectPtr,$jsErrorPtr;var $needsExternalization=function(t){switch(t.kind){case $kindBool:case $kindInt:case $kindInt8:case $kindInt16:case $kindInt32:case $kindUint:case $kindUint8:case $kindUint16:case $kindUint32:case $kindUintptr:case $kindFloat32:case $kindFloat64:return false;default:return t!==$jsObjectPtr;}};var $externalize=function(v,t){if(t===$jsObjectPtr){return v;}switch(t.kind){case $kindBool:case $kindInt:case $kindInt8:case $kindInt16:case $kindInt32:case $kindUint:case $kindUint8:case $kindUint16:case $kindUint32:case $kindUintptr:case $kindFloat32:case $kindFloat64:return v;case $kindInt64:case $kindUint64:return $flatten64(v);case $kindArray:if($needsExternalization(t.elem)){return $mapArray(v,function(e){return $externalize(e,t.elem);});}return v;case $kindFunc:return $externalizeFunction(v,t,false);case $kindInterface:if(v===$ifaceNil){return null;}if(v.constructor===$jsObjectPtr){return v.$val.object;}return $externalize(v.$val,v.constructor);case $kindMap:var m={};var keys=$keys(v);for(var i=0;i<keys.length;i++){var entry=v[keys[i]];m[$externalize(entry.k,t.key)]=$externalize(entry.v,t.elem);}return m;case $kindPtr:if(v===t.nil){return null;}return $externalize(v.$get(),t.elem);case $kindSlice:if($needsExternalization(t.elem)){return $mapArray($sliceToArray(v),function(e){return $externalize(e,t.elem);});}return $sliceToArray(v);case $kindString:if($isASCII(v)){return v;}var s="",r;for(var i=0;i<v.length;i+=r[1]){r=$decodeRune(v,i);var c=r[0];if(c>0xFFFF){var h=Math.floor((c-0x10000)/0x400)+0xD800;var l=(c-0x10000)%0x400+0xDC00;s+=String.fromCharCode(h,l);continue;}s+=String.fromCharCode(c);}return s;case $kindStruct:var timePkg=$packages["time"];if(timePkg!==undefined&&v.constructor===timePkg.Time.ptr){var milli=$div64(v.UnixNano(),new $Int64(0,1000000));return new Date($flatten64(milli));}var noJsObject={};var searchJsObject=function(v,t){if(t===$jsObjectPtr){return v;}switch(t.kind){case $kindPtr:if(v===t.nil){return noJsObject;}return searchJsObject(v.$get(),t.elem);case $kindStruct:var f=t.fields[0];return searchJsObject(v[f.prop],f.typ);case $kindInterface:return searchJsObject(v.$val,v.constructor);default:return noJsObject;}};var o=searchJsObject(v,t);if(o!==noJsObject){return o;}o={};for(var i=0;i<t.fields.length;i++){var f=t.fields[i];if(!f.exported){continue;}o[f.name]=$externalize(v[f.prop],f.typ);}return o;}$throwRuntimeError("cannot externalize "+t.string);};var $externalizeFunction=function(v,t,passThis){if(v===$throwNilPointerError){return null;}if(v.$externalizeWrapper===undefined){$checkForDeadlock=false;v.$externalizeWrapper=function(){var args=[];for(var i=0;i<t.params.length;i++){if(t.variadic&&i===t.params.length-1){var vt=t.params[i].elem,varargs=[];for(var j=i;j<arguments.length;j++){varargs.push($internalize(arguments[j],vt));}args.push(new(t.params[i])(varargs));break;}args.push($internalize(arguments[i],t.params[i]));}var result=v.apply(passThis?this:undefined,args);switch(t.results.length){case 0:return;case 1:return $externalize(result,t.results[0]);default:for(var i=0;i<t.results.length;i++){result[i]=$externalize(result[i],t.results[i]);}return result;}};}return v.$externalizeWrapper;};var $internalize=function(v,t,recv){if(t===$jsObjectPtr){return v;}if(t===$jsObjectPtr.elem){$throwRuntimeError("cannot internalize js.Object, use *js.Object instead");}if(v&&v.__internal_object__!==undefined){return $assertType(v.__internal_object__,t,false);}var timePkg=$packages["time"];if(timePkg!==undefined&&t===timePkg.Time){if(!(v!==null&&v!==undefined&&v.constructor===Date)){$throwRuntimeError("cannot internalize time.Time from "+typeof v+", must be Date");}return timePkg.Unix(new $Int64(0,0),new $Int64(0,v.getTime()*1000000));}switch(t.kind){case $kindBool:return!!v;case $kindInt:return parseInt(v);case $kindInt8:return parseInt(v)<<24>>24;case $kindInt16:return parseInt(v)<<16>>16;case $kindInt32:return parseInt(v)>>0;case $kindUint:return parseInt(v);case $kindUint8:return parseInt(v)<<24>>>24;case $kindUint16:return parseInt(v)<<16>>>16;case $kindUint32:case $kindUintptr:return parseInt(v)>>>0;case $kindInt64:case $kindUint64:return new t(0,v);case $kindFloat32:case $kindFloat64:return parseFloat(v);case $kindArray:if(v.length!==t.len){$throwRuntimeError("got array with wrong size from JavaScript native");}return $mapArray(v,function(e){return $internalize(e,t.elem);});case $kindFunc:return function(){var args=[];for(var i=0;i<t.params.length;i++){if(t.variadic&&i===t.params.length-1){var vt=t.params[i].elem,varargs=arguments[i];for(var j=0;j<varargs.$length;j++){args.push($externalize(varargs.$array[varargs.$offset+j],vt));}break;}args.push($externalize(arguments[i],t.params[i]));}var result=v.apply(recv,args);switch(t.results.length){case 0:return;case 1:return $internalize(result,t.results[0]);default:for(var i=0;i<t.results.length;i++){result[i]=$internalize(result[i],t.results[i]);}return result;}};case $kindInterface:if(t.methods.length!==0){$throwRuntimeError("cannot internalize "+t.string);}if(v===null){return $ifaceNil;}if(v===undefined){return new $jsObjectPtr(undefined);}switch(v.constructor){case Int8Array:return new($sliceType($Int8))(v);case Int16Array:return new($sliceType($Int16))(v);case Int32Array:return new($sliceType($Int))(v);case Uint8Array:return new($sliceType($Uint8))(v);case Uint16Array:return new($sliceType($Uint16))(v);case Uint32Array:return new($sliceType($Uint))(v);case Float32Array:return new($sliceType($Float32))(v);case Float64Array:return new($sliceType($Float64))(v);case Array:return $internalize(v,$sliceType($emptyInterface));case Boolean:return new $Bool(!!v);case Date:if(timePkg===undefined){return new $jsObjectPtr(v);}return new timePkg.Time($internalize(v,timePkg.Time));case Function:var funcType=$funcType([$sliceType($emptyInterface)],[$jsObjectPtr],true);return new funcType($internalize(v,funcType));case Number:return new $Float64(parseFloat(v));case String:return new $String($internalize(v,$String));default:if($global.Node&&v instanceof $global.Node){return new $jsObjectPtr(v);}var mapType=$mapType($String,$emptyInterface);return new mapType($internalize(v,mapType));}case $kindMap:var m={};var keys=$keys(v);for(var i=0;i<keys.length;i++){var k=$internalize(keys[i],t.key);m[t.key.keyFor(k)]={k:k,v:$internalize(v[keys[i]],t.elem)};}return m;case $kindPtr:if(t.elem.kind===$kindStruct){return $internalize(v,t.elem);}case $kindSlice:return new t($mapArray(v,function(e){return $internalize(e,t.elem);}));case $kindString:v=String(v);if($isASCII(v)){return v;}var s="";var i=0;while(i<v.length){var h=v.charCodeAt(i);if(0xD800<=h&&h<=0xDBFF){var l=v.charCodeAt(i+1);var c=(h-0xD800)*0x400+l-0xDC00+0x10000;s+=$encodeRune(c);i+=2;continue;}s+=$encodeRune(h);i++;}return s;case $kindStruct:var noJsObject={};var searchJsObject=function(t){if(t===$jsObjectPtr){return v;}if(t===$jsObjectPtr.elem){$throwRuntimeError("cannot internalize js.Object, use *js.Object instead");}switch(t.kind){case $kindPtr:return searchJsObject(t.elem);case $kindStruct:var f=t.fields[0];var o=searchJsObject(f.typ);if(o!==noJsObject){var n=new t.ptr();n[f.prop]=o;return n;}return noJsObject;default:return noJsObject;}};var o=searchJsObject(t);if(o!==noJsObject){return o;}}$throwRuntimeError("cannot internalize "+t.string);};var $isASCII=function(s){for(var i=0;i<s.length;i++){if(s.charCodeAt(i)>=128){return false;}}return true;};
  $packages["github.com/gopherjs/gopherjs/js"]=(function(){var $pkg={},$init,A,B,L,N,Q,K;A=$pkg.Object=$newType(0,$kindStruct,"js.Object",true,"github.com/gopherjs/gopherjs/js",true,function(object_){this.$val=this;if(arguments.length===0){this.object=null;return;}this.object=object_;});B=$pkg.Error=$newType(0,$kindStruct,"js.Error",true,"github.com/gopherjs/gopherjs/js",true,function(Object_){this.$val=this;if(arguments.length===0){this.Object=null;return;}this.Object=Object_;});L=$sliceType($emptyInterface);N=$ptrType(A);Q=$ptrType(B);A.ptr.prototype.Get=function(a){var a,b;b=this;return b.object[$externalize(a,$String)];};A.prototype.Get=function(a){return this.$val.Get(a);};A.ptr.prototype.Set=function(a,b){var a,b,c;c=this;c.object[$externalize(a,$String)]=$externalize(b,$emptyInterface);};A.prototype.Set=function(a,b){return this.$val.Set(a,b);};A.ptr.prototype.Delete=function(a){var a,b;b=this;delete b.object[$externalize(a,$String)];};A.prototype.Delete=function(a){return this.$val.Delete(a);};A.ptr.prototype.Length=function(){var a;a=this;return $parseInt(a.object.length);};A.prototype.Length=function(){return this.$val.Length();};A.ptr.prototype.Index=function(a){var a,b;b=this;return b.object[a];};A.prototype.Index=function(a){return this.$val.Index(a);};A.ptr.prototype.SetIndex=function(a,b){var a,b,c;c=this;c.object[a]=$externalize(b,$emptyInterface);};A.prototype.SetIndex=function(a,b){return this.$val.SetIndex(a,b);};A.ptr.prototype.Call=function(a,b){var a,b,c,d;c=this;return(d=c.object,d[$externalize(a,$String)].apply(d,$externalize(b,L)));};A.prototype.Call=function(a,b){return this.$val.Call(a,b);};A.ptr.prototype.Invoke=function(a){var a,b;b=this;return b.object.apply(undefined,$externalize(a,L));};A.prototype.Invoke=function(a){return this.$val.Invoke(a);};A.ptr.prototype.New=function(a){var a,b;b=this;return new($global.Function.prototype.bind.apply(b.object,[undefined].concat($externalize(a,L))));};A.prototype.New=function(a){return this.$val.New(a);};A.ptr.prototype.Bool=function(){var a;a=this;return!!(a.object);};A.prototype.Bool=function(){return this.$val.Bool();};A.ptr.prototype.String=function(){var a;a=this;return $internalize(a.object,$String);};A.prototype.String=function(){return this.$val.String();};A.ptr.prototype.Int=function(){var a;a=this;return $parseInt(a.object)>>0;};A.prototype.Int=function(){return this.$val.Int();};A.ptr.prototype.Int64=function(){var a;a=this;return $internalize(a.object,$Int64);};A.prototype.Int64=function(){return this.$val.Int64();};A.ptr.prototype.Uint64=function(){var a;a=this;return $internalize(a.object,$Uint64);};A.prototype.Uint64=function(){return this.$val.Uint64();};A.ptr.prototype.Float=function(){var a;a=this;return $parseFloat(a.object);};A.prototype.Float=function(){return this.$val.Float();};A.ptr.prototype.Interface=function(){var a;a=this;return $internalize(a.object,$emptyInterface);};A.prototype.Interface=function(){return this.$val.Interface();};A.ptr.prototype.Unsafe=function(){var a;a=this;return a.object;};A.prototype.Unsafe=function(){return this.$val.Unsafe();};B.ptr.prototype.Error=function(){var a;a=this;return"JavaScript error: "+$internalize(a.Object.message,$String);};B.prototype.Error=function(){return this.$val.Error();};B.ptr.prototype.Stack=function(){var a;a=this;return $internalize(a.Object.stack,$String);};B.prototype.Stack=function(){return this.$val.Stack();};K=function(){var a;a=new B.ptr(null);$unused(a);};N.methods=[{prop:"Get",name:"Get",pkg:"",typ:$funcType([$String],[N],false)},{prop:"Set",name:"Set",pkg:"",typ:$funcType([$String,$emptyInterface],[],false)},{prop:"Delete",name:"Delete",pkg:"",typ:$funcType([$String],[],false)},{prop:"Length",name:"Length",pkg:"",typ:$funcType([],[$Int],false)},{prop:"Index",name:"Index",pkg:"",typ:$funcType([$Int],[N],false)},{prop:"SetIndex",name:"SetIndex",pkg:"",typ:$funcType([$Int,$emptyInterface],[],false)},{prop:"Call",name:"Call",pkg:"",typ:$funcType([$String,L],[N],true)},{prop:"Invoke",name:"Invoke",pkg:"",typ:$funcType([L],[N],true)},{prop:"New",name:"New",pkg:"",typ:$funcType([L],[N],true)},{prop:"Bool",name:"Bool",pkg:"",typ:$funcType([],[$Bool],false)},{prop:"String",name:"String",pkg:"",typ:$funcType([],[$String],false)},{prop:"Int",name:"Int",pkg:"",typ:$funcType([],[$Int],false)},{prop:"Int64",name:"Int64",pkg:"",typ:$funcType([],[$Int64],false)},{prop:"Uint64",name:"Uint64",pkg:"",typ:$funcType([],[$Uint64],false)},{prop:"Float",name:"Float",pkg:"",typ:$funcType([],[$Float64],false)},{prop:"Interface",name:"Interface",pkg:"",typ:$funcType([],[$emptyInterface],false)},{prop:"Unsafe",name:"Unsafe",pkg:"",typ:$funcType([],[$Uintptr],false)}];Q.methods=[{prop:"Error",name:"Error",pkg:"",typ:$funcType([],[$String],false)},{prop:"Stack",name:"Stack",pkg:"",typ:$funcType([],[$String],false)}];A.init("github.com/gopherjs/gopherjs/js",[{prop:"object",name:"object",anonymous:false,exported:false,typ:N,tag:""}]);B.init("",[{prop:"Object",name:"Object",anonymous:true,exported:true,typ:N,tag:""}]);$init=function(){$pkg.$init=function(){};var $f,$c=false,$s=0,$r;if(this!==undefined&&this.$blk!==undefined){$f=this;$c=true;$s=$f.$s;$r=$f.$r;}s:while(true){switch($s){case 0:K();}return;}if($f===undefined){$f={$blk:$init};}$f.$s=$s;$f.$r=$r;return $f;};$pkg.$init=$init;return $pkg;})();
  $packages["runtime/internal/sys"]=(function(){var $pkg={},$init;$init=function(){$pkg.$init=function(){};var $f,$c=false,$s=0,$r;if(this!==undefined&&this.$blk!==undefined){$f=this;$c=true;$s=$f.$s;$r=$f.$r;}s:while(true){switch($s){case 0:}return;}if($f===undefined){$f={$blk:$init};}$f.$s=$s;$f.$r=$r;return $f;};$pkg.$init=$init;return $pkg;})();
  $packages["runtime"]=(function(){var $pkg={},$init,B,A,AL,AM,BC,E,AJ;B=$packages["github.com/gopherjs/gopherjs/js"];A=$packages["runtime/internal/sys"];AL=$pkg.TypeAssertionError=$newType(0,$kindStruct,"runtime.TypeAssertionError",true,"runtime",true,function(interfaceString_,concreteString_,assertedString_,missingMethod_){this.$val=this;if(arguments.length===0){this.interfaceString="";this.concreteString="";this.assertedString="";this.missingMethod="";return;}this.interfaceString=interfaceString_;this.concreteString=concreteString_;this.assertedString=assertedString_;this.missingMethod=missingMethod_;});AM=$pkg.errorString=$newType(8,$kindString,"runtime.errorString",true,"runtime",false,null);BC=$ptrType(AL);E=function(){var a,b;a=$packages[$externalize("github.com/gopherjs/gopherjs/js",$String)];$jsObjectPtr=a.Object.ptr;$jsErrorPtr=a.Error.ptr;$throwRuntimeError=AJ;b=$ifaceNil;b=new AL.ptr("","","","");$unused(b);};AJ=function(a){var a;$panic(new AM((a)));};AL.ptr.prototype.RuntimeError=function(){};AL.prototype.RuntimeError=function(){return this.$val.RuntimeError();};AL.ptr.prototype.Error=function(){var a,b;a=this;b=a.interfaceString;if(b===""){b="interface";}if(a.concreteString===""){return"interface conversion: "+b+" is nil, not "+a.assertedString;}if(a.missingMethod===""){return"interface conversion: "+b+" is "+a.concreteString+", not "+a.assertedString;}return"interface conversion: "+a.concreteString+" is not "+a.assertedString+": missing method "+a.missingMethod;};AL.prototype.Error=function(){return this.$val.Error();};AM.prototype.RuntimeError=function(){var a;a=this.$val;};$ptrType(AM).prototype.RuntimeError=function(){return new AM(this.$get()).RuntimeError();};AM.prototype.Error=function(){var a;a=this.$val;return"runtime error: "+(a);};$ptrType(AM).prototype.Error=function(){return new AM(this.$get()).Error();};BC.methods=[{prop:"RuntimeError",name:"RuntimeError",pkg:"",typ:$funcType([],[],false)},{prop:"Error",name:"Error",pkg:"",typ:$funcType([],[$String],false)}];AM.methods=[{prop:"RuntimeError",name:"RuntimeError",pkg:"",typ:$funcType([],[],false)},{prop:"Error",name:"Error",pkg:"",typ:$funcType([],[$String],false)}];AL.init("runtime",[{prop:"interfaceString",name:"interfaceString",anonymous:false,exported:false,typ:$String,tag:""},{prop:"concreteString",name:"concreteString",anonymous:false,exported:false,typ:$String,tag:""},{prop:"assertedString",name:"assertedString",anonymous:false,exported:false,typ:$String,tag:""},{prop:"missingMethod",name:"missingMethod",anonymous:false,exported:false,typ:$String,tag:""}]);$init=function(){$pkg.$init=function(){};var $f,$c=false,$s=0,$r;if(this!==undefined&&this.$blk!==undefined){$f=this;$c=true;$s=$f.$s;$r=$f.$r;}s:while(true){switch($s){case 0:$r=B.$init();$s=1;case 1:if($c){$c=false;$r=$r.$blk();}if($r&&$r.$blk!==undefined){break s;}$r=A.$init();$s=2;case 2:if($c){$c=false;$r=$r.$blk();}if($r&&$r.$blk!==undefined){break s;}E();}return;}if($f===undefined){$f={$blk:$init};}$f.$s=$s;$f.$r=$r;return $f;};$pkg.$init=$init;return $pkg;})();
  $packages["."]=(function(){var $pkg={},$init,A,D,E,B,C;A=$packages["github.com/gopherjs/gopherjs/js"];D=$sliceType($Uint8);E=$arrayType($Uint8,8);B=function(){var a,b,c,d,e,f;a=D.nil;a=$assertType($internalize($global.polymodInput,$emptyInterface),D);b=C(a);if((b.$high===0&&b.$low===0)){$global.isPolymodCorrect=$externalize(true,$Bool);}else{$global.isPolymodCorrect=$externalize(false,$Bool);}a=$appendSlice(a,new D([0,0,0,0,0,0,0,0]));b=C(a);c=E.zero();d=new $Uint64(0,0);while(true){if(!((d.$high<0||(d.$high===0&&d.$low<8)))){break;}(($flatten64(d)<0||$flatten64(d)>=c.length)?($throwRuntimeError("index out of range"),undefined):c[$flatten64(d)]=(((e=$mul64($shiftRightUint64(b,5),(new $Uint64(0-d.$high,7-d.$low))),new $Uint64(e.$high&0,(e.$low&31)>>>0)).$low<<24>>>24)));d=(f=new $Uint64(0,1),new $Uint64(d.$high+f.$high,d.$low+f.$low));}$global.polymodAppend=$externalize(c,E);};C=function(a){var a,b,c,d,e,f,g,h,i,j,k,l,m;b=new $Uint64(0,1);c=a;d=0;while(true){if(!(d<c.$length)){break;}e=((d<0||d>=c.$length)?($throwRuntimeError("index out of range"),undefined):c.$array[c.$offset+d]);f=(($shiftRightUint64(b,35).$low<<24>>>24));b=(g=$shiftLeft64((new $Uint64(b.$high&7,(b.$low&4294967295)>>>0)),5),h=(new $Uint64(0,e)),new $Uint64(g.$high^h.$high,(g.$low^h.$low)>>>0));if(((f&1)>>>0)>0){b=(i=new $Uint64(152,4072443489),new $Uint64(b.$high^i.$high,(b.$low^i.$low)>>>0));}if(((f&2)>>>0)>0){b=(j=new $Uint64(121,3077413346),new $Uint64(b.$high^j.$high,(b.$low^j.$low)>>>0));}if(((f&4)>>>0)>0){b=(k=new $Uint64(243,1046459332),new $Uint64(b.$high^k.$high,(b.$low^k.$low)>>>0));}if(((f&8)>>>0)>0){b=(l=new $Uint64(174,783016616),new $Uint64(b.$high^l.$high,(b.$low^l.$low)>>>0));}if(((f&16)>>>0)>0){b=(m=new $Uint64(30,1329849456),new $Uint64(b.$high^m.$high,(b.$low^m.$low)>>>0));}d++;}return new $Uint64(b.$high^0,(b.$low^1)>>>0);};$pkg.PolyMod=C;$init=function(){$pkg.$init=function(){};var $f,$c=false,$s=0,$r;if(this!==undefined&&this.$blk!==undefined){$f=this;$c=true;$s=$f.$s;$r=$f.$r;}s:while(true){switch($s){case 0:$r=A.$init();$s=1;case 1:if($c){$c=false;$r=$r.$blk();}if($r&&$r.$blk!==undefined){break s;}if($pkg===$mainPkg){B();$mainFinished=true;}}return;}if($f===undefined){$f={$blk:$init};}$f.$s=$s;$f.$r=$r;return $f;};$pkg.$init=$init;return $pkg;})();
  $synthesizeMethods();
  var $mainPkg = $packages["."];
  $packages["runtime"].$init();
  $go($mainPkg.$init, []);
  $flushConsole();

  }).call(this);
}
