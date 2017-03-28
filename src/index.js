'use strict';
var Alexa = require('alexa-sdk');
var helper = require('./helper.js');
var message = require('./messages.js');
var promise = require('promise');
var APP_ID = 'amzn1.ask.skill.e815c0ae-8099-410c-bca9-c3c275d7ec8d';  
var nodemailer = require('nodemailer');
var config = require('./config.js');
var moment = require('moment-timezone');

var APP_STATES = {
    START_STATE: "_STARTSTATEMODE", 
    TOP_TRENDING: "_TOPTRENDINGMODE", 
    BUY_STOCK: "_BUYSTOCKMODE",
    START: "_STARTMODE", 
    HELP: "_HELPMODE", 
    PLACE_ORDER : "_PLACEORDERMODE",
    DOLLAR_AMT : "_DOLLARAMTMODE",
    PRICE_STOCK: "_PRICE_STOCK",
};

var breakTime = {
        FIFTY : '<break time = "50ms"/>',
        HUNDRED : '<break time = "100ms"/>',
        TWOHUNDRED : '<break time = "200ms"/>',
        TWOFIFTY : '<break time = "250ms"/>',
        THREEHUNDRED : '<break time = "300ms"/>',
        FIVEHUNDRED : '<break time = "500ms"/>'
};

var help = `Here's what i can do for you. I can help you  ${breakTime.FIFTY} buying any company's stock, 
        ${breakTime.FIFTY} get current stock price of a company,  
        ${breakTime.FIFTY} get top trending stocks and much more,        
        ${breakTime.HUNDRED} What would you like to do now? `;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;  
    alexa.registerHandlers(newSessionHandler,topTrendingHandler,stockToBuyHandler,dollarAmountHandler,placeOrderHandler,startStateHandler,stockPriceHandler);
    alexa.execute();
};



var newSessionHandler = {
  'LaunchRequest': function () {        
        getProfileDetailsOnLogin.call(this);
  },

  'GetTopTrendingStockIntent': function(){ 
        console.log(' in  GetTopTrendingStockIntent');                 
        console.log('alexa in '+ JSON.stringify(this));        
        this.handler.state = APP_STATES.TOP_TRENDING;
        getTopTrendingStocks.call(this,3);
  },

  'GetCompanyPriceIntent' : function(){
       var companyName = this.event.request.intent.slots.companyName.value;
       console.log('GetCompanyPriceIntent :: Price for  '+ companyName);
       this.handler.state = APP_STATES.TOP_TRENDING;
       getStockPrice(companyName,this);
  }, 

  'CompanyToBuyIntent': function(){
      var companyName = this.event.request.intent.slots.companyName.value;      
      console.log('CompanyToBuyIntent :: company to buy stock for is '+ companyName);
      this.handler.state = APP_STATES.BUY_STOCK;
      getStockDtls(companyName,this);
  },

 'GetBalanceIntent' : function(){
      this.handler.state = APP_STATES.START_STATE;
      getBalance.call(this);
  },

 'ContactIntent' : function(){
      this.handler.state = APP_STATES.START_STATE;
      sendEmail.call(this);
  },

 'GetProfileIntent': function(){        
      console.log('GetProfileIntent ::');
      //this.handler.state = APP_STATES.BUY_STOCK;
      this.handler.state = APP_STATES.START_STATE;
      getProfileDetails.call(this);
 },  

 'AboutIntent' : function(){
       this.handler.state = APP_STATES.START_STATE;
       aboutStockpile.call(this);
 },
  
 'Unhandled': function () {    
        this.handler.state = APP_STATES.START_STATE;   
        this.emit(':ask', message.UNHANDLED_MSG);
  },

 'AMAZON.CancelIntent': function () {

      this.emit(':tell', getGoodByeMessage());
  },
    
 'AMAZON.StopIntent': function () {
      this.emit(':tell', getGoodByeMessage());
  },
 
 'AMAZON.HelpIntent': function () {  
      this.handler.state = APP_STATES.START_STATE;      
        helpIntent.call(this);
    },

  'DevelopedByIntent' :  function() {
    this.handler.state = APP_STATES.START_STATE;     
    this.emit(':ask',`this skill is developed by Miles India IT. solutions private limited ? ${breakTime.FIVEHUNDRED} Can i help you with something else`);
  },  
};



