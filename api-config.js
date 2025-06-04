# API Configuration File

```javascript
// api-config.js
// Configuração centralizada das APIs gratuitas

const API_CONFIG = {
    // CoinGecko API - Cryptocurrency data (Gratuita)
    crypto: {
        baseUrl: 'https://api.coingecko.com/api/v3',
        endpoints: {
            price: '/simple/price',
            coins: '/coins/list',
            history: '/coins/{id}/market_chart'
        },
        rateLimits: {
            demo: '30 calls/min', // Plano gratuito
            monthly: '10,000 calls'
        },
        apiKey: null, // Não necessita para o plano gratuito
        attribution: 'Powered by CoinGecko API'
    },

    // Alpha Vantage API - ETFs and Stock data
    etfs: {
        baseUrl: 'https://www.alphavantage.co/query',
        endpoints: {
            quote: '?function=GLOBAL_QUOTE',
            intraday: '?function=TIME_SERIES_INTRADAY',
            daily: '?function=TIME_SERIES_DAILY'
        },
        rateLimits: {
            demo: '25 calls/day', // Plano gratuito
            standard: '500 calls/day'
        },
        apiKey: 'demo', // Substitua pela sua chave API gratuita
        attribution: 'Data provided by Alpha Vantage'
    },

    // API Ninjas - Euribor rates
    euribor: {
        baseUrl: 'https://api.api-ninjas.com/v1',
        endpoints: {
            current: '/euribor',
            historical: '/euriborhistorical'
        },
        rateLimits: {
            free: '1,000 calls/month',
            headers: {
                'X-Api-Key': 'YOUR_API_KEY' // Substitua pela sua chave API gratuita
            }
        },
        attribution: 'Euribor data by API Ninjas'
    }
};

// Função para obter preços de criptomoedas
async function getCryptoPrice(symbols) {
    try {
        const coinIds = symbols.join(',');
        const response = await fetch(`${API_CONFIG.crypto.baseUrl}${API_CONFIG.crypto.endpoints.price}?ids=${coinIds}&vs_currencies=eur`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao obter preços crypto:', error);
        return null;
    }
}

// Função para obter dados de ETFs
async function getETFData(symbol) {
    try {
        const response = await fetch(`${API_CONFIG.etfs.baseUrl}${API_CONFIG.etfs.endpoints.quote}&symbol=${symbol}&apikey=${API_CONFIG.etfs.apiKey}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao obter dados ETF:', error);
        return null;
    }
}

// Função para obter taxas Euribor
async function getEuriborRates() {
    try {
        const response = await fetch(`${API_CONFIG.euribor.baseUrl}${API_CONFIG.euribor.endpoints.current}`, {
            headers: API_CONFIG.euribor.rateLimits.headers
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao obter taxas Euribor:', error);
        return null;
    }
}

// Função para atualizar preços automaticamente
function startPriceUpdates(interval = 300000) { // 5 minutos
    setInterval(async () => {
        console.log('Atualizando preços...');
        await updateAllPrices();
    }, interval);
}

// Função principal para atualizar todos os preços
async function updateAllPrices() {
    const portfolio = getPortfolioFromStorage();
    
    // Atualizar cryptos
    const cryptoSymbols = portfolio.filter(asset => asset.type === 'crypto').map(asset => asset.symbol);
    if (cryptoSymbols.length > 0) {
        const cryptoPrices = await getCryptoPrice(cryptoSymbols);
        updateCryptoPrices(cryptoPrices);
    }
    
    // Atualizar ETFs
    const etfSymbols = portfolio.filter(asset => asset.type === 'etf');
    for (const etf of etfSymbols) {
        const etfData = await getETFData(etf.symbol);
        updateETFPrice(etf.symbol, etfData);
    }
    
    // Atualizar Euribor
    const euriborRates = await getEuriborRates();
    updateEuriborRates(euriborRates);
    
    // Recalcular portfolio
    calculatePortfolioMetrics();
    updateCharts();
}

export { API_CONFIG, getCryptoPrice, getETFData, getEuriborRates, startPriceUpdates, updateAllPrices };
```

## Instruções de Configuração das APIs

### 1. CoinGecko API (Crypto)
- **Plano Gratuito**: 30 calls/min, 10,000 calls/mês
- **Configuração**: Sem necessidade de API key para uso básico
- **URL**: https://www.coingecko.com/en/api

### 2. Alpha Vantage API (ETFs/Stocks)
- **Plano Gratuito**: 25 calls/dia, 500 calls/mês
- **Configuração**: Necessita registar em https://www.alphavantage.co/support/#api-key
- **Substitua**: `'demo'` pela sua chave API

### 3. API Ninjas (Euribor)
- **Plano Gratuito**: 1,000 calls/mês
- **Configuração**: Registe em https://api.api-ninjas.com/
- **Substitua**: `'YOUR_API_KEY'` pela sua chave API

### Como Obter as Chaves API:

#### Alpha Vantage:
1. Aceda a https://www.alphavantage.co/support/#api-key
2. Preencha o formulário com o seu email
3. Receberá a chave API por email
4. Substitua `'demo'` na configuração

#### API Ninjas:
1. Aceda a https://api.api-ninjas.com/
2. Crie uma conta gratuita
3. Aceda ao dashboard e copie a sua API key
4. Substitua `'YOUR_API_KEY'` na configuração