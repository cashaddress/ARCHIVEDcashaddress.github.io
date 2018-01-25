var correctedAddress = ""
var qrcode = new QRCode("qrcode", {
    text: "",
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.M
});
var qrcode2 = new QRCode("qrcode2", {
    text: "",
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.M
});

window.onload = window.onhashchange = function() {
  document.getElementById('addressToTranslate').value = window.location.hash.slice(1)
  document.getElementById('addressToTranslate').oninput()
}

document.getElementById('demo').onclick = function() {
  window.location.hash = '#1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu';
}

document.getElementsByClassName('btn btn-outline-primary btn-lg btn-block')[0].onclick = function() {
  document.getElementById("addressToTranslate").value = "";
  cleanResultAddress();
}

document.getElementById('correctedButton').onclick = function() {
  document.getElementById('correctedButton').style = "display: none"
  document.getElementById('addressToTranslate').value = correctedAddress
  document.getElementById('addressToTranslate').oninput()
}

document.getElementById('copy').onclick = function() {
  document.getElementById('resultAddress').select();
  document.execCommand('Copy');
  window.getSelection().removeAllRanges();
  this.innerHTML = 'Copied';
}

document.getElementById("addressToTranslate").oninput = function() {
  cleanResultAddress();
  input = document.getElementById("addressToTranslate").value;
  try {
    if (
      input[11] == ":" &&
      input.length == 54 &&
      (input[12] == "q" || input[12] == "p")
    ) {
      for (var i = 0; i < 11; i++) {
        if (input[i] != "bitcoincash"[i]) {
          cleanResultAddress();
          return;
        }
      }
      setResultOldAddress(
        parseAndConvertCashAddress("bitcoincash", input.slice(12))
      );
    } else if (
      input[0] == "1" ||
      (input[0] == "3" && input.length > 25 && input.length < 35)
    ) {
      setResultCashAddress(parseAndConvertOldAddress(input));
    } else if ((input[0] == "q" || input[0] == "p") && input.length == 42) {
      setResultOldAddress(parseAndConvertCashAddress("bitcoincash", input));
    } else if (
      input[7] == ":" &&
      input.length == 50 &&
      (input[8] == "q" || input[8] == "p")
    ) {
      for (var i = 0; i < 7; i++) {
        if (input[i] != "bchtest"[i]) {
          cleanResultAddress();
          return;
        }
      }
      setResultOldAddress(
        parseAndConvertCashAddress("bchtest", input.slice(8))
      );
    } else if (
      input[11] == ":" &&
      input.length == 54 &&
      (input[12] == "Q" || input[12] == "P")
    ) {
      for (var i = 0; i < 11; i++) {
        if (input[i] != "BITCOINCASH"[i]) {
          cleanResultAddress();
          return;
        }
      }
      setResultCashAddress(parseAndConvertOldAddress(input.toLowerCase()));
    } else if (input[0] == "m" || input[0] == "n" || input[0] == "2") {
      setResultCashAddress(parseAndConvertOldAddress(input));
    } else if (
      (input[0] == "C" || input[0] == "H") &&
      input.length > 25 &&
      input.length < 36
    ) {
      setResultCashAddress(parseAndConvertOldAddress(input));
    } else {
      cleanResultAddress();
    }
  } catch (e) {
    cleanResultAddress();
  }
};

function setResultOldAddress(a) {
  // Error correction
  if (a == "") {return}
  qrcode.makeCode(document.getElementById("addressToTranslate").value.toUpperCase());
  document.getElementById("qrcode").style = "display: inline-block;";
  document.getElementById("resultAddress").value = a;
  qrcode2.makeCode(document.getElementById("resultAddress").value);
  document.getElementById("qrcode2").style = "display: inline-block;";
  document.getElementById("resultAddressBlock").style.display = "block";
  this.innerHTML = 'Copy';
}

function setResultCashAddress(a) {
  qrcode.makeCode(document.getElementById("addressToTranslate").value);
  document.getElementById("qrcode").style = "display: inline-block;";
  document.getElementById("resultAddress").value = a;
  qrcode2.makeCode(document.getElementById("resultAddress").value.toUpperCase());
  document.getElementById("qrcode2").style = "display: inline-block;";
  document.getElementById("resultAddressBlock").style.display = "block";
  this.innerHTML = 'Copy';
}

function cleanResultAddress() {
  document.getElementById("resultAddress").value = "";
  document.getElementById("resultAddressBlock").style.display = "none";
  document.getElementById("correctedButton").style = "display: none";
  document.getElementById("qrcode2").style = "display: none;";
  document.getElementById("qrcode").style = "display: none;";
  this.innerHTML = 'Copy';
}
