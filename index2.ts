import express from "express";
import { WebSocket } from "ws";
import { WebSocketServer } from "ws";
import http from "http";
import os from "os";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import mongoose from "mongoose";
import NodeCache from "node-cache";
import cron from "node-cron";
import EventEmitter from "events";
import session from "express-session";

import {
  calculateNAVandPrice,
  getCISholdings,
  getTodayAndThreeDaysAgo,
  performanceChartDate,
  portfolioSummary,
  searchSecurityByISIN,
} from "./api/apiFuncs";
import {
  constantsIds,
  convertToNewYorkTime,
  getMarketStatusColor,
  isUSHoliday,
  isWeekend,
} from "./api/util";
import {
  MONGO_URI,
  SYMBOLS,
  StaticISINArray,
  StaticISINArray2,
} from "./utils/constant";
import { Price } from "./models/PriceModel";
import { initializeAuthService } from "./api/authService";

import livePriceRoutes from "./routes/livePriceRoute";
import fundBasics from "./routes/fundBasics";
import cisBasics from "./routes/cisBasics";
import userRoutes from "./routes/userRoutes";

dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Initialize session
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

const port = 82;

// Set up MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Initialize caches and event emitters
const cache = new NodeCache({ stdTTL: 86400 });
const cacheXAU = new NodeCache({ stdTTL: 86400 });
const cacheTickers = new NodeCache();
const priceSignal = new EventEmitter();

// Initialize global variables
let liveTickers = {};
let prevClosePrices = {};
let cachedSummary = null;
let cachedHoldingList = null;
let cachedHoldings = null;
let liveTickersXAU = {};
let prevClosePricesXAU = {};
let cachedSummaryXAU = null;
let cachedHoldingListXAU = null;
let cachedHoldingsXAU = null;
let latestGMSIPrice = null;
let latestXAUPrice = null;
let latestStockPrice = null;

// Set up database models
const LivePriceSchema = new mongoose.Schema({
  data: String,
});

const LivePriceGMSI = mongoose.model("LivePriceGMSI", LivePriceSchema);
const LivePriceXAU = mongoose.model("LivePriceXAU", LivePriceSchema);

// GLOBAL VARIABLES
export var StaticISIN = {};
export var StaticISIN2 = {};

(async () => {
  await Promise.all(
    StaticISINArray?.map(async (x) => {
      // Use Promise.all for parallel execution
      let result: any = await searchSecurityByISIN(x?.isin);

      if (result) {
        StaticISIN[x?.isin] = { ...result?.content[0], weight: x?.weight };
      }
    })
  );

  await Promise.all(
    StaticISINArray2?.map(async (x) => {
      // Use Promise.all for parallel execution
      let result: any = await searchSecurityByISIN(x?.isin);

      if (result) {
        StaticISIN2[x?.isin] = { ...result?.content[0], weight: x?.weight };
      }
    })
  );
})();

// Helper functions
const saveTicker = (symbol, data) => {
  liveTickers[symbol] = data;
  cacheTickers.set("TICKERS", liveTickers);
};

// Initialize data functions
const initializeDataGMSI = async () => {
  try {
    const ticker = "GMSI";
    const { today, yesterday, threeDaysAgo } = getTodayAndThreeDaysAgo();

    cachedHoldings = await getCISholdings(ticker, yesterday);
    cachedHoldingList = await performanceChartDate(
      constantsIds[ticker],
      threeDaysAgo,
      today
    );

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

    cachedHoldings?.forEach((holding) => {
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
    console.error("Error initializing GMSI data:", error);
  }
};

const initializeDataXAU = async () => {
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

    cachedHoldingsXAU?.forEach((holding) => {
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

// Initialize both data sets
(async () => {
  await initializeDataGMSI();
  await initializeDataXAU();
})();

// WebSocket connection handlers
const connectToTwelveDataGMSI = () => {
  const tws = new WebSocket(
    "wss://ws.twelvedata.com/v1/quotes/price?apikey=45fcdc6327c4415d8beac682b55f74c0"
  );

  tws.on("open", () => {
    console.log("Connected to TwelveData WebSocket for GMSI");
    tws.send(
      JSON.stringify({
        action: "subscribe",
        params: { symbols: SYMBOLS },
      })
    );
  });

  tws.on("message", async (data) => {
    const message = data.toString();
    let msg = JSON.parse(message);
    let processedData = await processData(
      JSON.stringify({ ...msg, type: "GMSI" })
    );

    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(processedData);
      }
    });
  });

  tws.on("close", () => {
    console.log("Disconnected from TwelveData WebSocket for GMSI");
    setTimeout(connectToTwelveDataGMSI, 5000);
  });

  tws.on("error", (error) => {
    console.error("WebSocket error for GMSI:", error);
    tws.close();
  });
};

const connectToTwelveDataXAU = () => {
  const tws = new WebSocket(
    "wss://ws.twelvedata.com/v1/quotes/price?apikey=45fcdc6327c4415d8beac682b55f74c0"
  );

  tws.on("open", () => {
    console.log("Connected to TwelveData WebSocket for XAU");
    tws.send(
      JSON.stringify({
        action: "subscribe",
        params: { symbols: "XAU/USD" },
      })
    );
  });

  tws.on("message", async (data) => {
    const message = data.toString();
    let msg = JSON.parse(message);
    let processedData = await processDataXAU(
      JSON.stringify({ type: "XAU", ...msg })
    );

    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(processedData);
      }
    });
  });

  tws.on("close", () => {
    console.log("Disconnected from TwelveData WebSocket for XAU");
    setTimeout(connectToTwelveDataXAU, 5000);
  });

  tws.on("error", (error) => {
    console.error("WebSocket error for XAU:", error);
    tws.close();
  });
};