var startStateHandler = Alexa.CreateStateHandler(APP_STATES.START_STATE, {
        
   'GetTopTrendingStockIntent': function(){ 
       console.log(' in  GetTopTrendingStockIntent');                 
       console.log('alexa in '+ JSON.stringify(this));        
        this.handler.state = APP_STATES.TOP_TRENDING;
        getTopTrendingStocks.call(this,3);
    },

   'GetCompanyPriceIntent' : function(){
        var companyName = this.event.request.intent.slots.companyName.value;
        console.log('GetCompanyPriceIntent :: Price for  '+ companyName);
        this.handler.state = APP_STATES.TOP_TRENDING;
        getStockPrice(companyName,this);
   }, 

   'CompanyToBuyIntent': function(){
        var companyName = this.event.request.intent.slots.companyName.value;
        console.log('CompanyToBuyIntent :: company to buy stock for is '+ companyName);
        this.handler.state = APP_STATES.BUY_STOCK;
        getStockDtls(companyName,this);
   },

   'GetProfileIntent': function(){        
        console.log('GetProfileIntent ::');
        //this.handler.state = APP_STATES.BUY_STOCK;
        this.handler.state = APP_STATES.START_STATE;
        getProfileDetails.call(this);
   },

   'GetBalanceIntent' : function(){
        this.handler.state = APP_STATES.START_STATE;
        getBalance.call(this);
   },
   'ContactIntent' : function(){
        this.handler.state = APP_STATES.START_STATE;
        sendEmail.call(this);
   },
  
   'AboutIntent' : function(){
       this.handler.state = APP_STATES.START_STATE;
       aboutStockpile.call(this);
   },
  
  'Unhandled': function () {
        this.handler.state = APP_STATES.START_STATE;             
        this.emit(':ask', message.UNHANDLED_MSG);
  },

  'AMAZON.CancelIntent': function () {
        this.emit(':tell', getGoodByeMessage());
  },
    
  'AMAZON.StopIntent': function () {
        this.emit(':tell', getGoodByeMessage());
  },

  'NotNowIntent': function() {
        this.emit(':tell', getGoodByeMessage());
    },

   'AMAZON.YesIntent': function() {
    this.handler.state = APP_STATES.START_STATE;      
        helpIntent.call(this);
        //this.emit(':tell', message.STOP_MESSAGE);
    }, 
  
  'AMAZON.HelpIntent': function () {  
        this.handler.state = APP_STATES.START_STATE;      
        helpIntent.call(this);
    },

  'DevelopedByIntent' :  function() {
    this.handler.state = APP_STATES.START_STATE;     
    this.emit(':ask',`this skill is developed by Miles India IT solutions private limited ? ${breakTime.FIVEHUNDRED} Can i help you with something else`);
  },    

});


var topTrendingHandler = Alexa.CreateStateHandler(APP_STATES.TOP_TRENDING, {
        
    'GetTopTrendingStockIntent': function(){ 
        console.log(' in  GetTopTrendingStockIntent');                 
        console.log('alexa in '+ JSON.stringify(this));        
        this.handler.state = APP_STATES.TOP_TRENDING;
        getTopTrendingStocks.call(this,3);
    },

    'AMAZON.YesIntent': function() {
        this.handler.state = APP_STATES.BUY_STOCK;
        this.emit(':ask',message.ASK_COMPANY_TO_BUY_MSG);
    },

    'NotNowIntent':function(){
        this.handler.state = APP_STATES.START_STATE;
        //placeOrder.call(this);
        this.emit(':ask',`${breakTime.FIVEHUNDRED} Can i help you with something else`);
    }, 

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', getGoodByeMessage());
    },
    
    'AMAZON.StopIntent': function () {
        this.emit(':tell', getGoodByeMessage());
    },

    'AMAZON.HelpIntent': function () {  
        this.handler.state = APP_STATES.START_STATE;      
        helpIntent.call(this);
    },

   'Unhandled': function () {    
        this.handler.state = APP_STATES.START_STATE;   
        this.emit(':ask', message.UNHANDLED_MSG);
    },
});


