const basePath = "https://finnhub.io/api/v1";

export const searchSymbol = async (query) => {
  const url = `${basePath}/search?q=${query}&token=${process.env.REACT_APP_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};

export const fetchStockDetails = async (stockSymbol) => {
  const url = `${basePath}/stock/profile2?symbol=${stockSymbol}&token=${process.env.REACT_APP_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};

export const fetchQuote = async (stockSymbol) => {
  const url = `${basePath}/quote?symbol=${stockSymbol}&token=${process.env.REACT_APP_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};

export const fetchHistoricalData = async (
  stockSymbol,
  resolution,
  from,
  to
) => {
  const url = `${basePath}/stock/candle?symbol=${stockSymbol}&resolution=${resolution}&from=${from}&to=${to}&token=${process.env.REACT_APP_API_KEY}`;
  console.log(url)
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};


export const fetchHistoricalDataAlphaVantage = async () => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=IBM&apikey=demo`;
  
    console.log(url);
    const response = await fetch(url);
  
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      throw new Error(message);
    }
  
    const data = await response.json();
    const timeSeriesKey = `Time Series (MONTHLY)`;
  
    if (!data[timeSeriesKey]) {
      throw new Error('Invalid response from Alpha Vantage API');
    }
  
    const currentDate = new Date();
    const oneYearAgoDate = new Date();
    oneYearAgoDate.setFullYear(currentDate.getFullYear() - 1);
  
    const filteredData = Object.entries(data[timeSeriesKey]).reduce((acc, [date, value]) => {
      const recordDate = new Date(date);
      if (recordDate >= oneYearAgoDate && recordDate <= currentDate) {
        acc[date] = value;
      }
      return acc;
    }, {});
  
    return filteredData;
  };
