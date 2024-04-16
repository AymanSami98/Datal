import { useState } from "react";
import { Button } from "@mui/material";
import Papa from "papaparse";
import { parseISO, format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

function NewReport() {
  const [file, setFile] = useState(null);
  const [newSubscribersData, setNewSubscribersData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target.result;
      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          analyzeData(results.data);
        },
      });
    };
    reader.readAsText(file);
  };

  const analyzeData = (data) => {
    let monthlyNewSubscribers = {};
    let monthlyRevenue = {};

    data.forEach(
      ({ "Subscribed At": subscribedAt}) => {
        // Skip the row if subscribedAt is blank or invalid
        if (!subscribedAt || subscribedAt.trim() === "") {
          return;
        }
      }
    );

    data.forEach((item) => {
      const { "Subscribed At": subscribedAt, "Final Price": finalPrice } = item;
      if (
        !subscribedAt ||
        subscribedAt.trim() === "" ||
        subscribedAt === "2023-02-28"
      ) {
        return;
      }

      const monthYear = format(parseISO(subscribedAt), "yyyy-MM");

      if (!monthlyNewSubscribers[monthYear]) {
        monthlyNewSubscribers[monthYear] = 0;
      }
      monthlyNewSubscribers[monthYear]++;

      if (finalPrice && finalPrice.trim() !== "") {
        if (!monthlyRevenue[monthYear]) {
          monthlyRevenue[monthYear] = 0;
        }
        monthlyRevenue[monthYear] += parseFloat(finalPrice) / 100;
      }
    });

    const newSubscribersChartData = Object.keys(monthlyNewSubscribers).map(
      (monthYear) => ({
        month: monthYear,
        newSubscribers: monthlyNewSubscribers[monthYear],
        revenue: monthlyRevenue[monthYear] || 0,
      })
    );

    setNewSubscribersData(newSubscribersChartData);
    setRevenueData(newSubscribersChartData);
  };

  return (
    <div className="dashboard">
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" onClick={handleAnalyze}>
        Analyze Data
      </Button>

      {newSubscribersData.length > 0 && (
        <>
          <h2>New Subscribers</h2>
          <ResponsiveContainer width="50%" height={300}>
            <BarChart data={newSubscribersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="newSubscribers"
                fill="#82ca9d"
                name="New Subscribers"
              />
              <ReferenceLine
                y={140}
                label="Goal"
                stroke="red"
                strokeDasharray="3 3"
              />
            </BarChart>
          </ResponsiveContainer>

          <h2>Revenue</h2>
          <ResponsiveContainer width="50%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                label={{ value: "£", position: "insideLeft", angle: -90 }}
              />
              <Tooltip formatter={(value) => `£${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
              <ReferenceLine y={5000} stroke="red" strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
          
        </>
      )}
    </div>
  );
}

export default NewReport;
