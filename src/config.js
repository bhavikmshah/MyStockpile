module.exports = {

GET_COMPANY_BY_NAME_URL : process.env.GET_COMPANY_BY_NAME_URL || 'http://ec2-35-157-235-48.eu-central-1.compute.amazonaws.com:8080/company/',
GET_TOP_TRENDING_STOCK_URL : process.env.GET_TOP_TRENDING_STOCK_URL || 'https://qaapp.stockpiletest.com/app/api/giftitems/pub/withquote/categorycode/TRENDING',
GET_COMPANY_QUOTE_URL : process.env.GET_COMPANY_QUOTE_URL || 'https://qaapp.stockpiletest.com/app/api/securityInfo/pub/',
}