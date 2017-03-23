var request = require('request');
var config = require('./config');
var promise = require('promise');

var options = {};

getCompanyDetailsByName = function(companyName,callback){
	var options = {url:config.GET_COMPANY_BY_NAME_URL+companyName};
	request.get(options,(error, response, body) => {
  					if (!error && response.statusCode == 200 && body && body.securitySymbol !== null && '' !== body.securitySymbol) {
    						var result = JSON.parse(body);
    						console.log('Result of  getCompanyDetailsByName'+ JSON.stringify(result));  
    						result.price = result.quote.price;
    						callback(result);										    						    						
  					}
  					else {
						console.log('error in getCompanyDetailsByName'+ JSON.stringify(error) + ' response.statusCode '+ response.statusCode);
  						callback();	
  					}	
				});
}


getTopTrendingStocks = function(callback){
	var options = {url:config.GET_TOP_TRENDING_STOCK_URL};
	console.log('Get Top Trending stock');
	request.get(options,(error, response, body) => {
  					if (!error && response.statusCode == 200 ) {
    						var result = JSON.parse(body);
    						result = result.result;
    						console.log('Result of  getTopTrendingStocks'+ result.length);    										
    						callback(result);
  					}
  					else {
  						console.log('error in getTopTrendingStocks'+ JSON.stringify(error));
  						callback();	
  					}	
				});
}

getCompanyDetailsByCode = function(companyCode,callback){
	var options = {url:config.GET_COMPANY_QUOTE_URL+companyCode};
	console.log('getCompanyDetailsByCode'+ JSON.stringify(options));
  return new Promise((resolve, reject)=>{
    request.get(options,(error, response, body) => {
            if (!error && response.statusCode == 200 ) {
                var result = JSON.parse(body);
                result = result.result;
                console.log('Result of  getCompanyDetailsByCode'+ JSON.stringify(result));                        
                //callback(result);
                resolve(result);
            }
            else {
              reject();
            } 
        });
  });
	

}


function processResult(result,callback){
	var companyList =  result.map(company => {
    										var comp = {};
    										comp.companyName = company.companyName;
    										comp.companyPopularName = company.companyPopularName;
    										comp.companyCode = company.companyCode;
    										comp.price = company.quote.price;
    										return comp;
    									});
    console.log('new Top Trending company list size is '+ companyList.length);	
    callback(companyList);	
}

function getAllCompanyName(){
	request({url:'https://qaapp.stockpiletest.com/app/api/giftitems/pub/withquote/all'},(error,response,body) => {

			if (!error && response.statusCode == 200) {
					var result = JSON.parse(body);
					result.result.forEach((company) => {
						console.log(company.companyPopularName+ ',');
					});
			}
	});
}

function login(userName,passWord,callback){
  var headers = getDefaultHeaders();
  var data = {userName:config.STOCKPILE_USER_NAME,password:config.STOCKPILE_USER_PASSWORD};
  var options = {
    url : config.POST_USER_LOGIN_URL,
    body: data,
    json: true,
    headers
  };

  console.log('options are '+ JSON.stringify(options));
  request.post(options,(error, response, body) => {
            if (!error && response.statusCode == 200 && body.status !== 'ERROR') {
               console.log('Result of  login'+ body);    
                //var result = JSON.parse(body);
                 console.log('Result of  login'+ JSON.stringify(body));    
                var result = body.result;
                console.log('Result of  login'+ JSON.stringify(result));                        
                callback(result);
            }
            else {
              console.log('error in login'+ JSON.stringify(error) + 'response body '+ body+  ' response.statusCode'+ response.statusCode);
              callback(); 
            } 
        });

}

function accountList(authToken,callback){
  console.log(' in accountList helper');
  var headers = getDefaultHeaders();
  headers['x-sp-token'] = authToken;
  var options = {
      url : config.GET_USER_ACCOUNTS_URL,    
      json: true,
      headers
    };
  request.get(options, (error,response,body) => {
      var account;
      if(!error && response.statusCode == 200 && body.status !== 'ERROR') {
        var result = body.result;
        for(var i=0; i<result.length; i++) {
            account = result[i];
            if(account.accountType == 'INDIVIDUAL') {
              console.log('Account found ' +JSON.stringify(account));
              break;
            }
        }
        callback(account);
      } else {
        console.log('Account not found for user');
        callback();
      }

  });

}

function getFees(authToken,accountNumber,dollarAmount,callback){
  console.log('In get fees helper '+ ' accountNumber '+ accountNumber+ ' dollarAmount '+ dollarAmount);
  var data = {dollarAmount:dollarAmount,paymentType:"My account",accountNumber:accountNumber};
  var headers = getDefaultHeaders();
  headers['x-sp-token'] = authToken;
  var options = {
      url : config.GET_STOCK_BUY_FEE_URL,    
      body: data,
      json: true,
      headers
    };
  request.post(options,(error, response, body) => {
            if (!error && response.statusCode == 200 && body.status !== 'ERROR') {
               console.log('Result of  getFees'+ body);                      
               callback(body.result);
            }
            else {
              console.log('error in getFees'+ JSON.stringify(error) + 'response body '+ body+  ' response.statusCode'+ response.statusCode);
              callback(); 
            } 
        });
  
}


function placeOrder(authToken,symbol,itemCode,accountNumber,quantity,callback){
  var headers = getDefaultHeaders();
  headers['x-sp-token'] = authToken;
  
  var data = {
        paymentType:"My account",
        symbol:symbol,
        actionType:"BUY",
        quantity:quantity,
        quantityType:"DOLLARS",
        sourceType:"TRADE_ORDER",
        itemCode:itemCode,
        portfolioAccountId:accountNumber
  };
  var options = {
        url : config.PLACE_ORDER_URL,    
        body: data,
        json: true,
        headers
    };
    console.log("in placeorder "+ JSON.stringify(options));
  request.post(options,(error, response, body) => {
            if (!error && response.statusCode == 200 && body.status !== 'ERROR') {
               console.log('Result of  placeOrder'+ body);                      
               callback(body.result);
            }
            else {
              console.log('error in placeOrder'+ JSON.stringify(error) + 'response body '+ JSON.stringify(body)+  ' response.statusCode'+ response.statusCode);
              callback(undefined,body); 
            } 
        });

}


function getDefaultHeaders() {
  return { 'Accept': 'application/json','Content-Type':'application/json', 'Cache-control': 'no-cache'};
}


module.exports = {
	getCompanyDetailsByName,
	getTopTrendingStocks,
	getCompanyDetailsByCode,
	getAllCompanyName,
  login,
  accountList,
  getFees,
  placeOrder
}