package main

import (
	"github.com/gopherjs/gopherjs/js"
)

func main() {
	// polymodInput is (1) expandprefix(prefix).concat(addressHash)
	// or (2) expandprefix(prefix).concat(addressHash).concat(checksum)
	//t := js.Global.Get("polymodInput").Interface().([]uint8)
	//t := js.Global.Call("eval", "polymodInput").Interface().([]uint8)
	var t []uint8
	/*for i := 0; i < js.Global.Get("polymodInput").Length(); i++ {
		t = append(t, uint8(js.Global.Get("polymodInput").Index(i).Uint64()))
	}*/
	t = js.Global.Get("polymodInput").Interface().([]uint8)
	// (1) Is the checksum correct?
	polymod := PolyMod(t)
	if polymod == 0 {
		js.Global.Set("isPolymodCorrect", true)
	} else {
		js.Global.Set("isPolymodCorrect", false)
	}
	// (2) Or do you want to calculate the checksum?
	t = append(t, []byte{0, 0, 0, 0, 0, 0, 0, 0}...)
	polymod = PolyMod(t)
	// ret := make([]uint8, 8)
	var ret [8]uint8
	for i := uint64(0); i < 8; i++ {
		ret[i] = uint8((polymod >> 5 * (7 - i)) & 0x1f)
	}
	js.Global.Set("polymodAppend", ret)
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
