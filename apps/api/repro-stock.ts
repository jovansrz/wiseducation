
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

async function testTicker(ticker: string) {
    console.log(`Testing ticker: ${ticker}`);
    try {
        const quote = await yahooFinance.quote(ticker);
        console.log(`Success for ${ticker}:`, quote.symbol, quote.regularMarketPrice);
    } catch (error: any) {
        console.error(`Failed for ${ticker}:`, error.message);
    }
}

async function run() {
    await testTicker('BBCA');
    await testTicker('BBCA.JK');
    await testTicker('AAPL');
}

run();
