export interface Stock {
    ticker: string;
    name: string;
    price: number;
    changePercent: number;
    changeValue: number;
    volume: string;
    marketCap: string;
    peRatio: string;
    divYield: string;
    description: string;
    sector: string;
    ceo: string;
    founded: string;
    employees: string;
}

export const stocks: Stock[] = [
    {
        ticker: 'BBCA',
        name: 'Bank Central Asia',
        price: 8900,
        changePercent: 1.25,
        changeValue: 110.00,
        volume: '52.4M',
        marketCap: '1,098T',
        peRatio: '24.5x',
        divYield: '2.85%',
        description: 'PT Bank Central Asia Tbk (BCA) provides commercial banking and other financial services. The Company operates through Transaction Banking, Corporate Banking, Commercial & SME Banking, Individual Banking, and Treasury & International Banking segments.',
        sector: 'Finance',
        ceo: 'Jahja Setiaatmadja',
        founded: '1957',
        employees: '25,000+'
    },
    {
        ticker: 'TLKM',
        name: 'Telkom Indonesia',
        price: 3950,
        changePercent: -0.85,
        changeValue: -34.00,
        volume: '85.2M',
        marketCap: '391T',
        peRatio: '15.2x',
        divYield: '3.5%',
        description: 'PT Telkom Indonesia (Persero) Tbk is a state-owned information and communications technology enterprise and telecommunications network in Indonesia.',
        sector: 'Telecommunication',
        ceo: 'Ririek Adriansyah',
        founded: '1965',
        employees: '20,000+'
    },
    {
        ticker: 'GOTO',
        name: 'GoTo Gojek Tokopedia',
        price: 92,
        changePercent: 2.17,
        changeValue: 2.00,
        volume: '1.2B',
        marketCap: '109T',
        peRatio: '-',
        divYield: '-',
        description: 'PT GoTo Gojek Tokopedia Tbk is an Indonesian holding company. The Company includes Gojek, Tokopedia, and GoTo Financial.',
        sector: 'Technology',
        ceo: 'Patrick Walujo',
        founded: '2010',
        employees: '8,000+'
    },
    {
        ticker: 'BMRI',
        name: 'Bank Mandiri',
        price: 5875,
        changePercent: 0.45,
        changeValue: 25.00,
        volume: '45.1M',
        marketCap: '548T',
        peRatio: '11.8x',
        divYield: '4.1%',
        description: 'PT Bank Mandiri (Persero) Tbk provides various banking products and services in Indonesia and internationally.',
        sector: 'Finance',
        ceo: 'Darmawan Junaidi',
        founded: '1998',
        employees: '30,000+'
    },
    {
        ticker: 'ASII',
        name: 'Astra International',
        price: 5600,
        changePercent: 0.00,
        changeValue: 0.00,
        volume: '23.5M',
        marketCap: '226T',
        peRatio: '7.5x',
        divYield: '8.2%',
        description: 'PT Astra International Tbk is an Indonesian conglomerate. It operates in automotive, financial services, heavy equipment, mining, construction, energy, agribusiness, infrastructure, logistics, information technology, and property.',
        sector: 'Conglomerate',
        ceo: 'Djony Bunarto Tjondro',
        founded: '1957',
        employees: '100,000+'
    },
    {
        ticker: 'UNVR',
        name: 'Unilever Indonesia',
        price: 3320,
        changePercent: -1.45,
        changeValue: -50.00,
        volume: '12.1M',
        marketCap: '126T',
        peRatio: '28.1x',
        divYield: '3.1%',
        description: 'PT Unilever Indonesia Tbk engages in the manufacturing, marketing, and distribution of consumer goods including soaps, detergents, dairy based foods, ice cream, tea based beverages and cosmetic products.',
        sector: 'Consumer Goods',
        ceo: 'Ira Noviarti',
        founded: '1933',
        employees: '5,000+'
    }
];
