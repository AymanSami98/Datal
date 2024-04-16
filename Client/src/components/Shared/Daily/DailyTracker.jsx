/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { DataGrid } from "@mui/x-data-grid";

import axios from "axios";
import { dailyColumns } from "../../../utils/columns";

export default function DailyTracker() {
    const [chartData, setChartData] = useState(null); // State to hold formatted data for the chart
    const [data, setData] = useState([]);
    useEffect(() => {
      const fetch = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/v1/get-all-daily-durations"
          );
          const formattedData = response.data.map((item) => ({
            date: item.date,
            duration: isNaN(item.totalDuration)
              ? 0
              : (item.totalDuration / 60).toFixed(2),
            primeTime: item.primeTime,
          }));
          setChartData(formattedData.reverse());
          setData(response.data);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };
      fetch();
    }, []);
  
    // If data has not been fetched yet, display loading state
    if (chartData === null) {
      return <div>Loading...</div>;
    }
  
    const getRowId = (row) => `${row.date}-${row.createdAt}`;
  
    // Extract date and duration arrays from chartData
    const dates = chartData.map((item) => item.date);
    const durations = chartData.map((item) => item.duration);
    const primeTime = chartData.map((item) => item.primeTime);
    return (
      <>
        <LineChart
          series={[{ data: durations, label: "Plays Time (minutes)" }]}
          width={1200}
          height={300}
          xAxis={[{ scaleType: "band", data: dates }]}
          sx={{
            ".MuiLineElement-root": {
              stroke: "#8884d8",
              strokeWidth: 2,
            },
            ".MuiMarkElement-root": {
              stroke: "#8884d8",
              scale: "0.6",
              fill: "#fff",
              strokeWidth: 2,
            },
          }}
        />
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={dailyColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            getRowId={getRowId}
          />
        </div>
      </>
    );
  }
  