var dollarAmountHandler =  Alexa.CreateStateHandler(APP_STATES.DOLLAR_AMT, {

    'AMAZON.YesIntent': function() {
        this.handler.state = APP_STATES.DOLLAR_AMT;
        this.emit(':ask',`${message.AMOUNT_STOCK_BUY_MSG} ${this.attributes['currentCompanyName']}`);
    },
    
    'NotNowIntent':function(){
        this.handler.state = APP_STATES.START_STATE;
        //placeOrder.call(this);
        this.emit(':ask',`${breakTime.FIVEHUNDRED} Can i help you with something else`);
    }, 

    'DollarAmountIntent' : function(){
        var amount = this.event.request.intent.slots.amount.value;
        this.handler.state = APP_STATES.DOLLAR_AMT;
        console.log('amount is '+amount);
        if(isNaN(amount)) {
            //this.handler.state = APP_STATES.PLACE_ORDER;
           // this.handler.state = APP_STATES.BUY_STOCK;
           this.handler.state = APP_STATES.DOLLAR_AMT;
            this.emit(':ask','We were not able to process request as the amount spoken seems to be incorrect. Can you please speak out the amount of dollar worth of stock for  '+this.attributes['currentCompanyName']);
        } else {
            this.handler.state = APP_STATES.BUY_STOCK;
            console.log('DollarAmountIntent :: company to buy stock for is '+ this.attributes['currentCompanyName']);
            this.attributes['dollarAmount'] = parseInt(amount,10);
            //this.emit(':tell','We have placed order for ' +amount + ' dollar worth of stock for '+ this.attributes['currentCompanyName']);
            processLoginAndCalcHandlingFees.call(this);
        }
    },

    'AMAZON.HelpIntent': function () {  
    this.handler.state = APP_STATES.START_STATE;      
        helpIntent.call(this);
    },
    
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', getGoodByeMessage());
    },
    
    'AMAZON.StopIntent': function () {
        this.emit(':tell', getGoodByeMessage());
    },

    'Unhandled': function () {    
        this.handler.state = APP_STATES.START_STATE;   
        this.emit(':ask', message.UNHANDLED_MSG);
    }

});

var stockToBuyHandler = Alexa.CreateStateHandler(APP_STATES.BUY_STOCK, {
    'CompanyToBuyIntent': function(){
        var companyName = this.event.request.intent.slots.companyName.value;
        console.log('CompanyToBuyIntent :: company to buy stock for is '+ companyName);
        this.handler.state = APP_STATES.BUY_STOCK;
        getStockDtls(companyName,this);
    },
    
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', getGoodByeMessage());
    },
    
    'AMAZON.StopIntent': function () {
        this.emit(':tell', getGoodByeMessage());
    },

    'AMAZON.HelpIntent': function () {  
        this.handler.state = APP_STATES.START_STATE;      
        helpIntent.call(this);
    },

    'Unhandled': function () {    
        this.handler.state = APP_STATES.START_STATE;   
        this.emit(':ask', message.UNHANDLED_MSG);
    },
});


var stockPriceHandler = Alexa.CreateStateHandler(APP_STATES.PRICE_STOCK, {
    'CompanyToBuyIntent': function(){
        var companyName = this.event.request.intent.slots.companyName.value;
        console.log('GetCompanyPriceIntent :: company to buy stock for is '+ companyName);
        this.handler.state = APP_STATES.BUY_STOCK;
        getStockPrice(companyName,this);
    },

    'GetCompanyPriceIntent' : function(){
        var companyName = this.event.request.intent.slots.companyName.value;
        console.log('GetCompanyPriceIntent :: Price for  '+ companyName);        
        getStockPrice(companyName,this);
   }, 
       
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', getGoodByeMessage());
    },
    
    'AMAZON.StopIntent': function () {
        this.emit(':tell', getGoodByeMessage());
    },

    'AMAZON.HelpIntent': function () {  
        this.handler.state = APP_STATES.START_STATE;      
        helpIntent.call(this);
    },
    
    'Unhandled': function () {           
        this.handler.state = APP_STATES.START_STATE;   
        this.emit(':ask', message.UNHANDLED_MSG);
    }
});


