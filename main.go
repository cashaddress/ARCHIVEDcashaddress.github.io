package main

import (
	"crypto/sha256"
	"github.com/gopherjs/gopherjs/js"
	"math/big"
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

// require base-x to avoid "math/big" (1.2 MB JS!)
// Assume the input is .toLowerCase() if it starts with "bitcoincash:"
func main() {
	// js.Global.Set("bs58", "require('base-x')('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')")
	input = js.Global.Get("document").Call("getElementById", "addressToTranslate").Get("value").String()
	if input[11] == ':' && len(input) == 54 && (input[12] == 'q' || input[12] == 'p') {
		for a, b := range input[0:11] {
			if b != rune("bitcoincash"[a]) {
				return
			}
		}
		parseAndConvertCashAddress("bitcoincash", input[12:])
	} else if input[0] == '1' || input[0] == '3' {
		parseAndConvertOldAddress(input)
	} else if (input[0] == 'q' || input[0] == 'p') && len(input) == 42 {
		parseAndConvertCashAddress("bitcoincash", input[:])
	} else {
		js.Global.Get("document").Call("getElementById", "resultAddress").Set("value", "")
	}
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
	if PolyMod(append([]byte{2, 9, 20, 3, 15, 9, 14, 3, 1, 19, 8, 0}, payloadUnparsed...)) != 0 {
		return
	}
	// Also drop the checsum
	// TODO: Fix the range
	payload := convertBits(payloadUnparsed[:len(payloadUnparsed)-8], 5, 8, false)
	addressType := payload[0] >> 3 // 0 or 1
	craftOldAddress(addressType, payload[1:21])
}

func craftOldAddress(kind byte, addressHash []byte) {
	if kind == 0 {
		CheckEncodeBase58(addressHash[:], 0x00)
	} else {
		CheckEncodeBase58(addressHash[:], 0x05)
	}
}
func CheckEncodeBase58(input []byte, version byte) {
	b := make([]byte, 0, 1+len(input)+4)
	b = append(b, version)
	b = append(b, input[:]...)
	var checksum []byte
	h := sha256.Sum256(b)
	h2 := sha256.Sum256(h[:])
	copy(checksum, []byte(h2[:4]))
	//	fmt.Println("%x %x %v", checksum, []byte(h2[:4]), len(checksum))
	b = append(b, h2[:4]...)
	//fmt.Println("%x", b[len(b)-4:])
	//println(js.Global.Get("bs58").Call("encode", b).String())

	js.Global.Get("document").Call("getElementById", "resultAddress").Set("value", EncodeBase58Simplified(b))
	//println(EncodeBase58(b))
}

func EncodeBase58Simplified(b []byte) string {
	// var bigRadix = big.NewInt(58)
	// var bigZero = big.NewInt(0)
	alphabetIdx0 := '1'
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

	// TODO: Is this required?
	// leading zero bytes
	for _, i := range b {
		if i != 0 {
			break
		}
		digits = append(digits, byte(alphabetIdx0))
	}
	answer := []byte{}
	for t := len(digits) - 1; t >= 0; t -= 1 {
		answer = append(answer, byte(alphabet[digits[t]]))
	}
	return string(answer)
}

func parseAndConvertOldAddress(oldAddress string) {
	var bigRadix = big.NewInt(58)
	var b58 = [256]byte{
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 0, 1, 2, 3, 4, 5, 6,
		7, 8, 255, 255, 255, 255, 255, 255,
		255, 9, 10, 11, 12, 13, 14, 15,
		16, 255, 17, 18, 19, 20, 21, 255,
		22, 23, 24, 25, 26, 27, 28, 29,
		30, 31, 32, 255, 255, 255, 255, 255,
		255, 33, 34, 35, 36, 37, 38, 39,
		40, 41, 42, 43, 255, 44, 45, 46,
		47, 48, 49, 50, 51, 52, 53, 54,
		55, 56, 57, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
		255, 255, 255, 255, 255, 255, 255, 255,
	}
	alphabetIdx0 := '1'
	answer := big.NewInt(0)
	j := big.NewInt(1)

	scratch := new(big.Int)
	for i := len(oldAddress) - 1; i >= 0; i-- {
		tmp := b58[oldAddress[i]]
		if tmp == 255 {
			return
		}
		scratch.SetInt64(int64(tmp))
		scratch.Mul(j, scratch)
		answer.Add(answer, scratch)
		j.Mul(j, bigRadix)
	}

	tmpval := answer.Bytes()

	var numZeros int
	for numZeros = 0; numZeros < len(oldAddress); numZeros++ {
		if oldAddress[numZeros] != byte(alphabetIdx0) {
			break
		}
	}
	flen := numZeros + len(tmpval)
	val := make([]byte, flen)
	copy(val[numZeros:], tmpval)
	if len(val) < 5 {
		return
	}
	version := val[0]
	h := sha256.Sum256(val[:len(val)-4])
	h2 := sha256.Sum256(h[:])
	if h2[0] != val[len(val)-4] || h2[1] != val[len(val)-3] || h2[2] != val[len(val)-2] || h2[3] != val[len(val)-1] {
		return
	}
	payload := val[1 : len(val)-4]
	if version == 0x00 {
		craftCashAddress(0, payload)
	} else if version == 0x05 {
		craftCashAddress(1, payload)
	}
}

func craftCashAddress(kind uint, addressHash []byte) {
	payload := packCashAddressData(kind, addressHash)
	//checksum := CreateChecksum(prefix, payload)

	enc := append([]byte{2, 9, 20, 3, 15, 9, 14, 3, 1, 19, 8, 0}, payload...)
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
	ret := "bitcoincash:"

	for _, c := range combined {
		ret += string(CHARSET[c])
	}
	js.Global.Get("document").Call("getElementById", "resultAddress").Set("value", ret)
	// solution := ret
}

/*func packAddressData(AddressType byte, addrHash []byte) []byte {
	// Pack addr data with version byte.
	if AddressType != 0 && AddressType != 1 {
		return []byte{}
	}
	versionByte := uint(AddressType) << 3
	encodedSize := (uint(len(addrHash)) - 20) / 4
	if (len(addrHash)-20)%4 != 0 {
		return []byte{}
	}
	if encodedSize < 0 || encodedSize > 8 {
		return []byte{}
	}
	versionByte |= encodedSize
	var addrHashUint []byte
	for _, e := range addrHash {
		addrHashUint = append(addrHashUint, byte(e))
	}
	data := append([]byte{byte(versionByte)}, addrHashUint...)
	packedData := convertBits(data, 8, 5, true)
	if packedData == nil {
		return []byte{}
	}
	return packedData
}*/

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

/*func stringReplacer(s string, charsToBeReplaced []rune, newChars []rune) {
	var t []byte
	for i, k := range s {
		if contains(charsToBeReplaced, k) {
			t = append(t, newChars[i])
		} else {
			t = append(t, k)
		}
	}
}

func contains(s []rune, e rune) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}*/
