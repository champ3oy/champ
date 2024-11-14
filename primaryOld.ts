import cluster from "cluster";
import os from "os";
import { WebSocket } from "ws";
import { MONGO_URI, SYMBOLS } from "./utils/constant";
import {
  constantsIds,
  convertToNewYorkTime,
  getMarketStatusColor,
} from "./api/util";
import {
  calculateNAVandPrice,
  getCISholdings,
  getTodayAndThreeDaysAgo,
  performanceChartDate,
  portfolioSummary,
} from "./api/apiFuncs";
import NodeCache from "node-cache";
import { Price } from "./models/PriceModel";
import cron from "node-cron";
import mongoose from "mongoose";
import EventEmitter from "events";
import { authService, checkAccessToken } from "./api/authService";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

let priceSignal = new EventEmitter();

priceSignal.on("price", async (data) => {
  console.log("Adding item to db: ", data.symbol);
  const priceDoc = new Price(data);
  const result = await priceDoc.save();
  console.log("Item added successfully", result.symbol);
});

// // Event emitter for XAU prices
// var priceSignalXAU = new EventEmitter();

// priceSignalXAU.on("price", async (data) => {
//   console.log("Adding XAU item to db: ", data.symbol);
//   const priceDoc = new Price(data);
//   const result = await priceDoc.save();
//   console.log("XAU item added successfully", result.symbol);
// });

const cache = new NodeCache({ stdTTL: 86400 });
const cacheXAU = new NodeCache({ stdTTL: 86400 });
const cacheTickers = new NodeCache();

// GMSI
var liveTickers: any = {};
var prevClosePrices: any = {};
var cachedSummary: any = null;
var cachedHoldingList: any = null;
var cachedHoldings: any = null;
// XAU
var liveTickersXAU: any = {};
var prevClosePricesXAU: any = {};
var cachedSummaryXAU: any = null;
var cachedHoldingListXAU: any = null;
var cachedHoldingsXAU: any = null;

const saveTicker = (symbol, data) => {
  liveTickers[symbol] = data;
  cacheTickers.set("TICKERS", liveTickers);
};

(async () => {
  await authService.initialize();
})();

