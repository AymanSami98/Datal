import { useState } from "react";
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
} from "recharts";
import Papa from "papaparse";

const SubscriberChart = () => {
  const [usersdata, setUsersData] = useState([]);
  const [userCycleData, setUserCycleData] = useState([]);
  // const [totalSubscribersDaa, setTotalSubscribersData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  const handleRebillingUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const csvData = event.target.result;
      const parsedData = Papa.parse(csvData, { header: true }).data;

      setUsersData(parsedData);
    };

    reader.readAsText(file);
  };

  // Process data to calculate rebilling and canceling numbers
  const processData = () => {
    let rebillingData = [];
    let cancelingData = [];
    let incomeData = [];

    // Group data by month
    const groupedData = usersdata.reduce((acc, entry) => {
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
      return {
        month,
        rebillingGoal: Math.round(previousYearRebilling * 0.9),
      };
    });

    rebillingData = Object.entries(groupedData).map(
      ([month, { rebilling }]) => ({ month, rebilling })
    );
    cancelingData = Object.entries(groupedData).map(
      ([month, { canceling }]) => ({ month, canceling: -canceling }) // Make canceling negative
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
  const calculateActiveUsersOverTime = () => {
    // Filter only active users initially
    const activeUsersInitial = usersdata.filter(
      (user) => user["Segment"] === "active"
    );

    // Initial total active users count, considering only 'active' segment
    let totalActiveUsers = activeUsersInitial.length;

    // Object to hold the count of cancellations for each future month
    let futureCancellations = {};

    // Populate futureCancellations with counts, considering only 'active' segment
    activeUsersInitial.forEach((user) => {
      const canceledAtText = user["Canceled at"];
      if (canceledAtText) {
        const effectiveDate = canceledAtText.split("effective ")[1];
        if (effectiveDate) {
          const cancelMonth = effectiveDate.slice(0, 7);
          if (!futureCancellations[cancelMonth]) {
            futureCancellations[cancelMonth] = 0;
          }
          futureCancellations[cancelMonth]++;
        }
      }
    });

    // Sort the months to ensure chronological order
    const months = Object.keys(futureCancellations).sort();

    // Object to store active users count for each month after adjustments
    let activeUsersByMonth = [];

    months.forEach((month) => {
      // Subtract future cancellations from the total active users
      totalActiveUsers -= futureCancellations[month];
      activeUsersByMonth.push({ month: month, totalUser: totalActiveUsers });
    });

    return activeUsersByMonth;
  };

  // Usage example
  const activeUsersOverTime = calculateActiveUsersOverTime();

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

  //new sub

  const handleAnalyze = (e) => {
    const file = e.target.files[0];
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

    data.forEach(({ "Subscribed At": subscribedAt }) => {
      // Skip the row if subscribedAt is blank or invalid
      if (!subscribedAt || subscribedAt.trim() === "") {
        return;
      }
    });

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
    const sortedData = newSubscribersChartData.sort((a, b) => {
      if (a.month < b.month) return -1;
      if (a.month > b.month) return 1;
      return 0;
    });

    setUserCycleData(sortedData);
    setRevenueData(sortedData);
  };

  return (
    <div className="dashboard">
      <div className="first">
        <p>Add the Users CSV</p>
        <div>
          <input type="file" accept=".csv" onChange={handleRebillingUpload} />
        </div>
      </div>
      <div className="second">
        <p>Add the Users Cycle CSV</p>
        <input type="file" onChange={handleAnalyze} />
      </div>
      <div className="third">
        <div className="inside">
          {usersdata.length > 0 && (
            <div className="new-sub-data">
              <div className="inside-chart-with-heading">
                <BarChart
                  width={600}
                  height={400}
                  data={combinedData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Bar dataKey="rebilling" fill="#82ca9d" name={"Rebilling"} />
                  <Bar dataKey="canceling" fill="red" name={"Canceling"} />
                </BarChart>
              </div>

              <div className="inside-chart-with-heading">
                <BarChart
                  width={600}
                  height={400}
                  data={combinedData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toFixed(2)} />
                  <Legend />
                  <Bar
                    dataKey={"income"}
                    fill="#8884d8"
                    name={"Estimated Income £25.6 per rebilling"}
                  />
                </BarChart>
              </div>
            </div>
          )}
          {activeUsersOverTime.length > 0 && (
            <div className="inside-chart-with-heading">
              <BarChart
                width={600}
                height={400}
                data={activeUsersOverTime}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalUser" fill="#08adbf" name={"Total Users"} />
              </BarChart>{" "}
            </div>
          )}
        </div>
        <div>
          {userCycleData.length > 0 && (
            <div className="new-sub-data">
              <div className="inside-chart-with-heading">
                <h2>Historical New Subscribers Data</h2>
                <BarChart
                  data={userCycleData}
                  width={600}
                  height={400}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
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
                    label="Goal 140 Subscribers"
                    stroke="#08adbf"
                    strokeDasharray="3 3"
                  />
                </BarChart>
              </div>
              <div className="inside-chart-with-heading">
                <h2>Historical Revenue Data</h2>
                <BarChart
                  data={revenueData}
                  width={600}
                  height={400}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    label={{ value: "£", position: "insideLeft", angle: -90 }}
                  />
                  <Tooltip formatter={(value) => `£${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                  <ReferenceLine
                    y={5000}
                    stroke="#08adbf"
                    strokeDasharray="3 3"
                    label="Goal £5000"
                  />
                </BarChart>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriberChart;
