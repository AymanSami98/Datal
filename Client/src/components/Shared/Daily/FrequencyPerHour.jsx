import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Box } from "@mui/material";

export default function FrequencyPerHour() {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/get-all-daily-durations");
                const primeTimes = response.data.map(item => item.primeTime); // Assuming primeTime is your hour data
                const frequencyMap = primeTimes.reduce((acc, primeTime) => {
                    acc[primeTime] = (acc[primeTime] || 0) + 1;
                    return acc;
                }, {});
    
                // Convert the frequency map to an array and sort it by hour
                const formattedData = Object.keys(frequencyMap).map(hour => ({
                    hour, frequency: frequencyMap[hour]
                })).sort((a, b) => {
                    // Assuming the format is 'HH:MM', we can sort by the hour part directly
                    return parseInt(a.hour.split(":")[0]) - parseInt(b.hour.split(":")[0]);
                });
    
                setChartData(formattedData);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
    
        fetchData();
    }, []);
    
    if (chartData.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ width: "100%", height: 300, margin: "auto" }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="frequency" fill="#8884d8" name="
                    Best Hour of the Day"
                    />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}
