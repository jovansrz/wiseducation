import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

console.log('Type of yahooFinance:', typeof yahooFinance);
console.log('Is instance?', yahooFinance instanceof Object);
// console.log('Keys:', Object.keys(yahooFinance));

try {
    const quote = await yahooFinance.quote('AAPL');
    console.log('Quote successful:', quote.symbol);
} catch (e) {
    console.error('Quote failed:', e);
}
