var request = require('request');
var config = require('./config');

var options = {};

getCompanyDetailsByName = function(companyName,callback){
	var options = {url:config.GET_COMPANY_BY_NAME_URL+companyName};
	request.get(options,(error, response, body) => {
  					if (!error && response.statusCode == 200) {
    						var result = JSON.parse(body);
    						console.log('Result of  getCompanyDetailsByName'+ JSON.stringify(result));  
    						result.price = result.quote.price;
    						callback(result);										    						    						
  					}
  					else {
						console.log('error in getTopTrendingStocks'+ JSON.stringify(error) + ' response.statusCode '+ response.statusCode);
  						callback();	
  					}	
				});
}


getTopTrendingStocks = function(callback){
	var options = {url:config.GET_TOP_TRENDING_STOCK_URL};
	console.log('Get Top Trending stock');
	request.get(options,(error, response, body) => {
  					if (!error && response.statusCode == 200) {
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
	console.log('getCompanyDetailsByCode');
	request.get(options,(error, response, body) => {
  					if (!error && response.statusCode == 200) {
    						var result = JSON.parse(body);
    						result = result.result;
    						console.log('Result of  getCompanyDetailsByCode'+ JSON.stringify(result));    										
    						callback(result);
  					}
  					else {
  						console.log('error in getTopTrendingStocks'+ JSON.stringify(error));
  						callback();	
  					}	
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

module.exports = {
	getCompanyDetailsByName,
	getTopTrendingStocks,
	getCompanyDetailsByCode,
	getAllCompanyName
}