import { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  contentsListColumns,
  usersListColumns,
  dailyColumns,
} from "../utils/columns";
import { LineChart,BarChart } from "@mui/x-charts";


function Dashboard() {
  const averagePlaysPerMonth = 6957;
  const averageMinutesWatchedPerMonth = 43377;
  const [contents, setContents] = useState([]);
  const [users, setUsers] = useState([]);
  const [chartData, setChartData] = useState(null); // State to hold formatted data for the chart
  const [data, setData] = useState([]);
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [monthlyPlays, setMonthlyPlays] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Function to get total plays per month based on 
    const getMonthlyPlays = () => {

      const monthlyPlays = {};
      chartData.forEach(item => {
        const month = item.date.substring(0, 7); // Extract YYYY-MM
        if (!monthlyPlays[month]) {
          monthlyPlays[month] = 1;
        } else {

          monthlyPlays[month] += 1;
        }
      });

      // Convert the aggregated data to an array suitable for the chart
      const aggregatedArray = Object.keys(monthlyPlays).map(month => ({
        date: month,
        duration: monthlyPlays[month].toFixed(2)
      }));

      setMonthlyPlays(aggregatedArray);
    };

    if (chartData) {
      getMonthlyPlays();
    }
  }, [chartData]);

  

  useEffect(() => {
    // Function to aggregate data by month
    const aggregateDataByMonth = () => {
      const monthlyData = {};
      chartData.forEach(item => {
        const month = item.date.substring(0, 7); // Extract YYYY-MM
        const duration = parseFloat(item.duration);
        if (!monthlyData[month]) {
          monthlyData[month] = duration;
        } else {
          monthlyData[month] += duration;
        }
      });

      // Convert the aggregated data to an array suitable for the chart
      const aggregatedArray = Object.keys(monthlyData).map(month => ({
        date: month,
        duration: monthlyData[month].toFixed(2)
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
        const response = await axios.get(
          "http://localhost:8000/api/v1/get-matched-content-and-content-reports"
        );
        const data = response.data;

        const flattenedData = data.map(item => {
          return item.content_reports.map(report => {
              return {
                  ...report,
                  title: item.title,
                  duration: item.duration,
                  publishDate: item.publishDate,
              };
          });
      }).flat(); // Flatten the array of arrays

      setContents(flattenedData);      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetch();
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/get-matched-users-and-customers-reports"
        );
        const data = response.data;

        const flattenedData = data.map(item => {
          return item.customer_reports.map(report => {
              return {
                  ...report,
                  
              };
          });
      }
      ).flat(); // Flatten the array of arrays

      setUsers(flattenedData);
        
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchUsers();
  }, []);

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
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/get-all-reports"
        );
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetch();
  }, []);
if(users.length === 0 || chartData.length === 0 || contents.length === 0 || monthlyChartData.length === 0){
  return (
   <p style={{textAlign: 'center', marginTop: '20px'}}>Please generate a report first</p>

  )
}
  if (users === null) {
    return <div>Loading...</div>;
  }
  if (chartData === null) {
    return <div>Loading...</div>;
  }

  if (contents === null) {
    return <div>Loading...</div>;
  }

  if (monthlyChartData === null) {
    return <div>Loading...</div>;
  }
  if(reports === null){
    return <div>Loading...</div>;
  }
  console.log(reports);


  const getDailyRowId = (row) => `${row.date}-${row.createdAt}`;
  const shows =[   {
    "id": 2622954,
    "title": "Live From the Bill Murray - 5th Oct - Catch-Up",
    "watchTime": 86645
   },
   {
    "id": 2780072,
    "title": "Live from the Bill Murray - 14th December - Catch-Up",
    "watchTime": 52279
   },
   {
    "id": 2700674,
    "title": "Just The Tonic - Live from Leicester - 4th Nov - Catch-Up",
    "watchTime": 55448
   },
   {
    "id": 2780056,
    "title": "Will BF - Live at MCA 2023",
    "watchTime": 7759
   },
   {
    "id": 2698160,
    "title": "Live From the Bill Murray - 2nd Nov - Catch-Up",
    "watchTime": 55275
   },
   {
    "id": 2713360,
    "title": "Jojo Maberly live at MCA 2023 Final",
    "watchTime": 6642
   },
   {
    "id": 2733376,
    "title": "Glee Club - Live from Birmingham - 24th Nov - Catch-Up",
    "watchTime": 87178
   },
   {
    "id": 2780055,
    "title": "Will Owen - Live at LST NCOTY 2022",
    "watchTime": 3324
   },
   {
    "id": 2617710,
    "title": "Glee Club - Live from Birmingham - 29th Sep - Catch-Up",
    "watchTime": 98089
   }]

  // Convert watch time from seconds to minutes
  const watchTimeInMinutes = shows.map(show => ({
    title: show.title,
    watchTime: Math.round(show.watchTime / 60)
  }));

  // Extract date and duration arrays from chartData
  const dates = chartData.map((item) => item.date);
  const durations = chartData.map((item) => item.duration);
  const monthlyDates = monthlyChartData.map(item => item.date);
  const monthlyDurations = monthlyChartData.map(item => item.duration);
  const primeTime = chartData.map((item) => item.primeTime);
  const primeTimes = chartData.map((item) => item.primeTime); // Retain the original time string
  const yValues = chartData.map((_, index) => index + 1); // Example y-axis values
  const monthlyPlaysDates = monthlyPlays.map(item => item.duration);

