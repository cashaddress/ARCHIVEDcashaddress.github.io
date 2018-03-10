document.getElementById("address").value = window.location.hash.slice(1);
if (document.getElementById("address").value !== "") {
  addrinput();
}
var intervall;
var currency;
if(!document.queryCommandSupported('paste')) {
  document.getElementById("pasteButton").style = "display: none;";
  document.getElementById("paste2Button").style = "display: none;";
  document.getElementById("address").style = "border-top-right-radius: 1rem;border-bottom-right-radius: 1rem;";
}

document.getElementById("address").oninput = addrinput;

function addrinput(){
  //bitcoincash:?r=https://bitpay.com/i/8tDW8m1x4DNnnUQazw69zf
  if (document.getElementById("address").value.startsWith("bitcoincash:?r=")) {
    document.getElementById("address").value = document.getElementById("address").value.slice(15);
  }
  if (document.getElementById("address").value.startsWith("bitcoin:?r=")) {
    document.getElementById("address").value = document.getElementById("address").value.slice(11);
  }
  window.location.hash = '#' + document.getElementById("address").value;
  if (!document.getElementById("address").value === "") {
    document.getElementById("status").innerHTML = "";
    return;
  }
  if (!document.getElementById("address").value.startsWith("https://bitpay.com/i/")) {
    document.getElementById("status").innerHTML = "Can't recognize link. Make sure you pasted the correct link.";
    return;
  }
  document.getElementById("timer").innerHTML = "";
  document.getElementById("answerbox").innerHTML = '<div class="card-block" style="text-align: center;"><div class="row"><div id="inneranswerbox" class="form-group col"><div id="timer"></div></div></div></div>';
  document.getElementById("status").innerHTML = "";
  document.getElementById("address").readOnly = true;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE) {
        parseResponse(this.responseText, this.status, this.statusText);
    }
  }
  xhr.open('GET', document.getElementById("address").value, true);
  xhr.setRequestHeader("Accept", "application/payment-request");
  xhr.send(null);
  //https://bitpay.com/i/XY5jbvWhajs4Djz8V9PEhH
}

function changeTimer() {
  if (Number(document.getElementById("timer").innerHTML.slice(0, -4).slice(27)) > 0) {
    document.getElementById("timer").innerHTML = "Until deadline in seconds: " + (Number(document.getElementById("timer").innerHTML.slice(27).slice(0, -4))-1) + "<br>";
  } else {
    clearInterval(intervall);
    document.getElementById("resetbutton").click();
    document.getElementById("status").innerHTML = "Too late! Please create a new payment!";
    document.getElementById("address").readOnly = false;
  }
}

function parseResponse(responseText, responseStatusCode, responseStatusText) {
  document.getElementById("answerbox").style = "display: block;";
  if (responseStatusCode != 200) {
    if (responseText === "") {
      document.getElementById("inneranswerbox").innerHTML = responseStatusText + "<br>";
      document.getElementById("inneranswerbox").innerHTML += "Error code: " + responseStatusCode;
    } else {
      document.getElementById("inneranswerbox").innerHTML = responseText;
    }
    document.getElementById("address").readOnly = false;
    return;
  }
  var json = JSON.parse(responseText);
  var a = Math.round((Date.parse(json["expires"]) - Date.now())/1000 - 60);
  if (a < 0) {
    document.getElementById("resetbutton").click();
    document.getElementById("status").innerHTML = "Too late! Please create a new payment!";
    document.getElementById("address").readOnly = false;
    return;
  }
  currency = json["currency"];
  if (json["currency"] == "BCH") {
    document.getElementById("inneranswerbox").innerHTML += "Currency: Bitcoin Cash<br>";
  } else if (json["currency"] == "BTC") {
    document.getElementById("inneranswerbox").innerHTML += "Currency: Bitcoin<br>";
  }
  document.getElementById("inneranswerbox").innerHTML += "Minimum Fee Sat/KiloByte: " + ((Math.floor(Number(json["requiredFeeRate"]))+1)*1e-3 + 0.1).toFixed(5) + "<br>";
  document.getElementById("timer").innerHTML += "Until deadline in seconds: " + a + "<br>";
  intervall = setInterval(changeTimer, 1000);
  document.getElementById("inneranswerbox").innerHTML += "Exact Output Amount (" + json["currency"] + "): " + (Number(json["outputs"][0]["amount"])*1e-8).toFixed(8) + "<br>";
  document.getElementById("inneranswerbox").innerHTML += "Output Address: " + json["outputs"][0]["address"]
  document.getElementById("pushtxbox").style = "display: block;";
}

document.getElementById("pushtxbox").oninput = function(){
  // https://bch-insight.bitpay.com/api/rawtx/7e608c3001330f3b9cf710e0cbc18cbf63ae80a1108c2eea0c46d0a414a6ee6d
  document.getElementById("address").readOnly = true;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
        console.log(this.responseText);
        console.log(this.status);
        console.log(this.statusText);
        try {
          document.getElementById("status2").innerHTML = JSON.parse(this.responseText)["memo"];
          console.log("jna");
        } catch(err) {
          document.getElementById("status2").innerHTML = this.responseText;
          console.log("ajn");
        }
    }
  }
  var b = document.getElementById("pushtx").value;
  if (b.length === 64) {
    var xhr2 = new XMLHttpRequest();
    xhr2.onreadystatechange = function() {
      if (this.readyState == XMLHttpRequest.DONE) {
          try {
            b = JSON.parse(this.responseText)["rawtx"];
            console.log(this.responseText);
            xhr.open('POST', document.getElementById("address").value, true);
            xhr.setRequestHeader("Content-Type", "application/payment");
            console.log("JSON:");
            console.log(b);
            xhr.send(JSON.stringify({"currency": currency, "transactions":[b]}));
          } catch(err) {
            // Now, try Bitcoin.com
            var xhr3 = new XMLHttpRequest();
            xhr3.onreadystatechange = function() {
              if (xhr3.readyState == XMLHttpRequest.DONE) {
                b = JSON.parse(xhr3.responseText)["rawtx"];
                xhr.open('POST', document.getElementById("address").value, true);
                xhr.setRequestHeader("Content-Type", "application/payment");
                xhr.send(JSON.stringify({"currency": currency, "transactions":[b]}));
              }
            }
            xhr.open('POST', document.getElementById("address").value, true);
          }
      }
    }
    xhr2.open('GET', "https://bch-insight.bitpay.com/api/rawtx/" + b, true);
    xhr2.send(null);
  } else {
    xhr.open('POST', document.getElementById("address").value, true);
    xhr.setRequestHeader("Content-Type", "application/payment");
    xhr.send(JSON.stringify({"currency": currency, "transactions": [b]}));
    console.log("JSON:");
    console.log(JSON.stringify({"currency": currency, "transactions": [b]}));
  }
  document.getElementById("address").readOnly = false;
  // value + "?currency=" + currency + "&transactions[]=" + b
  //https://bitpay.com/i/XY5jbvWhajs4Djz8V9PEhH
}

document.getElementById("resetbutton").onclick = function() {
  clearInterval(intervall);
  document.getElementById("answerbox").innerHTML = '<div class="card-block" style="text-align: center;"><div class="row"><div id="inneranswerbox" class="form-group col"><div id="timer"></div></div></div></div>';
  document.getElementById("status").innerHTML = "";
  document.getElementById("answerbox").style = "display: none;";
  document.getElementById("pushtxbox").style = "display: none;";
  document.getElementById("answerbox").value = "";
  document.getElementById("address").readOnly = false;
  document.getElementById("statusText").innerHTML = "";
}
