import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { GET_ALL_DAILY_DURATIONS } from "../../../utils/endpoints";

export default function PrimeTime() {
  const [chartData, setChartData] = useState(null);
  const [monthlyChartData, setMonthlyChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          GET_ALL_DAILY_DURATIONS
        );
        const formattedData = response.data.map((item) => ({
          date: item.date,
          duration: isNaN(item.totalDuration)
            ? 0
            : (item.totalDuration / 60).toFixed(2),
          primeTime: parseFloat(item.primeTime),
        }));
        setChartData(formattedData.reverse());
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const aggregateDataByMonth = () => {
      const monthlyData = {};
      chartData?.forEach((item) => {
        const month = item.date.substring(0, 7); // Extract YYYY-MM
        const duration = parseFloat(item.duration);
        if (!monthlyData[month]) {
          monthlyData[month] = duration;
        } else {
          monthlyData[month] += duration;
        }
      });

      const aggregatedArray = Object.keys(monthlyData).map((month) => ({
        date: month,
        duration: monthlyData[month].toFixed(2),
      }));

      setMonthlyChartData(aggregatedArray);
    };

    if (chartData) {
      aggregateDataByMonth();
    }
  }, [chartData]);

  if (!monthlyChartData.length || !chartData) {
    return (
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Please generate a report first
      </p>
    );
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="primeTime"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="Prime Hour (24h format)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
