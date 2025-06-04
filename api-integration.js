#!/usr/bin/env node

/**
 * API Integration Script - Dashboard de Investimentos
 * ===================================================
 * Este script carrega as configurações de APIs do arquivo .env
 * e atualiza automaticamente o arquivo api-config.js
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

console.log('🔄 Integrando configurações de APIs...');

// Verificar variáveis de ambiente
const alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
const apiNinjasKey = process.env.API_NINJAS_KEY || 'YOUR_API_KEY';
const coinGeckoKey = process.env.COINGECKO_API_KEY || null;

// Atualizar configuração API
const apiConfigPath = path.join(__dirname, 'api-config.js');

// Ler arquivo atual
let apiConfig;

try {
  apiConfig = fs.readFileSync(apiConfigPath, 'utf8');
} catch (error) {
  console.error('❌ Erro ao ler arquivo api-config.js:', error.message);
  process.exit(1);
}

// Atualizar chaves API
console.log('📝 Atualizando chaves API...');
apiConfig = apiConfig.replace(/apiKey: ['"]demo['"]/, `apiKey: '${alphaVantageKey}'`);
apiConfig = apiConfig.replace(/'X-Api-Key': ['"]YOUR_API_KEY['"]/, `'X-Api-Key': '${apiNinjasKey}'`);

if (coinGeckoKey) {
  apiConfig = apiConfig.replace(/apiKey: null/, `apiKey: '${coinGeckoKey}'`);
}

// Salvar arquivo atualizado
try {
  fs.writeFileSync(apiConfigPath, apiConfig, 'utf8');
  console.log('✅ Configuração de APIs atualizada com sucesso!');
} catch (error) {
  console.error('❌ Erro ao salvar arquivo api-config.js:', error.message);
  process.exit(1);
}

// Testar APIs
console.log('🧪 Testando conexões com APIs...');

// Testar CoinGecko API
console.log('🔄 Testando CoinGecko API...');
fetch('https://api.coingecko.com/api/v3/ping')
  .then(response => {
    if (response.ok) {
      console.log('✅ CoinGecko API: Conectado com sucesso');
    } else {
      console.log('⚠️ CoinGecko API: Resposta não-OK:', response.status);
    }
  })
  .catch(error => console.log('❌ CoinGecko API: Erro de conexão:', error.message));

// Testar Alpha Vantage API
console.log('🔄 Testando Alpha Vantage API...');
fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=${alphaVantageKey}`)
  .then(response => response.json())
  .then(data => {
    if (data && !data.Note && !data['Error Message']) {
      console.log('✅ Alpha Vantage API: Conectado com sucesso');
    } else if (data.Note) {
      console.log('⚠️ Alpha Vantage API: Limite de chamadas atingido');
    } else {
      console.log('⚠️ Alpha Vantage API: Erro na resposta:', data['Error Message'] || 'Formato desconhecido');
    }
  })
  .catch(error => console.log('❌ Alpha Vantage API: Erro de conexão:', error.message));

// Testar API Ninjas (Euribor)
console.log('🔄 Testando API Ninjas (Euribor)...');
fetch('https://api.api-ninjas.com/v1/euribor', {
  headers: {
    'X-Api-Key': apiNinjasKey
  }
})
  .then(response => {
    if (response.ok) {
      console.log('✅ API Ninjas (Euribor): Conectado com sucesso');
    } else {
      console.log('⚠️ API Ninjas (Euribor): Resposta não-OK:', response.status);
    }
  })
  .catch(error => console.log('❌ API Ninjas (Euribor): Erro de conexão:', error.message));

console.log('✅ Teste de APIs concluído');
console.log('💡 Se alguma API falhou, verifique suas chaves no arquivo .env');
