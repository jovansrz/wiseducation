import YahooFinance from 'yahoo-finance2';

console.log('Type:', typeof YahooFinance);

try {
    // Try to instantiate it assuming it's a class
    const yf = new YahooFinance();
    console.log('Instantiation successful');
    const quote = await yf.quote('AAPL');
    console.log('Quote successful:', quote.symbol);
} catch (e) {
    console.error('Test failed:', e);
}
