import React, { useContext, useState, useEffect } from "react";
import { mockHistoricalData } from "../constants/mock";
import {
  convertUnixTimestampToDate,
  convertDateToUnixTimestamp,
  createDate,
} from "../helpers/date-helper";
import {
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Tooltip,
} from "recharts";
import Card from "./Card";
import { chartConfig } from "../constants/config";
import ChartFilter from "./ChartFilter";
import ThemeContext from "../context/ThemeContext";
import { fetchHistoricalData } from "../api/stock-api";
import StockContext from "../context/StockContext";
import { fetchHistoricalDataAlphaVantage } from "../api/stock-api";

const Chart = () => {
  const [data, setData] = useState(mockHistoricalData);

  const [filter, setFilter] = useState("1W");

  const { darkMode } = useContext(ThemeContext);

  const { stockSymbol } = useContext(StockContext);

  const formatData = (data) => {
    return data.c.map((item, index) => {
      return {
        value: item.toFixed(2),
        date: convertUnixTimestampToDate(data.t[index]),
      };
    });
  };
  
  const formatAlphaData = (data) => {
    return Object.entries(data).map(([date, item]) => {
        return {
          value: item["1. open"], // Format the 'close' value with 2 decimal places
          date: date
        };
      });
  }

  useEffect(() => {
    const updateChartData = async () => {
      try {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${stockSymbol}&apikey=X537RXX81FAGF1SU`;
        const response = await fetch(url);

        if (!response.ok) {
          const message = `An error has occurred: ${response.status}`;
          throw new Error(message);
        }

        const data = await response.json();
        const monthlyData = data["Monthly Time Series"];

        const filteredData = {};
        const cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);

        for (const [date, values] of Object.entries(monthlyData)) {
          const recordDate = new Date(date);
          if (recordDate >= cutoffDate) {
            filteredData[date] = values;
          }
        }
        setData(filteredData)
      } catch (error) {
        console.log(error);
      }
    };

    updateChartData();
  }, [stockSymbol]);

  return (
    <Card>
      <ul className="flex absolute top-2 right-2 z-40">
        {Object.keys(chartConfig).map((item) => (
          <li key={item}>
            <ChartFilter
              text={item}
              active={filter === item}
              onClick={() => {
                setFilter(item);
              }}
            />
          </li>
        ))}
      </ul>
      <ResponsiveContainer>
        <AreaChart data={formatAlphaData(data).reverse()}>
          <defs>
            <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={darkMode ? "#312e81" : "rgb(199 210 254)"}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={darkMode ? "#312e81" : "rgb(199 210 254)"}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="#312e81"
            fillOpacity={1}
            fill="url(#chartColor)"
            strokeWidth={0.5}
          />
          <Tooltip
            contentStyle={darkMode ? { backgroundColor: "#111827" } : null}
            itemStyle={darkMode ? { color: "#818cf8" } : null}
          />
          <XAxis dataKey="date" />
          <YAxis domain={["dataMin", "dataMax"]} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Chart;
