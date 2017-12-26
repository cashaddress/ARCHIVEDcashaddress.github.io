package main

/*import (
	"crypto/sha256"
	"github.com/gopherjs/gopherjs/js"
)

// https://github.com/cryptocoinjs/base-x/blob/master/index.js
// base-x encoding
// Forked from https://github.com/cryptocoinjs/bs58
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas
// Merged Buffer refactorings from base58-native by Stephen Pair
// Copyright (c) 2013 BitPay Inc

// The MIT License (MIT)
//
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
//
// Copyright (c) 2013-2016 The btcsuite developers
//
// Permission to use, copy, modify, and distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

// <div class='printchatbox' id='printchatbox'></div>
// <input type='text' name='fname' class='chatinput' id='chatinput'>
// document.getElementById('chatinput').onkeyup = function(){
//    document.getElementById('printchatbox').innerHTML = inputBox.value;
// }

// var input = ...
var input string

var CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"

func main() {
	input = js.Global.Get("document").Call("getElementById", "addressToTranslate").Get("value").String()
	if input[11] == ':' && len(input) == 54 && (input[12] == 'q' || input[12] == 'p') {
		for a, b := range input[0:11] {
			if b != rune("bitcoincash"[a]) {
				cleanResultAddress()
				return
			}
		}
		parseAndConvertCashAddress("bitcoincash", input[12:])
	} else if input[0] == '1' || input[0] == '3' && len(input) > 25 && len(input) < 35 {
		parseAndConvertOldAddress(input)
	} else if (input[0] == 'q' || input[0] == 'p') && len(input) == 42 {
		parseAndConvertCashAddress("bitcoincash", input[:])
	} else if input[7] == ':' && len(input) == 50 && (input[8] == 'q' || input[8] == 'p') {
		for a, b := range input[0:7] {
			if b != rune("bchtest"[a]) {
				cleanResultAddress()
				return
			}
		}
		parseAndConvertCashAddress("bchtest", input[8:])
	} else if input[11] == ':' && len(input) == 54 && (input[12] == 'Q' || input[12] == 'P') {
		stringLowercase := ""
		for _, i := range input[12:] {
			stringLowercase = stringLowercase + string(0x20|rune(i))
		}
		for a, b := range input[0:11] {
			if b != rune("BITCOINCASH"[a]) {
				cleanResultAddress()
				return
			}
		}
		parseAndConvertCashAddress("bitcoincash", stringLowercase[:])

		// Sorry! I think uppercase testnet addresses won't be used!
	} else if input[0] == 'm' || input[0] == 'n' || input[0] == '2' {
		parseAndConvertOldAddress(input)
	} else if (input[0] == 'C' || input[0] == 'H') && len(input) > 25 && len(input) < 36 {
		parseAndConvertOldAddress(input)
	} else {
		cleanResultAddress()
	}
}

func cleanResultAddress() {
	js.Global.Get("document").Call("getElementById", "resultAddress").Set("value", "")
	js.Global.Get("document").Call("getElementById", "resultAddressBlock").Get("style").Set("display", "none")
}

func parseAndConvertCashAddress(prefix string, payloadString string) {
	// PolyMod(append(ExpandPrefix("bitcoincash"), payload...)) != 0
	//payload := []byte(payloadString)
	var payloadUnparsed []byte
	for _, x := range payloadString {
		for i, t := range CHARSET {
			if t == x {
				payloadUnparsed = append(payloadUnparsed, byte(uint8(i)))
			}
		}
	}
	expandPrefix := []byte{}
	// func ExpandPrefix(prefix string) []byte {
	// ret := make(data, len(prefix) + 1)
	// for i := 0; i < len(prefix); i++ {
	//	ret[i] = byte(prefix[i]) & 0x1f;
	// }
	// ret[len(prefix)] = 0;
	// return ret;
	// }
	// https://play.golang.org/p/NMR2ImCmdpZ
	netType := true
	if prefix == "bitcoincash" {
		expandPrefix = []byte{2, 9, 20, 3, 15, 9, 14, 3, 1, 19, 8, 0}
	} else if prefix == "bchtest" {
		expandPrefix = []byte{2, 3, 8, 20, 5, 19, 20, 0}
		netType = false
	} else {
		cleanResultAddress()
		return
	}
	if PolyMod(append(expandPrefix, payloadUnparsed...)) != 0 {
		cleanResultAddress()
		return
	}
	// Also drop the checsum
	// TODO: Fix the range
	payload := convertBits(payloadUnparsed[:len(payloadUnparsed)-8], 5, 8, false)
	if len(payload) == 0 {
		cleanResultAddress()
		return
	}
	addressType := payload[0] >> 3 // 0 or 1
	craftOldAddress(addressType, payload[1:21], netType)
}

func craftOldAddress(kind byte, addressHash []byte, netType bool) {
	if netType {
		if kind == 0 {
			CheckEncodeBase58(addressHash[:], 0x00)
		} else {
			CheckEncodeBase58(addressHash[:], 0x05)
		}
	} else {
		if kind == 0 {
			CheckEncodeBase58(addressHash[:], 0x6f)
		} else {
			CheckEncodeBase58(addressHash[:], 0xc4)
		}
	}
}
func CheckEncodeBase58(input []byte, version byte) {
	b := make([]byte, 0, 1+len(input)+4)
	b = append(b, version)
	b = append(b, input[:]...)
	h := sha256.Sum256(b)
	h2 := sha256.Sum256(h[:])
	//	fmt.Println("%x %x %v", checksum, []byte(h2[:4]), len(checksum))
	b = append(b, h2[:4]...)
	//fmt.Println("%x", b[len(b)-4:])
	//println(js.Global.Get("bs58").Call("encode", b).String())

	js.Global.Get("document").Call("getElementById", "resultAddress").Set("value", EncodeBase58Simplified(b))
	js.Global.Get("document").Call("getElementById", "resultAddressBlock").Get("style").Set("display", "block")
	//println(EncodeBase58(b))
}

func EncodeBase58Simplified(b []byte) string {
	// var bigRadix = big.NewInt(58)
	// var bigZero = big.NewInt(0)
	alphabetIdx0 := 0
	alphabet := "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
	digits := []byte{0}
	for i := 0; i < len(b); i += 1 {
		carry := uint64(b[i])
		for j := 0; j < len(digits); j += 1 {
			carry += uint64(digits[j]) << 8
			digits[j] = byte(carry % 58)
			carry = carry / 58
		}
		for carry > 0 {
			digits = append(digits, byte(carry%58))
			carry = carry / 58
		}
	}

	// leading zero bytes
	for _, i := range b {
		if i != 0 {
			break
		}
		digits = append(digits, byte(alphabetIdx0))
	}

	// reverse
	answer := []byte{}
	for t := len(digits) - 1; t >= 0; t -= 1 {
		answer = append(answer, byte(alphabet[digits[t]]))
	}
	return string(answer)
}

func parseAndConvertOldAddress(oldAddress string) {
	// var ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
	// ALPHABET_MAP := make(map[rune]uint8)
	// for i, e := range ALPHABET {
	// 	ALPHABET_MAP[e] = uint8(i)
	// }
	// fmt.Println(ALPHABET_MAP)
	ALPHABET_MAP := map[byte]uint8{86: 28, 100: 36, 118: 53, 50: 1, 54: 5, 57: 8, 71: 15,
		74: 17, 66: 10, 77: 20, 99: 35, 75: 18, 111: 46, 112: 47, 117: 52, 52: 3, 83: 25, 113: 48,
		67: 11, 68: 12, 98: 34, 104: 40, 121: 56, 85: 27, 122: 57, 109: 44, 115: 50, 56: 7, 72: 16,
		90: 32, 97: 33, 102: 38, 76: 19, 84: 26, 107: 43, 78: 21, 81: 23, 88: 30, 101: 37, 65: 9,
		51: 2, 103: 39, 106: 42, 116: 51, 49: 0, 53: 4, 82: 24, 105: 41, 114: 49, 70: 14, 55: 6,
		69: 13, 87: 29, 89: 31, 120: 55, 80: 22, 110: 45, 119: 54}

	bytes := []byte{0}
	for i := 0; i < len(oldAddress); i++ {
		value := ALPHABET_MAP[oldAddress[i]]
		if value == 0 && oldAddress[i] != byte('1') {
			cleanResultAddress()
			return
		}
		carry := uint64(value)
		for j := 0; j < len(bytes); j += 1 {
			carry += uint64(bytes[j]) * 58
			bytes[j] = byte(carry & 0xff)
			carry = carry >> 8
		}
		for carry > 0 {
			bytes = append(bytes, byte(carry&0xff))
			carry = carry >> 8
		}
	}

	var numZeros int
	for numZeros = 0; numZeros < len(oldAddress); numZeros++ {
		if oldAddress[numZeros] != byte('1') {
			break
		}
	}
	val := make([]byte, numZeros+len(bytes))
	copy(val[:len(bytes)], bytes)

	if len(val) < 5 {
		cleanResultAddress()
		return
	}
	answer := []byte{}
	for t := len(val) - 1; t >= 0; t -= 1 {
		answer = append(answer, val[t])
	}
	version := answer[0]
	h := sha256.Sum256(answer[:len(answer)-4])
	h2 := sha256.Sum256(h[:])
	if h2[0] != answer[len(answer)-4] || h2[1] != answer[len(answer)-3] || h2[2] != answer[len(answer)-2] || h2[3] != answer[len(answer)-1] {
		cleanResultAddress()
		return
	}
	payload := answer[1 : len(answer)-4]
	if version == 0x00 {
		craftCashAddress(0, payload, true)
	} else if version == 0x05 {
		craftCashAddress(1, payload, true)
	} else if version == 0x6f {
		craftCashAddress(0, payload, false)
	} else if version == 0xc4 {
		craftCashAddress(1, payload, false)
	} else if version == 0x1c {
		craftCashAddress(0, payload, true)
	} else if version == 0x28 {
		craftCashAddress(1, payload, true)
	} else {
		cleanResultAddress()
	}
}

func craftCashAddress(kind uint, addressHash []byte, netType bool) {
	payload := packCashAddressData(kind, addressHash)
	//checksum := CreateChecksum(prefix, payload)
	if len(payload) == 0 {
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
	expandPrefix := []byte{}
	if netType == true {
		expandPrefix = []byte{2, 9, 20, 3, 15, 9, 14, 3, 1, 19, 8, 0}
	} else {
		expandPrefix = []byte{2, 3, 8, 20, 5, 19, 20, 0}
	}
	enc := append(expandPrefix, payload...)
	// Append 8 zeroes.
	enc = append(enc, []byte{0, 0, 0, 0, 0, 0, 0, 0}...)
	// Determine what to XOR into those 8 zeroes.
	mod := PolyMod(enc)
	retChecksum := make([]byte, 8)
	for i := 0; i < 8; i++ {
		// Convert the 5-bit groups in mod to checksum values.
		retChecksum[i] = byte((mod >> uint(5*(7-i))) & 0x1f)
	}

	combined := append(payload, retChecksum...)
	ret := ""
	if netType == true {
		ret = "bitcoincash:"
	} else {
		ret = "bchtest:"
	}

	for _, c := range combined {
		ret += string(CHARSET[c])
	}
	if len(ret) == 54 || len(ret) == 50 {
		js.Global.Get("document").Call("getElementById", "resultAddress").Set("value", ret)
		js.Global.Get("document").Call("getElementById", "resultAddressBlock").Get("style").Set("display", "block")
	} else {
		cleanResultAddress()
	}
}

func PolyMod(v []byte) uint64 {
	c := uint64(1)
	for _, d := range v {
		c0 := byte(c >> 35)
		c = ((c & 0x07ffffffff) << 5) ^ uint64(d)
		if c0&0x01 > 0 {
			c ^= 0x98f2bc8e61
		}

		if c0&0x02 > 0 {
			c ^= 0x79b76d99e2
		}

		if c0&0x04 > 0 {
			c ^= 0xf33e5fb3c4
		}

		if c0&0x08 > 0 {
			c ^= 0xae2eabe2a8
		}

		if c0&0x10 > 0 {
			c ^= 0x1e4f43e470
		}
	}
	return c ^ 1
}

func convertBits(data []byte, fromBits uint, tobits uint, pad bool) []byte {
	// General power-of-2 base conversion.
	var uintArr []uint
	for _, i := range data {
		uintArr = append(uintArr, uint(i))
	}
	acc := uint(0)
	bits := uint(0)
	var ret []uint
	maxv := uint((1 << tobits) - 1)
	maxAcc := uint((1 << (fromBits + tobits - 1)) - 1)
	for _, value := range uintArr {
		acc = ((acc << fromBits) | value) & maxAcc
		bits += fromBits
		for bits >= tobits {
			bits -= tobits
			ret = append(ret, (acc>>bits)&maxv)
		}
	}
	if pad {
		if bits > 0 {
			ret = append(ret, (acc<<(tobits-bits))&maxv)
		}
	} else if bits >= fromBits || ((acc<<(tobits-bits))&maxv) != 0 {
		return []byte{}
	}
	var dataArr []byte
	for _, i := range ret {
		dataArr = append(dataArr, byte(i))
	}
	return dataArr
}

func packCashAddressData(addressType uint, addressHash []byte) []byte {
	// Pack addr data with version byte.
	versionByte := uint(addressType) << 3
	encodedSize := (uint(len(addressHash)) - 20) / 4
	if (len(addressHash)-20)%4 != 0 {
		return []byte{}
	}
	if encodedSize < 0 || encodedSize > 8 {
		return []byte{}
	}
	versionByte |= encodedSize
	var addressHashUint []byte
	for _, e := range addressHash {
		addressHashUint = append(addressHashUint, byte(e))
	}
	data := append([]byte{byte(versionByte)}, addressHashUint...)
	packedData := convertBits(data, 8, 5, true)
	return packedData
}
*/
