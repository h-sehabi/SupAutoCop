const xhr = new XMLHttpRequest();

var itemName;
var style;
var sizeName;

var itemId;
var styleId;
var sizeId;
var chk;

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

var currentDay;
var currentHour;
var currentMin;
var currentSec;

var mobileStock;
var mobileStockRef;
var slug;

var itemJson;

var waitToCheckout = Number('3500');

self.addEventListener('message', function(e) {
  let data = e.data;
  switch(data) {
    case 'start':
      console.log('starting worker');
      break;
    default:
      switch(data.itemName){
        case this.undefined:
          billingName = data.billingName;
          email = data.email;
          tel = data.tel;
          billingAddress = data.billingAddress;
          billingZip = data.billingZip;
          billingCity = data.billingCity;
          billingState = data.billingState;
          billingCountry = data.billingCountry;
          ccNumber = data.ccNumber;
          ccMonth = data.ccMonth;
          ccYear = data.ccYear;
          ccv = data.ccv;
          console.log('loaded payment info');
          break;
        default:
          itemName = data.itemName;
          style = data.style;
          sizeName = data.sizeName;
          console.log('loaded item info, starting task')
          copDatShit()
          break;
      }
  }
})

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function time() {
    currentDay = new Date().getDay();
    currentHour = new Date().getHours();
    currentMin = new Date().getMinutes();
    currentSec = new Date().getSeconds();
  }

copDatShit = async() => {
  await fetch('https://www.supremenewyork.com/mobile_stock.json').then(function(response) {
    return response.json()
  }).then(data => {
    mobileStockRef = data;
    mobileStock = data;
  })
  
  /*for (time();currentDay != 4 || currentHour < 10 || currentMin < 0 || currentSec < 0;time()) {
    sleep(500);
    console.log('waiting for drop time');
  }   */

  dropDetect = async() => {
    while (mobileStock.release_week == mobileStockRef.release_week) { 
      console.log('hammering');
      sleep(100); 
    await fetch('https://www.supremenewyork.com/mobile_stock.json').then(function(response) {
      return response.json()
    }).then(data => {
      mobileStock = data;
    })
    }
  } 
 //await dropDetect(); 

  self.postMessage('dropDetect');
  console.log('drop detected');
      
  const copTimeStart = Date.now();

  const newCategory = mobileStock.products_and_categories.new;
  console.log(newCategory);
  function myItem (item) {
    return item.name === itemName
      }
  itemId = newCategory.find(myItem).id;
  console.log('item id:', itemId)

  
  await fetch('https://www.supremenewyork.com/shop/' + itemId + '.json').then(function(itemResponse) {
      return itemResponse.json()
    }).then(data => {
      itemJson = data;
    }) 
    const styleJson = itemJson.styles;
    function itemStyle (styleName) {
      return styleName.name === style;
    } 
    styleId = styleJson.find(itemStyle).id;
    console.log('style id:', styleId);
    chk = styleJson.find(itemStyle).chk;
    console.log('chk:', chk);
    
    const sizeJson = styleJson.find(itemStyle).sizes;
    function itemSize (size) {
        return size.name === sizeName;
    }
    sizeId = sizeJson.find(itemSize).id;
    console.log('size id:', sizeId);
    

    cookieSub = encodeURIComponent('{' + sizeId + ':1}');
    xhr.onload = function() { 
      console.log(JSON.parse(this.responseText));
      
      xhr.onload = function() {
        const copTimeEnd = Date.now();
        /*const checkoutResponse = JSON.parse(this.responseText);
        const checkoutTime = copTimeEnd - copTimeStart;
        console.log(checkoutResponse);
          
        console.log('checked out in ', checkoutTime, 'milliseconds');
          
        switch(checkoutResponse.status) {
          case 'failed':
            self.postMessage('L');
            console.log(checkoutResponse.errors);
            break;
          case 'queued':
            xhr.onload = function() {
              console.log(JSON.parse(this.responseText))
            }
            xhr.open('GET', 'https://www.supremenewyork.com/checkout/' + checkoutResponse.slug + '/status.json')
            xhr.send()
            break;
          case 'outOfStock':
            self.postMessage('outOfStock');
            break;
          default:
            self.postMessage('error');
            console.log(checkoutResponse)
            break;*/
        }   
    
      var checkout = new FormData();
      checkout.append('from_mobile', '1');
      checkout.append('cookie-sub', cookieSub);
      checkout.append('current_time', Date.now());
      checkout.append('same_as_billing_address', '1');
      checkout.append('scerkhaj', "CKCRSUJHXH");
      checkout.append('order[billing_name]', billingName);
      checkout.append('order[bn]', billingName);
      checkout.append('order[email]', email);
      checkout.append('order[tel]', tel);
      checkout.append('order[billing_address]', billingAddress);
      checkout.append('order[billing_zip]', billingZip);
      checkout.append('order[billing_city]', billingCity);
      checkout.append('order[billing_state]', billingState);
      checkout.append('order[billing_country]', billingCountry);
      checkout.append('store_address', '1')
      checkout.append('credit_card[type]', 'credit card')
      checkout.append('riearmxa', ccNumber);
      checkout.append('credit_card[month]', ccMonth);
      checkout.append('credit_card[year]', ccYear);
      checkout.append('credit_card[meknk]', ccv);
      checkout.append('order[terms]', '0');
      checkout.append('order[terms]', '1');
      xhr.open('POST', 'https://www.supremenewyork.com/checkout.json');
      sleep(waitToCheckout);
      console.log(checkout);
      xhr.send(checkout);
      console.log("checkout form submitted")
        
    }  
      var addToCart = new FormData();
      addToCart.append('s', sizeId);
      addToCart.append('st', styleId);
      addToCart.append('qty', '1');
      addToCart.append('chk', chk);
      xhr.open('POST','https://www.supremenewyork.com/shop/' + itemId + '/add.json');
      xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')

      // logs contents of addToCart in console
      for (var pair of addToCart.entries()) {
        console.log(pair[0]+ ' - ' + pair[1]); 
    }
    
      xhr.send(addToCart);
      console.log('atc request sent');
  }