var placeOrderHandler = Alexa.CreateStateHandler(APP_STATES.PLACE_ORDER, {
    'AMAZON.YesIntent': function() {
        this.handler.state = APP_STATES.PLACE_ORDER;
        placeOrder.call(this);
        //this.emit(':ask',message.ASK_COMPANY_TO_BUY_MSG);
    },

    'NotNowIntent':function(){
        this.handler.state = APP_STATES.START_STATE;
        //placeOrder.call(this);
        this.emit(':ask',`${breakTime.FIVEHUNDRED} What else would you like to do ?`);
    }, 

    'AMAZON.NoIntent': function() {
        this.handler.state = APP_STATES.START_STATE;
        //placeOrder.call(this);
        this.emit(':ask',`${breakTime.FIVEHUNDRED} What else would you like to do ?`);
    },

     'AMAZON.CancelIntent': function () {
        this.emit(':tell', getGoodByeMessage());
    },
    
    'AMAZON.StopIntent': function () {
        this.emit(':tell', getGoodByeMessage());
    },

    'AMAZON.HelpIntent': function () {  
        this.handler.state = APP_STATES.START_STATE;      
        helpIntent.call(this);
    },

   'Unhandled': function () {    
         this.handler.state = APP_STATES.START_STATE;    
        this.emit(':ask', message.UNHANDLED_MSG);
    }
});


function getTopTrendingStocks(numberOfStock){
    console.log(' call to getTopTrendingStocks');    
        helper.getTopTrendingStocks((result) => {
                if(result){
                    var output = `The top ${numberOfStock} trending stocks with their price per shares are as follows: ${breakTime.FIFTY}`;
                    for(var i=0;i<numberOfStock;i++){
                        var company = result[i];
                        output = output + '  '+ (i+1) + breakTime.HUNDRED + company.companyName + breakTime.HUNDRED + company.quote.price+ ' dollars.'+ breakTime.HUNDRED;
                        output = output + breakTime.FIFTY; 
                    }
                    console.log(output);                    
                    output = output.toString().replace(/&/g,'and');
                    var cardOutput =  output.replace(/<.*>/g, "");                    
                    output = output +  breakTime.HUNDRED +  message.ASK_BUY_STOCK_MSG;
                    console.log('Speech let response is '+ output);  
                    
                    this.emit(":askWithCard",output,message.ASK_BUY_STOCK_MSG,'Top Trending Stocks', cardOutput);
                } else {
                    var output = 'We were not able to fullfill your request';                    
                    this.emit(":ask",output);
                }
        });        
}

function getStockDtls(companyName,alexa,callback){
    if(!companyName || null === companyName || '' === companyName) {
            alexa.handler.state = APP_STATES.BUY_STOCK;
            console.log('company is ' + companyName +  'output  getStockDtls is   :: '+ JSON.stringify(message.COMPANY_NOT_FOUND_MSG));
            alexa.emit(':ask', message.COMPANY_NOT_FOUND_MSG);
            return;
    }

    helper.getCompanyDetailsByName(companyName,(result) => {
        if(result && result.companyCode && (null != result.securitySymbol || '' !== result.securitySymbol)) {            
            helper.getCompanyDetailsByCode(result.securitySymbol).then((data)=>{
                /*var output = 'Price per share of '+ companyName + ' is '+ result.stockStats + pricePerShare
                output = output + ' ' + breakTime.HUNDRED + message.AMOUNT_STOCK_BUY_MSG + ' '+ companyName;*/
                var output = `Price per share of ${companyName} is ${data.stockStats.pricePerShare} dollars ${breakTime.HUNDRED} ${message.AMOUNT_STOCK_BUY_MSG}`;
                console.log('output  getStockDtls is :: '+ JSON.stringify(output));
                alexa.attributes.currentCompanyName = companyName;
                alexa.attributes.currentCompany = result;
                //alexa.attributes.currentCompanyCode = result;
                alexa.handler.state = APP_STATES.DOLLAR_AMT;
                alexa.emit(':ask', output);
            }).catch((error) => {
                //var output = `We were not able to find the company. ${breakTime.FIFTY} Can you please repeat the company name`;
                alexa.handler.state = APP_STATES.BUY_STOCK;
                console.log('output  getStockDtls is   :: '+ JSON.stringify(message.COMPANY_NOT_FOUND_MSG));
                alexa.emit(':ask', message.COMPANY_NOT_FOUND_MSG);
            });
             
        } else {
            //var output = `We were not able to find the company. ${breakTime.FIFTY} Can you please repeat the company name`;
            console.log('output  getStockDtls is :: '+ JSON.stringify(message.COMPANY_NOT_FOUND_MSG));
            alexa.handler.state = APP_STATES.BUY_STOCK;
            alexa.emit(':ask', message.COMPANY_NOT_FOUND_MSG);
        }
    });
    
}

