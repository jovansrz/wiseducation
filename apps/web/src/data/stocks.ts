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
    logo: string;
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
        employees: '25,000+',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/200px-Bank_Central_Asia.svg.png'
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
        employees: '20,000+',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_Telkom_Indonesia_%282013%29.svg/200px-Logo_Telkom_Indonesia_%282013%29.svg.png'
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
        employees: '8,000+',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Gotocompany_logo.svg/200px-Gotocompany_logo.svg.png'
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
        employees: '30,000+',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/200px-Bank_Mandiri_logo_2016.svg.png'
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
        employees: '100,000+',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Astra_International.svg/200px-Astra_International.svg.png'
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
        employees: '5,000+',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Unilever_logo.svg/200px-Unilever_logo.svg.png'
    },
    {
        ticker: 'BBNI',
        name: 'Bank Negara Indonesia',
        price: 4850,
        changePercent: 1.05,
        changeValue: 50.00,
        volume: '38.2M',
        marketCap: '180T',
        peRatio: '9.2x',
        divYield: '5.5%',
        description: 'PT Bank Negara Indonesia (Persero) Tbk is a state-owned bank. It provides banking products and services to commercial and retail customers.',
        sector: 'Finance',
        ceo: 'Royke Tumilaar',
        founded: '1946',
        employees: '28,000+',
        logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/200px-BNI_logo.svg.png'
    },
    {
        ticker: 'BBRI',
        name: 'Bank Rakyat Indonesia',
        price: 4720,
        changePercent: 0.85,
        changeValue: 40.00,
        volume: '125.6M',
        marketCap: '715T',
        peRatio: '12.5x',
        divYield: '6.8%',
        description: 'PT Bank Rakyat Indonesia (Persero) Tbk is the largest bank in Indonesia by assets. It focuses on micro, small, and medium enterprises.',
        sector: 'Finance',
        ceo: 'Sunarso',
        founded: '1895',
        employees: '120,000+',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BRI_2020.svg/200px-BRI_2020.svg.png'
    },
    {
        ticker: 'ANTM',
        name: 'Aneka Tambang',
        price: 1845,
        changePercent: 3.25,
        changeValue: 58.00,
        volume: '89.5M',
        marketCap: '44T',
        peRatio: '8.5x',
        divYield: '2.1%',
        description: 'PT Aneka Tambang Tbk is a state-owned mining company. It is the largest gold producer and nickel ore exporter in Indonesia.',
        sector: 'Mining',
        ceo: 'Nico Kanter',
        founded: '1968',
        employees: '3,500+',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_ANTAM.svg/200px-Logo_ANTAM.svg.png'
    },
    {
        ticker: 'ADRO',
        name: 'Adaro Energy',
        price: 2580,
        changePercent: -2.10,
        changeValue: -55.00,
        volume: '67.3M',
        marketCap: '82T',
        peRatio: '4.2x',
        divYield: '9.5%',
        description: 'PT Adaro Energy Indonesia Tbk is the largest coal producer in the southern hemisphere. It operates coal mining, logistics, and power generation businesses.',
        sector: 'Energy',
        ceo: 'Garibaldi Thohir',
        founded: '2004',
        employees: '15,000+',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Adaro_Energy.svg/200px-Adaro_Energy.svg.png'
    },
    {
        ticker: 'INDF',
        name: 'Indofood Sukses Makmur',
        price: 6425,
        changePercent: 0.55,
        changeValue: 35.00,
        volume: '8.2M',
        marketCap: '56T',
        peRatio: '6.8x',
        divYield: '4.2%',
        description: 'PT Indofood Sukses Makmur Tbk is the largest processed food company in Indonesia. It produces noodles, dairy, snacks, seasonings, and beverages.',
        sector: 'Consumer Goods',
        ceo: 'Anthoni Salim',
        founded: '1990',
        employees: '100,000+',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Indofood_logo.svg/200px-Indofood_logo.svg.png'
    },
    {
        ticker: 'ICBP',
        name: 'Indofood CBP Sukses Makmur',
        price: 10250,
        changePercent: -0.48,
        changeValue: -50.00,
        volume: '5.1M',
        marketCap: '120T',
        peRatio: '18.5x',
        divYield: '2.8%',
        description: 'PT Indofood CBP Sukses Makmur Tbk is a packaged food company. It is known for its Indomie instant noodle brand, one of the largest instant noodle producers globally.',
        sector: 'Consumer Goods',
        ceo: 'Anthoni Salim',
        founded: '2009',
        employees: '50,000+',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Indofood_logo.svg/200px-Indofood_logo.svg.png'
    }
];
