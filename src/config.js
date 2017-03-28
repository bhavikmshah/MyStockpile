module.exports = {

GET_COMPANY_BY_NAME_URL : process.env.GET_COMPANY_BY_NAME_URL || 'http://ec2-35-157-235-48.eu-central-1.compute.amazonaws.com:8080/company/',
GET_TOP_TRENDING_STOCK_URL : process.env.GET_TOP_TRENDING_STOCK_URL || 'https://qaapp.stockpiletest.com/app/api/giftitems/pub/withquote/categorycode/TRENDING',
GET_COMPANY_QUOTE_URL : process.env.GET_COMPANY_QUOTE_URL || 'https://qaapp.stockpiletest.com/app/api/securityInfo/pub/',
GET_USER_ACCOUNTS_URL : process.env.GET_USER_ACCOUNTS_URL || 'https://qaapp.stockpiletest.com/app/api/accounts/sec/accountList',
POST_USER_LOGIN_URL : process.env.POST_USER_LOGIN_URL || 'https://qaapp.stockpiletest.com/app/apiv2/pub/auth/loginForToken',
GET_STOCK_BUY_FEE_URL : process.env.POST_USER_LOGIN_URL || 'https://qaapp.stockpiletest.com/app/api/clientorders/sec/previewTotalBuyFee',
PLACE_ORDER_URL : process.env.PLACE_ORDER_URL || 'https://qaapp.stockpiletest.com/app/api/clientorders/sec/create',
FROM_USER_EMAIL_ADDR : process.env.FROM_USER_EMAIL_ADDR || '<bhavik.shah@miles.in>',
TO_USER_EMAIL_ADDR : process.env.TO_USER_EMAIL_ADDR || 'bhavik.shah@miles.in',
EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
STOCKPILE_USER_NAME : process.env.STOCKPILE_USER_NAME,
STOCKPILE_USER_PASSWORD : process.env.STOCKPILE_USER_PASSWORD,
GET_ALL_CREDITCARDS_URL : process.env.GET_ALL_CARDS_OF_USER || 'https://qaapp.stockpiletest.com/app/api/accounts/sec/allcards', 
}