function getStockPrice(companyName,alexa,callback){

    if(!companyName || null === companyName || '' === companyName) {
            alexa.handler.state = APP_STATES.PRICE_STOCK;
            console.log('company is ' + companyName +  'output  getStockDtls is   :: '+ JSON.stringify(message.COMPANY_NOT_FOUND_MSG));
            alexa.emit(':ask', message.COMPANY_NOT_FOUND_MSG);
            return;
    }

    helper.getCompanyDetailsByName(companyName,(result) => {
        if(result && result.companyCode && (null != result.securitySymbol || '' !== result.securitySymbol)) {            
            helper.getCompanyDetailsByCode(result.securitySymbol).then((data)=>{
                /*var output = 'Price per share of '+ companyName + ' is '+ result.stockStats + pricePerShare
                output = output + ' ' + breakTime.HUNDRED + message.AMOUNT_STOCK_BUY_MSG + ' '+ companyName;*/
                var output = `Price per share of ${companyName} is ${data.stockStats.pricePerShare} dollars ${breakTime.HUNDRED} Would you like to buy stock of ${companyName} ?`;
                console.log('output  getStockDtls is :: '+ JSON.stringify(output));
                alexa.attributes.currentCompanyName = companyName;
                alexa.attributes.currentCompany = result;
                //alexa.attributes.currentCompanyCode = result;
                alexa.handler.state = APP_STATES.DOLLAR_AMT;
                alexa.emit(':ask', output);
            }).catch((error) => {
                //var output = `We were not able to find the company ${breakTime.FIFTY}  Can you please repeat the company name`;
                console.log('output  getStockDtls is 11  :: '+ JSON.stringify(message.COMPANY_NOT_FOUND_MSG));
                alexa.handler.state = APP_STATES.PRICE_STOCK;
                alexa.emit(':ask', message.COMPANY_NOT_FOUND_MSG);
            });
             
        } else {
            //var output = COMPANY_NOT_FOUND_MSG;
            console.log('output  getStockDtls is :: '+ JSON.stringify(message.COMPANY_NOT_FOUND_MSG));
            alexa.handler.state = APP_STATES.PRICE_STOCK;
            alexa.emit(':ask', message.COMPANY_NOT_FOUND_MSG);
        }
    });
    
}

//getStockDtls('facebook');
function processLoginAndCalcHandlingFees(){
    var token;
    var accountNumber;
    helper.login(undefined,undefined,(result) => {
        if(result) {
            console.log('login successfull');
            token = result.token;  
            this.attributes['x-sp-token'] = token;  
            helper.accountList(token,(account) => {
                if(account) {
                    console.log('got account list');
                    accountNumber = account.number;
                    this.attributes['accountNumber']  = accountNumber;
                    helper.getFees(token,accountNumber,10, (result) => {
                        if(result) {
                            console.log('Handling fees is '+ result);
                            this.attributes['handlingFees']  = result;
                            var totalAmt = parseInt(this.attributes['dollarAmount'],10) + parseFloat(result);
                            /*var speechOut = "Transaction fee for buying "+ this.attributes['dollarAmount'] + "dollars of "+
                            this.attributes['currentCompanyName']+ " is " + this.attributes['handlingFees'] + " dollars."+
                            breakTime.FIFTY + "Total is " + totalAmt +  " dollars. " + breakTime.HUNDRED + "Would you like to place the order ? ";*/
                            var speechOut = `Transaction fees for buying  ${this.attributes['dollarAmount']} dollars of ${this.attributes['currentCompanyName']} 
                                             is ${this.attributes['handlingFees']} dollars. 
                                             ${breakTime.FIFTY} Total amount for this purchase will be ${totalAmt} dollars ${breakTime.HUNDRED}. 
                                             The available cash balance in your stockpile account is ${account.cashBalance} dollars.  
                                             ${breakTime.HUNDRED} Would you like to place the order now ?`;

                            //var speechOut = 'abc';
                            console.log('speech output '+ speechOut);    
                            this.handler.state = APP_STATES.PLACE_ORDER;                           
                            this.emit(":ask",speechOut);
                                
                        } else {
                            this.handler.state = APP_STATES.TOP_TRENDING;
                            this.emit(":ask", `Error processing the request. ${breakTime.FIVEHUNDRED} Would you like to buy stock of any other company ?`);
                        }
                    });
                } else {
                        this.handler.state = APP_STATES.TOP_TRENDING;
                        this.emit(":ask", `Error processing the request. ${breakTime.FIVEHUNDRED} Would you like to buy stock of any other company ?`);
                }
            });

        } else {
                this.handler.state = APP_STATES.TOP_TRENDING;
                this.emit(":ask", `Error processing the request. ${breakTime.FIVEHUNDRED} Would you like to buy stock of any other company ?`);
        }        
        
    });
}


