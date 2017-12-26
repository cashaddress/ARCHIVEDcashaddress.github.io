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

document.getElementsByClassName('btn btn-outline-primary btn-lg btn-block')[0].onclick = function() {
  document.getElementById('addressToTranslate').value = ""
  document.getElementById('resultAddressBlock').style.display = 'none'
  document.getElementById('resultAddress').value = ""
}
document.getElementById('addressToTranslate').oninput = function() {
  input = document.getElementById('addressToTranslate').value
	if (input[11] == ':' && len(input) == 54 && (input[12] == 'q' || input[12] == 'p')) {
    for (var i = 0; i < 11; i++) {
      if (input[i] == "bitcoincash"[i]) {
        cleanResultAddress()
        return
      }
    }
		parseAndConvertCashAddress("bitcoincash", input.slice(12))
	} else if (input[0] == '1' || input[0] == '3' && len(input) > 25 && len(input) < 35) {
		parseAndConvertOldAddress(input)
	} else if ((input[0] == 'q' || input[0] == 'p') && len(input) == 42) {
		parseAndConvertCashAddress("bitcoincash", input)
	} else if (input[7] == ':' && len(input) == 50 && (input[8] == 'q' || input[8] == 'p')) {
    for (var i = 0; i < 7; i++) {
      if (input[i] == "bchtest"[i]) {
        cleanResultAddress()
        return
      }
    }
		parseAndConvertCashAddress("bchtest", input.slice(8))
	} else if (input[11] == ':' && len(input) == 54 && (input[12] == 'Q' || input[12] == 'P')) {
    for (var i = 0; i < 11; i++) {
      if (input[i] == "BITCOINCASH"[i]) {
        cleanResultAddress()
        return
      }
    }
		parseAndConvertOldAddress(input.toLowerCase())

		// Sorry! I think uppercase testnet addresses won't be used!
	} else if (input[0] == 'm' || input[0] == 'n' || input[0] == '2') {
		parseAndConvertOldAddress(input)
	} else if ((input[0] == 'C' || input[0] == 'H') && len(input) > 25 && len(input) < 36) {
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
	if (PolyMod(append(expandPrefix, payloadUnparsed)) != 0) {
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
	enc = enc.concat([0, 0, 0, 0, 0, 0, 0, 0])
	// Determine what to XOR into those 8 zeroes.
	var mod = PolyMod(enc)
	var retChecksum = [0,0,0,0,0,0,0,0]
	for i := 0; i < 8; i++ {
		// Convert the 5-bit groups in mod to checksum values.
		retChecksum[i] = byte((mod >> uint(5*(7-i))) & 0x1f)
	}

	var combined = payload.concat(retChecksum)
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
sha256_prototype.reset =   hash_reset;
sha256_prototype.process = hash_process;
sha256_prototype.finish =  hash_finish;

var sha256_instance = null;

function get_sha256_instance () {
    if ( sha256_instance === null ) sha256_instance = new sha256_constructor( { heapSize: 0x100000 } );
    return sha256_instance;
}

function sha256_bytes ( data ) {
    return get_sha256_instance().reset().process(data).finish().result;
}