const reportsdates = reports.map(report => report.date);
const repoertsuniqueViewsData = reports.map(report => report.uniqueViews);
const reportssessionsCountData = reports.map(report => report.sessionsCount);

  

  const getRowId = (row) => `${row.publishDate}-${row.createdAt}`;
  return (
    <div className="dashboard">
      <div className="ana">
        <Card sx={{ display: "flex" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              Average Number of Plays Per Month in the last report:
            </CardContent>
            <CardContent sx={{ flex: "1 0 auto" }}>
              {averagePlaysPerMonth.toFixed(2)}
            </CardContent>
          </Box>
        </Card>
        <Card sx={{ display: "flex" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              Average Minutes Watched Per Month in the last report:
            </CardContent>
            <CardContent sx={{ flex: "1 0 auto" }}>
              {averageMinutesWatchedPerMonth.toFixed(2)}
            </CardContent>
          </Box>
        </Card>
      </div>
      <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
        Reacent Report Contents List
      </Typography>
      <div style={{ height: 400, marginTop: 10, width: "80%" }}>
        <DataGrid
          rows={contents}
          columns={contentsListColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          getRowId={getRowId}
        />
      </div>
      <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
        Reacent Report Users List
      </Typography>
      <div style={{ height: 400, marginTop: 50, width: "80%" }}>
        <DataGrid
          rows={users}
          columns={usersListColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          getRowId={getRowId}
        />
      </div>
      <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
        Daily Data 
      </Typography>
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
       <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
        Monthly Data
      </Typography>
      <Box sx={{ width: '80%', margin: 'auto' }}>
      {Array.isArray(monthlyChartData) && monthlyChartData.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
            Monthly Data
          </Typography>
          <BarChart
            series={[{ data: monthlyDurations, label: "Monthly Plays Time (minutes)" }]}
            width={600} // Take the full width of the Box container
            height={300}
            xAxis={[{ scaleType: "band", data: monthlyDates }]}
            sx={{ /* ...existing styling... */ }}
          />
        </>
      )}
    </Box>
    <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
      Reports
      </Typography>
      <div style={{ height: 400, marginTop: 50, width: "80%" }}>
      <BarChart
      series={[
        { data: repoertsuniqueViewsData, label: "Unique Views" },
        { data: reportssessionsCountData, label: "Sessions Count" },
        // Add more series data if needed
      ]}
      width={1200}
      height={300}
      xAxis={[{ scaleType: "band", data: reportsdates }]}
      sx={{
        ".MuiBarElement-root": {
          fill: "#8884d8",
          stroke: "#8884d8",
          strokeWidth: 2,
        },
        // Additional styles as needed
      }}
    />
      </div>
<BarChart
        series={[{ data: monthlyPlaysDates, label: "Monthly Plays" }]}
        width={1200}
        height={300}
        xAxis={[{ scaleType: "band", data: monthlyDates }]}
        sx={{
          ".MuiBarElement-root": {
            fill: "#8884d8",
            stroke: "#8884d8",
            strokeWidth: 2,
          },
          // Additional styles as needed
        }}
      />
      <LineChart
        series={[{ data: primeTime, label: "Prime Time" }]}
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

      <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
      Ongoing top 20 Live Streams
      </Typography>
      <BarChart
      series={[
        {
          data: watchTimeInMinutes.map(show => show.watchTime),
          label: "Watch Time (minutes)"
        }
      ]}
      width={1200}
      height={300}
      xAxis={[{ scaleType: "band", data: watchTimeInMinutes.map(show => show.title) }]}
      sx={{
        ".MuiBarElement-root": {
          fill: "#8884d8",
          stroke: "#8884d8",
          strokeWidth: 2
        },
        // Additional styles as needed
      }}
    />
 <Box sx={{ width: '80%', margin: 'auto' }}>
      <BarChart
        series={[{ data: yValues, label: "Frequency Per hour" }]}
        width={600} // Take the full width of the Box container
        height={300}
        xAxis={[{ scaleType: "band", data: primeTimes }]}
        sx={{
          ".MuiBarElement-root": {
            fill: "#8884d8",
            stroke: "#8884d8",
            strokeWidth: 2,
          },
          // Additional styles as needed
        }}
      />
    </Box>
      <div style={{ height: 400, width: "80%", marginTop: 50 }}>
        <DataGrid
          rows={data}
          columns={dailyColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          getRowId={getDailyRowId}
        />
      </div>
    </div>
  );
}

export default Dashboard;