function getProfileDetails(){
    var token;
    var accountNumber;
    helper.login(undefined,undefined,(result) => {
        if(result) {
            console.log('login successfull');
            token = result.token;  
            this.attributes['x-sp-token'] = token;  
            helper.accountList(token,(account) => {
                if(account) {
                    console.log('got account list');
                    accountNumber = account.number;
                    this.attributes['accountNumber']  = accountNumber;
                    var phone = ` <say-as interpret-as="telephone"> ${account.owner.preferredPhone.toString()} </say-as>` ;
                    var phoneNumber = phone;
                    /*for (var i = 0; i < phone.length; i++) {
                        phoneNumber += ' ' + phone[i];
                    }*/
                    var speechOut = `${account.owner.firstName} ${breakTime.HUNDRED} here's what we know about you 
                    ${breakTime.HUNDRED} Your registered phone number is ${phoneNumber} ${breakTime.HUNDRED}
                    Email address is ${account.owner.primaryEmail} ${breakTime.HUNDRED} . Current cash balance on account is ${account.cashBalance} dollars
                    ${breakTime.FIVEHUNDRED} What else would you like to do?`;
                    var cardOutput =  speechOut.replace(/<.*>/g, "");
                    this.emit(":askWithCard",speechOut,speechOut,'Profile details',cardOutput);
                } else {
                        this.emit(":tell", "error processing the request");
                }
            });

        } else {
                this.emit(":tell", "error processing the request");
        }        
        
    });
}


function getProfileDetailsOnLogin(){
    var token;
    var accountNumber;
    helper.login(undefined,undefined,(result) => {
        if(result) {
            console.log('login successfull');
            token = result.token;  
            this.attributes['x-sp-token'] = token;  
            helper.accountList(token,(account) => {
                if(account) {
                    console.log('got account list');
                    accountNumber = account.number;
                    this.attributes['accountNumber']  = accountNumber;
                    var phone = account.owner.preferredPhone.toString() ;
                    var phoneNumber = '';
                    for (var i = 0; i < phone.length; i++) {
                        phoneNumber += ' ' + phone[i];
                    }
                    var speechOut = `Hello ${account.owner.firstName} ${breakTime.HUNDRED} ${help}? `;
                    //var cardOutput =  speechOut.replace(/<.*>/g, "");
                    this.emit(":ask",speechOut,speechOut);
                } else {
                        this.emit(":tell", "Error processing the request");
                }
            });

        } else {
                this.emit(":tell", "error processing the request");
        }        
        
    });
}


function placeOrder(){

    var company = this.attributes['currentCompany'];
    var code = company.companyCode;
    var itemCode = company.giftItemCode;
    var quantity = this.attributes['dollarAmount'];
    var accountNumber = this.attributes['accountNumber'];
    var token = this.attributes['x-sp-token'];

    helper.placeOrder(token,code,itemCode,accountNumber,quantity,(result,error) => {
        if(result) {
            var cardOutput = `The order for ${quantity} dollar worth of ${this.attributes['currentCompanyName']} shares has been placed successfully`;
            this.handler.state = APP_STATES.TOP_TRENDING;
            //var cardOutput = 
            this.emit(":askWithCard",`Order is successfully placed. ${breakTime.FIVEHUNDRED} Would you like to buy any other company stock?`,'Would you like to buy any other company stock?','Order Confirmation',cardOutput);
        } else {
            if(error.error.messages && error.error.messages.length > 0 && error.error.messages[0].code ==='TRDORD-2018') {
                this.handler.state = APP_STATES.TOP_TRENDING;
                var speechOut = `The order for ${this.attributes['currentCompanyName']} is already pending. ${breakTime.HUNDRED} Would you like to buy any other company stock? `;
                this.emit(":ask",speechOut);
            } else {
                this.handler.state = APP_STATES.TOP_TRENDING;
                this.emit(":ask",`Error while placing the order. ${breakTime.FIVEHUNDRED} Would you like to buy any other company stock?`);
            }
        }
    });
}


