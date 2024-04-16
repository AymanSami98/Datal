import  { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DailyLineChart() {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/get-all-daily-durations");
                const formattedData = response.data.map(item => ({
                    date: item.date,
                    duration: isNaN(item.totalDuration) ? 0 : parseFloat((item.totalDuration / 60).toFixed(2)), // Convert to number
                }));
                setChartData(formattedData.reverse());
            } catch (error) {
                console.error("Error fetching chart data: ", error);
            }
        };
        fetchChartData();
    }, []);
    
    if (chartData === null) {
        return <div>Loading...</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="duration" name='Plays Time (minutes)' stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}
