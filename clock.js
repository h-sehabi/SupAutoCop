var worker = new Worker('startTask.js');
worker.addEventListener('message', workerMessage);
worker.postMessage('start');


var sizeName1;
var sizeName2;
var sizePresence;

var itemName;
var style;
var sizeName;

var itemId;
var styleId;
var sizeId;

var billingName;
var email;
var tel;
var billingAddress;
var billingZip;
var billingCity;
var billingState;
var billingCountry;

var ccNumber;
var ccMonth;
var ccYear;
var ccv;

var waitToCheckout;

function clock() {
    var currentHour = new Date().getHours();
    var currentMin = new Date().getMinutes();
    var currentSec = new Date().getSeconds();

    if(currentHour < 10){
        currentHour = "0" + currentHour;
    } 
    if(currentMin < 10){
        currentMin = "0" + currentMin;
    } 
    if(currentSec < 10){
        currentSec = "0" + currentSec;
    } 

    document.getElementById("clock").innerHTML = currentHour + ":" + currentMin + ":" + currentSec
    var t = setTimeout(clock, 500);
}

function time() {
    currentDay = new Date().getDay();
    currentHour = new Date().getHours();
    currentMin = new Date().getMinutes();
    currentSec = new Date().getSeconds();
  }

function savePayment() {
    billingName = document.getElementById("billingName").value
    email = document.getElementById("email").value
    tel = document.getElementById("tel").value
    billingAddress = document.getElementById("billingAddress").value
    billingZip = document.getElementById("billingZip").value
    billingCity = document.getElementById("billingCity").value
    billingState = document.getElementById("billingState").value
    billingCountry = document.getElementById("billingCountry").value
  
    ccNumber = document.getElementById("ccNumber").value
    ccMonth = document.getElementById("cardMonth").value
    ccYear = document.getElementById("cardYear").value
    ccv = document.getElementById("secNumber").value
  
    var paymentInfo = {
        billingName:billingName, 
        email:email, 
        tel:tel,
        billingAddress:billingAddress, 
        billingZip:billingZip,
        billingCity:billingCity, 
        billingState:billingState, 
        billingCountry:billingCountry,
        ccNumber:ccNumber,
        ccMonth:ccMonth,
        ccYear:ccYear,
        ccv:ccv
        }

    var paymentInfoSerialized = JSON.stringify(paymentInfo);
    localStorage.setItem('paymentInfo', paymentInfoSerialized);
    console.log('payment saved to local machine')
}

function loadPayment() {
    var paymentInfoDeserialized = JSON.parse(localStorage.getItem('paymentInfo'));
    worker.postMessage(paymentInfoDeserialized);
}

function startTask() {
    document.getElementById('dropDetect').innerHTML = "Waiting for drop"
    document.getElementById('startButton').value = "Task running (press to stop)"
}

function startCopping() {
  itemName = document.getElementById("itemName").value;
  style = document.getElementById("style").value;

  sizePresence = document.getElementById("sizePresence").checked;

  if(sizePresence == true){
      sizeName = "N/A"
  } else if(sizePresence == false){
      sizeName1 = document.getElementById("sizeName1").value;
      sizeName2 = document.getElementById("sizeName2").value;

      if(sizeName2 > 0){sizeName = sizeName2} else {sizeName = sizeName1};
  } else {
      console.log('size presence error')
  }; 

  var itemInfo = {itemName:itemName, style:style, sizeName:sizeName};
  worker.postMessage(itemInfo);
}

function workerMessage(e) {
    switch(e.data){
        case 'dropDetect':
            time();
            if(currentHour < 10){
                currentHour = "0" + currentHour;
            } 
            if(currentMin < 10){
                currentMin = "0" + currentMin;
            } 
            if(currentSec < 10){
                currentSec = "0" + currentSec;
            } 
            const dropDetect = "drop detected at: " + currentHour + ":" + currentMin + ":" + currentSec + ":" + new Date().getMilliseconds();

            document.getElementById("dropDetect").innerHTML = dropDetect;
            break;
        case 'L':
            alert('didnt get it:(')
            break;
        case 'Q':
            alert('In the queue, check logs')
            break;
        case 'outOfStock':
            alert("Wasn't fast enough, item sold out")
            break;
        case 'error':
            alert('something went wrong, check logs')
            break;
        default:
            console.log(e.data);
    }
}
