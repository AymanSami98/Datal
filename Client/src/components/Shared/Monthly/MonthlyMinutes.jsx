import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GET_ALL_DAILY_DURATIONS } from '../../../utils/endpoints';
// Replaced the previous BarChart import with the above line

export default function MonthlyMinutes() {
  const [chartData, setChartData] = useState(null);
  const [monthlyChartData, setMonthlyChartData] = useState([]);

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
        duration: parseFloat(monthlyData[month].toFixed(2)), // Make sure duration is a number
      }));

      setMonthlyChartData(aggregatedArray);
    };

    if (chartData) {
      aggregateDataByMonth();
    }
  }, [chartData]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(GET_ALL_DAILY_DURATIONS);
        const formattedData = response.data.map((item) => ({
          date: item.date,
          duration: isNaN(item.totalDuration) ? 0 : (item.totalDuration / 60).toFixed(2),
          primeTime: item.primeTime,
        }));
        setChartData(formattedData.reverse());
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetch();
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  if (monthlyChartData.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>Please generate a report first</p>;
  }

  return (
    <Box sx={{ width: '100%', margin: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
        Monthly Data
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={monthlyChartData}
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
          <Bar dataKey="duration" fill="#8884d8" name="Monthly Plays Time (minutes)" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
