import  { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

export default function MonthlyPlays() {
  const [chartData, setChartData] = useState(null);
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [monthlyPlays, setMonthlyPlays] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/get-all-daily-durations");
        const formattedData = response.data.map((item) => ({
          date: item.date,
          duration: isNaN(item.totalDuration) ? 0 : (item.totalDuration / 60).toFixed(2),
          primeTime: item.primeTime,
        }));
        setChartData(formattedData.reverse());
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (!chartData) {
      fetchChartData();
    }
  }, [chartData]);

  useEffect(() => {
    const aggregateDataByMonth = () => {
      const monthlyData = {};
      chartData.forEach((item) => {
        const month = item.date.substring(0, 7);
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

  useEffect(() => {
    const getMonthlyPlays = () => {
      const monthlyPlays = {};
      chartData.forEach((item) => {
        const month = item.date.substring(0, 7);
        if (!monthlyPlays[month]) {
          monthlyPlays[month] = 1;
        } else {
          monthlyPlays[month] += 1;
        }
      });

      const aggregatedArray = Object.keys(monthlyPlays).map((month) => ({
        date: month,
        duration: monthlyPlays[month].toFixed(2),
      }));

      setMonthlyPlays(aggregatedArray);
    };

    if (chartData) {
      getMonthlyPlays();
    }
  }, [chartData]);

  if (!chartData || monthlyChartData.length === 0 || monthlyPlays.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={monthlyChartData}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      layout="vertical" // Set layout to vertical
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="date" type="category" />
      <Tooltip />
      <Legend />
      <Bar dataKey="duration" fill="#8884d8" name="Monthly Plays" barSize={30} />
    </BarChart>
  </ResponsiveContainer>
  );
}