// Connect to both WebSocket feeds
connectToTwelveDataGMSI();
connectToTwelveDataXAU();

// Process data functions
const processData = async (data) => {
  try {
    let wsData = JSON.parse(data);
    let ticker = "GMSI";
    let holdings = cachedHoldings;
    let holdingList = cachedHoldingList;

    if (holdingList) {
      let actualHolding = holdingList?.benchmark[constantsIds[ticker]];
      let summary = cachedSummary;
      let newHoldings = [];

      holdings?.map((x) => {
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
      let result = calculateNAVandPrice(newHoldings, qty);

      saveTicker(wsData?.symbol, {
        ...liveTickers[wsData?.symbol],
        price: wsData?.price,
        currency: actualHolding[2]?.currency?.symbol,
        prevClose: Number(prevClosePrices[wsData?.symbol]) ?? 0,
      });

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

      return JSON.stringify({
        ...result,
        prevPrice: actualHolding[2]?.unitPrice,
        tickers: liveTickers,
        length: Object.keys(liveTickers).length,
      });
    }
    return JSON.stringify({ status: false });
  } catch (error) {
    console.error("Error processing GMSI data:", error);
  }
};

const processDataXAU = async (data) => {
  try {
    let wsData = JSON.parse(data);
    let ticker = "XAU";
    let holdings = cachedHoldingsXAU;
    let holdingList = cachedHoldingListXAU;

    if (holdingList) {
      let actualHolding = holdingList?.benchmark[constantsIds[ticker]];
      let summary = cachedSummaryXAU;
      let newHoldings = [];

      holdings?.map((x) => {
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
      let result = calculateNAVandPrice(newHoldings, qty);

      saveTicker(wsData?.symbol, {
        ...liveTickersXAU[wsData?.symbol],
        price: wsData?.price,
        currency: actualHolding[2]?.currency?.symbol,
        prevClose: Number(prevClosePricesXAU[wsData?.symbol]) ?? 0,
      });

      setImmediate(() => {
        const newYorkTime = convertToNewYorkTime(Date.now());
        latestXAUPrice = {
          price: result?.price,
          timeStamp: newYorkTime.getTime(),
          timeString: newYorkTime.toTimeString(),
          symbol: ticker,
          status: getMarketStatusColor(newYorkTime.getTime()),
        };
      });

      return JSON.stringify({
        ...result,
        prevPrice: actualHolding[2]?.unitPrice,
        tickers: liveTickersXAU,
        length: Object.keys(liveTickersXAU).length,
      });
    }
    return JSON.stringify({ status: false });
  } catch (error) {
    console.error("Error processing XAU data:", error);
  }
};

// Set up cron jobs
cron.schedule("*/30 * * * * *", async () => {
  let env = process.env.PROD;
  if (env !== "DEV" && latestGMSIPrice?.price) {
    priceSignal.emit("price", latestGMSIPrice);
  }
});

cron.schedule("*/30 * * * * *", async () => {
  let env = process.env.PROD;
  if (env !== "DEV" && latestXAUPrice?.price) {
    priceSignal.emit("price", latestXAUPrice);
  }
});
