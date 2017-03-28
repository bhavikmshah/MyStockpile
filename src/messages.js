var breakTime = {
        FIFTY : '<break time = "50ms"/>',
        HUNDRED : '<break time = "100ms"/>',
        TWOHUNDRED : '<break time = "200ms"/>',
        TWOFIFTY : '<break time = "250ms"/>',
        THREEHUNDRED : '<break time = "300ms"/>',
        FIVEHUNDRED : '<break time = "500ms"/>'
}


module.exports = {

TOP_TRENDING_STOCK_MSG : 'Top trending stocks are ',
ASK_TOP_TRENDING_STOCK_MSG : 'Would you like to know the top trending stocks ',
ASK_BUY_STOCK_MSG : 'Would you like to buy any stock now?',
ASK_COMPANY_TO_BUY_MSG : 'Which company stock would you like to buy',
ABOUT_STOCKPILE_MSG : `Stockpile makes it easy and affordable to buy stock for yourself, or give gifts of stock to family or friends ${breakTime.FIFTY}
For example, if Amazon is trading at $800 per share, you don’t need to come up with $800 to get started.  You can spend $80 to buy 0.1 shares of Amazon.`,
AMOUNT_STOCK_BUY_MSG :'How much dollar amount of stock would you like to buy for  ',
HELP_MSG : 'One can buy stock or gift stocks',
REPROMPT_MSG : 'Reprompt',
BUY_STOCK_REPROMPT_MSG : 'Would you like to buy any other stock?',
NO_COMPANY_FOUND_MSG : 'No company found by name',
STOP_MESSAGE: 'GoodBye!',
COMPANY_NOT_FOUND_MSG : 'We were not able to find the company. ${breakTime.FIFTY} Can you please repeat the company name',
UNHANDLED_MSG: `am not sure what you mean? ${breakTime.FIFTY} would you require some help?`,
}