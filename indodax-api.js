async function getTicker(pair = 'btc_idr') {
  const url = `https://indodax.com/api/${pair}/ticker`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Gagal mengambil data: ${response.statusText}`);
    }
    const data = await response.json();
    return data.ticker;
  } catch (error) {
    console.error(`Error di getTicker untuk pair ${pair}:`, error);
    return null;
  }
}

async function getAllTickers() {
  const url = 'https://indodax.com/api/tickers';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Gagal mengambil data: ${response.statusText}`);
    }
    const data = await response.json();
    return data.tickers;
  } catch (error) {
    console.error('Error di getAllTickers:', error);
    return null;
  }
}

async function getTrades(pair = 'btc_idr') {
  const url = `https://indodax.com/api/${pair}/trades`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Gagal mengambil data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error di getTrades untuk pair ${pair}:`, error);
    return null;
  }
}

async function getDepth(pair = 'btc_idr') {
  const url = `https://indodax.com/api/${pair}/depth`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Gagal mengambil data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error di getDepth untuk pair ${pair}:`, error);
    return null;
  }
}

module.exports = {
  getTicker,
  getAllTickers,
  getTrades,
  getDepth
};