function getBalance(){
    var token;
        var accountNumber;
        helper.login(undefined,undefined,(result) => {
            if(result) {
                console.log('login successfull');
                token = result.token;  
                this.attributes['x-sp-token'] = token;  
                helper.accountList(token,(account) => {
                    if(account) {
                        console.log('got account list');
                        accountNumber = account.number;
                        this.attributes['accountNumber']  = accountNumber;                        
                        var speechOut = ` Current cash balance in your stockpile account is ${account.cashBalance} dollars
                        ${breakTime.FIVEHUNDRED} Can i help you with something else?`;
                        var cardOutput =  speechOut.replace(/<.*>/g, "");
                        this.emit(":askWithCard",speechOut,speechOut,'Profile details',cardOutput);
                    } else {
                            this.emit(":tell", "error processing the request");
                    }
                });

            } else {
                    this.emit(":tell", "error processing the request");
            }        
            
        });
}





function sendEmail() { 
// send mail with defined transport object

// create reusable transporter object using the default SMTP transport
console.log('  process.env.FROM_USER_EMAIL_ADDR '+  process.env.FROM_USER_EMAIL_ADDR + ' process.env.EMAIL_PASSWORD '+ process.env.EMAIL_PASSWORD);
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.FROM_USER_EMAIL_ADDR || 'bhavik.shah@miles.in',
        pass: config.EMAIL_PASSWORD 
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: config.FROM_USER_EMAIL_ADDR || '<bhavik.shah@miles.in>', // sender address
    to:   config.TO_USER_EMAIL_ADDR || 'bhavik.shah@miles.in', // list of receivers
    subject: 'Hello ?', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
};

    var token;
    var accountNumber;
    helper.login(undefined,undefined,(result) => {
            if(result) {
                console.log('login successfull');
                token = result.token;  
                this.attributes['x-sp-token'] = token;  
                helper.accountList(token,(account) => {
                    if(account) {
                        console.log('got account list');
                        accountNumber = account.number;
                        this.attributes['accountNumber']  = accountNumber;
                        mailOptions.subject = `Please contact customer ${account.owner.firstName} ${account.owner.lastName} (${account.number})`;
                        mailOptions.text = `Email : ${account.owner.primaryEmail}`;
                        mailOptions.html = `Please contact customer  ${account.owner.firstName} ${account.owner.lastName}. <br/> <br/> 
                                            <b>Stockpile Account Number -</b> ${account.number} <br/>
                                            <b>Email -</b> ${account.owner.primaryEmail} <br/> 
                                            <b>Phone -</b> ${account.owner.preferredPhone} <br/><br/>
                                            <font style="color: #dedede">Alexa for Stockpile</font>`;
                        console.log('mail options are '+ JSON.stringify(mailOptions));

                        var speechOut = ` Your request has been registered. Someone from stockpile team will reach out to you soon. 
                        ${breakTime.FIVEHUNDRED} Can i help you with something else?`;

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                 this.emit(":ask", "error processing the request");                               
                            } else {
                                 this.emit(":ask",speechOut);
                            }
                        });
                       
                    } else {
                            this.emit(":ask", "error processing the request. Can i help you with something else?");
                    }
                });

            } else {
                    this.emit(":ask", "error processing the request. Can i help you with something else?");
            }        
            
        });

}


function helpIntent(){
    this.emit(":ask",`I can help you  ${breakTime.FIFTY} buying any company's stock, 
        ${breakTime.FIFTY} get current stock price of a company,  
        ${breakTime.FIFTY} get top trending stocks,        
        ${breakTime.FIFTY} get your current stockpile account balance, 
        ${breakTime.FIFTY} get information about your stockpile profile,         
        ${breakTime.FIFTY} ask stockpile to contact you. ${breakTime.HUNDRED} What would you like to do now? `);
}

function aboutStockpile(){
    this.emit(":ask",message.ABOUT_STOCKPILE_MSG + `${breakTime.FIVEHUNDRED} Can i help you with something else?`);
}


function getGoodByeMessage(){

    var hours = moment(new Date()).tz('America/Los_Angeles').format('HH');
    var h = parseInt(hours);
    console.log('hour is '+h);
    if(h >= 4 && h<=16){
        return 'Good Bye!! Have a nice day';
    } else if(h>16 && h<=20) {
        return 'Good Bye!! Have a good evening';
    } else {
        return 'Good Bye! Have a good night';
    }
}