const initializeDataGMSI = async () => {
  // cache.flushAll();
  try {
    const ticker = "GMSI";
    const { today, yesterday, threeDaysAgo } = getTodayAndThreeDaysAgo();

    cachedHoldings = await getCISholdings(ticker, yesterday);
    cachedHoldingList = await performanceChartDate(
      constantsIds[ticker],
      threeDaysAgo,
      today
    );
    // console.log("cachedHoldingList", cachedHoldingList);

    cachedHoldings?.map((x) => {
      prevClosePrices[x?.symbol] = x?.marketPrice;
    });

    if (cachedHoldingList) {
      const actualHolding = cachedHoldingList?.benchmark[constantsIds[ticker]];
      if (actualHolding && actualHolding[2]?.marketQuoteTimestamp) {
        cachedSummary = await portfolioSummary(
          ticker,
          actualHolding[2].marketQuoteTimestamp
        );
      }
    }

    // console.log("cachedSummary", cachedSummary);
    cachedHoldings?.forEach((holding: any) => {
      liveTickers[holding.symbol] = {
        price: holding.marketPrice,
        currency: holding.currency?.symbol,
        prevClose: Number(prevClosePrices[holding.symbol]) ?? 0,
        equity: Number(
          (holding.marketValueOrCurrentValueWithCurrency / cachedSummary?.nav) *
            100
        ).toFixed(2),
      };
    });
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};

// Call initializeDataGMSI and then access global variables
(async () => {
  await initializeDataGMSI();
})();

// Function to initialize data for XAU
const initializeDataXAU = async () => {
  cacheXAU.flushAll();
  try {
    const ticker = "XAU";
    const { today, yesterday, threeDaysAgo } = getTodayAndThreeDaysAgo();

    cachedHoldingsXAU = await getCISholdings(ticker, yesterday);
    cachedHoldingListXAU = await performanceChartDate(
      constantsIds[ticker],
      threeDaysAgo,
      today
    );

    cachedHoldingsXAU?.map((x) => {
      prevClosePricesXAU[x?.symbol] = x?.marketPrice;
    });

    if (cachedHoldingListXAU) {
      const actualHolding =
        cachedHoldingListXAU?.benchmark[constantsIds[ticker]];
      if (actualHolding && actualHolding[2]?.marketQuoteTimestamp) {
        cachedSummaryXAU = await portfolioSummary(
          ticker,
          actualHolding[2].marketQuoteTimestamp
        );
      }
    }

    cachedHoldingsXAU?.forEach((holding: any) => {
      liveTickersXAU[holding.symbol] = {
        price: holding.marketPrice,
        currency: holding.currency?.symbol,
        prevClose: Number(prevClosePricesXAU[holding.symbol]) ?? 0,
        equity: Number(
          (holding.marketValueOrCurrentValueWithCurrency /
            cachedSummaryXAU?.nav) *
            100
        ).toFixed(2),
      };
    });
  } catch (error) {
    console.error("Error initializing XAU data:", error);
  }
};

// Call initializeDataXAU and then access global variables
(async () => {
  await initializeDataXAU();
})();

const cpuCount = os.cpus().length;
// const cpuCount = 1;

console.log(`CPU count: ${cpuCount}`);
console.log(`Primary ID: ${process.pid}`);

// Set up primary cluster by pointing to the path of the main application, in this case index.js
cluster.setupPrimary({
  exec: __dirname + "/index.js",
});

const connectToTwelveDataGMSI = () => {
  const tws = new WebSocket(
    "wss://ws.twelvedata.com/v1/quotes/price?apikey=45fcdc6327c4415d8beac682b55f74c0"
  );

  tws.on("open", () => {
    console.log("Connected to TwelveData WebSocket for GMSI");

    const subscribeMessage = JSON.stringify({
      action: "subscribe",
      params: {
        symbols: SYMBOLS,
      },
    });
    tws.send(subscribeMessage);
  });

  tws.on("message", async (data) => {
    const message = data.toString();
    let msg = JSON.parse(message);
    var processedData = await processData(
      JSON.stringify({ ...msg, type: "GMSI" })
    );

    // Send data to all workers
    for (const id in cluster.workers) {
      cluster.workers[id].send(processedData);
    }
  });

  tws.on("close", () => {
    console.log("Disconnected from TwelveData WebSocket for GMSI");
    setTimeout(connectToTwelveDataGMSI, 5000); // Try reconnecting after 5 seconds
  });

  tws.on("error", (error) => {
    console.error("WebSocket error for GMSI:", error);
    tws.close(); // Close the WebSocket on error
  });
};

connectToTwelveDataGMSI();

// New function to connect to TwelveData for XAU
const connectToTwelveDataXAU = () => {
  const tws = new WebSocket(
    "wss://ws.twelvedata.com/v1/quotes/price?apikey=45fcdc6327c4415d8beac682b55f74c0"
  );

  tws.on("open", () => {
    console.log("Connected to TwelveData WebSocket for XAU");

    const subscribeMessage = JSON.stringify({
      action: "subscribe",
      params: {
        symbols: "XAU/USD", // Assuming you want to subscribe to XAU/USD
      },
    });
    tws.send(subscribeMessage);
  });

  tws.on("message", async (data) => {
    const message = data.toString();
    let msg = JSON.parse(message);
    var processedData = await processDataXAU(
      JSON.stringify({ type: "XAU", ...msg })
    );

    // Send data to all workers
    for (const id in cluster.workers) {
      cluster.workers[id].send(processedData);
    }
  });

  tws.on("close", () => {
    console.log("Disconnected from TwelveData WebSocket for XAU");
    setTimeout(connectToTwelveDataXAU, 5000); // Try reconnecting after 5 seconds
  });

  tws.on("error", (error) => {
    console.error("WebSocket error for XAU:", error);
    tws.close(); // Close the WebSocket on error
  });
};

// Call both connection functions
connectToTwelveDataXAU();

// Spin up as many cluster as cpu cores available
// TODO: change 1 to cpuCount in production
for (let i = 0; i < 1; i++) {
  cluster.fork();
}

// Listen for when a cluster is down and spin up a new one to replace it
cluster.on("exit", (worker) => {
  console.log(`worker killed: ${worker.process.pid}`);
  cluster.fork();
});

var latestGMSIPrice = null;
var latestXAUPrice = null;
var latestStockPrice = null;
// Function to calculate data from twelvedata WebSocket
const processData = async (data: any) => {
  try {
    let wsData = JSON.parse(data);

    let ticker = "GMSI";
    let holdings = cachedHoldings;

    let holdingList: any = cachedHoldingList;

    if (holdingList) {
      let actualHolding = holdingList?.benchmark[constantsIds[ticker]];
      let summary: any = cachedSummary;
      let newHoldings: any = [];

      holdings?.map((x: any) => {
        let initialPrice = liveTickers[x?.symbol]?.price ?? x?.marketPrice;
        let newPrice =
          wsData?.symbol == x?.symbol ? wsData?.price : initialPrice;

        newHoldings?.push({
          ticker: x?.symbol,
          price: newPrice ?? initialPrice,
          quantity: x?.quantity,
          marketValue: x?.quantity * newPrice,
        });
      });

      let qty =
        Number(actualHolding[2]?.nav || summary?.nav) /
        Number(actualHolding[2]?.unitPrice);

      let result: any = calculateNAVandPrice(newHoldings, qty);

      saveTicker(wsData?.symbol, {
        ...liveTickers[wsData?.symbol],
        price: wsData?.price,
        currency: actualHolding[2]?.currency?.symbol,
        prevClose: Number(prevClosePrices[wsData?.symbol]) ?? 0,
      });

      // Save to Cache memory
      setImmediate(() => {
        const newYorkTime = convertToNewYorkTime(Date.now());

        latestGMSIPrice = {
          price: result?.price,
          timeStamp: newYorkTime.getTime(),
          timeString: newYorkTime.toTimeString(),
          symbol: ticker,
          status: getMarketStatusColor(newYorkTime.getTime()),
        };

        latestStockPrice = {
          price: wsData?.price,
          timeStamp: newYorkTime.getTime(),
          dateString: newYorkTime.toTimeString(),
          symbol: wsData?.symbol,
          status: getMarketStatusColor(newYorkTime.getTime()),
        };
      });

      // Your calculation logic here
      return JSON.stringify({
        ...result,
        prevPrice: actualHolding[2]?.unitPrice,
        tickers: liveTickers,
        length: Object.keys(liveTickers).length,
      }); // Example: just returning the same data for now
    } else {
      return JSON.stringify({ status: false });
    }
  } catch (error) {
    console.error("Error processing data:", error);
    // throw error;
  }
};

cron.schedule("*/30 * * * * *", async () => {
  let env = process.env.PROD;
  if (env !== "DEV")
    if (latestGMSIPrice) {
      if (latestGMSIPrice?.price) {
        const params = latestGMSIPrice;
        priceSignal.emit("price", params);
      }
    }
});

cron.schedule("*/30 * * * * *", async () => {
  let env = process.env.PROD;
  if (env !== "DEV")
    if (latestXAUPrice) {
      if (latestXAUPrice?.price) {
        const params = latestXAUPrice;
        priceSignal.emit("price", params);
      }
    }
});

// Cron job for XAU
// cron.schedule("*/30 * * * * *", async () => {
//   let env = process.env.PROD;
//   if (env !== "DEV") {
//     if (latestXAUPrice) {
//       if (latestXAUPrice?.price) {
//         const params = latestXAUPrice;
//         priceSignalXAU.emit("price", params); // Emit the latest XAU price
//       }
//     }
//   }
// });

// Function to calculate data from TwelveData WebSocket for XAU
const processDataXAU = async (data: any) => {
  try {
    let wsData = JSON.parse(data);

    let ticker = "XAU";
    let holdings = cachedHoldingsXAU;

    let holdingList: any = cachedHoldingListXAU;

    if (holdingList) {
      let actualHolding = holdingList?.benchmark[constantsIds[ticker]];
      let summary: any = cachedSummaryXAU;
      let newHoldings: any = [];

      holdings?.map((x: any) => {
        let initialPrice = liveTickersXAU[x?.symbol]?.price ?? x?.marketPrice;
        let newPrice =
          wsData?.symbol == x?.symbol ? wsData?.price : initialPrice;

        newHoldings?.push({
          ticker: x?.symbol,
          price: newPrice ?? initialPrice,
          quantity: x?.quantity,
          marketValue: x?.quantity * newPrice,
        });
      });

      let qty =
        Number(actualHolding[2]?.nav || summary?.nav) /
        Number(actualHolding[2]?.unitPrice);

      let result: any = calculateNAVandPrice(newHoldings, qty);

      saveTicker(wsData?.symbol, {
        ...liveTickersXAU[wsData?.symbol],
        price: wsData?.price,
        currency: actualHolding[2]?.currency?.symbol,
        prevClose: Number(prevClosePricesXAU[wsData?.symbol]) ?? 0,
      });

      // Save to Cache memory
      setImmediate(() => {
        const newYorkTime = convertToNewYorkTime(Date.now());

        latestXAUPrice = {
          price: result?.price,
          timeStamp: newYorkTime.getTime(),
          timeString: newYorkTime.toTimeString(),
          symbol: ticker,
          status: getMarketStatusColor(newYorkTime.getTime()),
        };

        // latestStockPrice = {
        //   price: wsData?.price,
        //   timeStamp: newYorkTime.getTime(),
        //   dateString: newYorkTime.toTimeString(),
        //   symbol: wsData?.symbol,
        //   status: getMarketStatusColor(newYorkTime.getTime()),
        // };
      });

      // Your calculation logic here
      return JSON.stringify({
        ...result,
        prevPrice: actualHolding[2]?.unitPrice,
        tickers: liveTickersXAU,
        length: Object.keys(liveTickersXAU).length,
      });
    } else {
      return JSON.stringify({ status: false });
    }
  } catch (error) {
    console.error("Error processing XAU data:", error);
    // throw error; // Uncomment if you want to propagate the error
  }
};
