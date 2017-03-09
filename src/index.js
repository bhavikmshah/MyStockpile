'use strict';
var Alexa = require('alexa-sdk');
var helper = require('./helper.js');
var message = require('./messages.js');
var APP_ID = 'amzn1.ask.skill.e815c0ae-8099-410c-bca9-c3c275d7ec8d';  // TODO replace with your app ID (OPTIONAL).

var APP_STATES = {
    TRIVIA: "_TRIVIAMODE", // Asking trivia questions.
    START: "_STARTMODE", // Entry point, start the game.
    HELP: "_HELPMODE" // The user is asking for help.
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(launchHandler);
    alexa.execute();
};

var launchHandler = {
    'LaunchRequest': function () {
        this.emit(':tell',message.ABOUT_STOCKPILE_MSG);
    },  
    
    'GetTopTrendingStockIntent': function(){   
        
        console.log(' in  GetTopTrendingStockIntent');                 
        console.log('alexa in '+ JSON.stringify(this));        
        //this.emit(":ask",'The top trending stocks are 1 Abercrombie Fitch Co price per share is 11.82');
        getTopTrendingStocks.call(this,5);
        
    },
    'AMAZON.YesIntent': function() {
        this.emit(':ask',message.ASK_COMPANY_TO_BUY_MSG);

    },
    'CompanyToBuyIntent': function(){
        var companyName = this.event.request.intent.slots.companyName.value;
        console.log('CompanyToBuyIntent :: company to buy stock for is '+ companyName);
        getStockDtls(companyName,this);
        //this.emit(':ask',output,);
    },
    'DollarAmountIntent' : function(){
        var amount = this.event.request.intent.slots.amount.value;
        console.log('DollarAmountIntent :: company to buy stock for is '+ this.attributes['currentCompanyName']);
        this.emit(':tell','We have placed order for ' +amount + ' dollar worth of stock for '+ this.attributes['currentCompanyName']);
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = message.HELP_MESSAGE;
        var reprompt = message.HELP_MESSAGE;
        this.emit(':ask', speechOutput, reprompt);
    },
    
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', message.STOP_MESSAGE);
    },
    
    'AMAZON.StopIntent': function () {
        this.emit(':tell', message.STOP_MESSAGE);
    }
};


/*function getCompanyDetails(company){

}*/

function getTopTrendingStocks(numberOfStock){
    console.log(' call to getTopTrendingStocks');
    //callback('top 5 trending stocks are amazon, facebook');
        helper.getTopTrendingStocks((result) => {
                if(result){
                    var output = "The top trending stocks are";
                    for(var i=0;i<numberOfStock;i++){
                        var company = result[i];
                        output = output + '  '+ (i+1) + ' ' + company.companyName + ' price per share is '+ company.quote.price+ '.';
                    }
                    console.log(output);
                    console.log(typeof output);
                    output = output.toString().replace(/&/g,'and');
                    console.log('Speech let response is '+ output);   
                    
                    this.emit(":ask",output,message.ASK_BUY_STOCK_MSG);
                } else {
                    var output = 'We were not able to fullfill you request';
                    
                    this.emit(":ask",output);
                }
        });
        //callback(self,'The top trending stocks are 1. Wal-Mart Stores, Inc. price per share is 69.8. 2. Abercrombie & Fitch Co. price per share is 11.82. 3. Prada S.p.A. ADR price per share is 8.025. 4. Snap Inc. price per share is 22.81. 5. Time Warner Inc. price per share is 98.51.');
}

function getStockDtls(companyName,alexa,callback){
    helper.getCompanyDetailsByName(companyName,(result) => {
        if(result) {
            console.log('output  getStockDtls is :: '+ JSON.stringify(output));
             var output = message.AMOUNT_STOCK_BUY_MSG + ' '+ companyName;
             alexa.attributes.currentCompanyName = companyName;
             alexa.attributes.currentCompany = result;
             alexa.emit(':ask', output);
        } else {
            var output = 'We were not able to fullfill your request';
            console.log('output  getStockDtls is :: '+ JSON.stringify(output));
            alexa.emit(':tell', output);
        }
    });
    
}
/*helper.getCompanyDetailsByName('facebook',(response,error) => {
        console.log('getCompanyDetailsByName :: ' + JSON.stringify(response));

        helper.getTopTrendingStocks((response,error) => {
                console.log('getTopTrendingStocks :: ' + JSON.stringify(response));

                helper.getCompanyDetailsByCode('GOOGL',(response,error) => {
                    console.log('getCompanyDetailsByCode  :: '+ JSON.stringify(response));
                });
        });

});*/

//helper.getAllCompanyName();

