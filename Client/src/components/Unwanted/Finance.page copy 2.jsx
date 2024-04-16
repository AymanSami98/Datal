import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Papa from "papaparse";

const SubscriberChart = () => {
  const [data, setData] = useState([]);

  const handleRebillingUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const csvData = event.target.result;
      const parsedData = Papa.parse(csvData, { header: true }).data;
      
      setData(parsedData);
    };

    reader.readAsText(file);
  };

  // Process data to calculate rebilling and canceling numbers
  const processData = () => {
    let rebillingData = [];
    let cancelingData = [];
    let incomeData = [];

    // Group data by month
    const groupedData = data.reduce((acc, entry) => {
      const month = entry["Next invoice date"]
        ? entry["Next invoice date"].slice(0, 7)
        : null;
      if (month) {
        acc[month] = acc[month] || { rebilling: 0, canceling: 0, income: 0 };
        acc[month].rebilling++;
        acc[month].income += 25.6; // Adding income for rebilling
      } else {
        const canceledAt = entry["Canceled at"]?.split("effective ")[1];
        if (canceledAt) {
          const cancelMonth = canceledAt.slice(0, 7);
          acc[cancelMonth] = acc[cancelMonth] || {
            rebilling: 0,
            canceling: 0,
            income: 0,
          };
          acc[cancelMonth].canceling++;
          // Assuming no additional income from cancellations
        }
      }
      return acc;
    }, {});

    // Calculate rebilling goal based on previous year's data
    const rebillingGoalData = Object.entries(groupedData).map(([month]) => {
      const previousYear = (+month.slice(0, 4) - 1).toString() + month.slice(4);
      const previousYearRebilling = groupedData[previousYear]?.rebilling || 0;
      return { month, rebillingGoal: Math.round(previousYearRebilling * 0.9) };
    });

    rebillingData = Object.entries(groupedData).map(
      ([month, { rebilling }]) => ({ month, rebilling })
    );
    cancelingData = Object.entries(groupedData).map(
      ([month, { canceling }]) => ({ month, canceling })
    );
    incomeData = Object.entries(groupedData).map(([month, { income }]) => ({
      month,
      income,
    }));

    return {
      rebillingData,
      cancelingData,
      rebillingGoalData,
      incomeData, // Now includes estimated income data
    };
  };

  const { rebillingData, cancelingData, incomeData } = processData();
  const combinedData = rebillingData.map((entry, index) => ({
    ...entry,
    ...cancelingData[index],
    ...incomeData[index],
  }));
  combinedData.sort((a, b) => {
    if (a.month < b.month) return -1;
    if (a.month > b.month) return 1;
    return 0;
  });
  return (
    <>
      <div className="dashboard">
        <p>Add the Users CSV</p>
        <div>
          <input type="file" accept=".csv" onChange={handleRebillingUpload} />
        </div>
        <div>
          {data.length > 0 && (
            <>
              <BarChart
                width={800}
                height={400}
                data={combinedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rebilling" fill="#8884d8" />
                <Bar dataKey="canceling" fill="#82ca9d" />
              </BarChart>
              <BarChart
                width={800}
                height={400}
                data={combinedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => value.toFixed(2)} />
                <Legend />
                <Bar dataKey={"income"} fill="#8884d8" />
              </BarChart>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SubscriberChart;
