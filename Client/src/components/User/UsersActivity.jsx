/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./style.css";
import {CustomTable} from "../../middleware";


function UsersActivity() {
  const [userDurations, setUserDurations] = useState({});
  const [userTitles, setUserTitles] = useState({});
  const [userCountries, setUserCountries] = useState({});
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userCounts, setUserCounts] = useState({});
  const [totalUsers, setTotalUsers] = useState(0);
  const [jsonData, setJsonData] = useState([]);
  const [categories, setCategories] = useState({});

  // Function to handle the file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target.result);
          setJsonData(parsedData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };

      reader.readAsText(file);
    }
  };

  useEffect(() => {
    const processJSON = () => {
      const counts = {};
      const durations = {};
      const titles = {};
      const countries = {};

      jsonData.forEach((data) => {
        const userId = data.UserID;
        const duration = data.Duration || 0;
        const contentTitle = data.ContentTitle;
        const countryName = data.CountryName;

        if (userId) {
          counts[userId] = (counts[userId] || 0) + 1;
          durations[userId] = (durations[userId] || 0) + duration;
          if (!titles[userId] || duration > durations[titles[userId]]) {
            titles[userId] = contentTitle;
          }
          countries[userId] = countryName;
        }
      });

      setUserCounts(counts);
      setUserDurations(durations);
      setUserTitles(titles);
      setUserCountries(countries);

      // Define your categories dynamically
      const newCategories = {};
      Object.entries(counts).forEach(([userId, count]) => {
        if (count >= 1 && count <= 5) {
          newCategories["Casual"] = newCategories["Casual"] || [];
          newCategories["Casual"].push({ userId, count });
        } else if (count > 5 && count <= 30) {
          newCategories["Regular"] = newCategories["Regular"] || [];
          newCategories["Regular"].push({ userId, count });
        } else if (count > 30) {
          newCategories["Dedicated"] = newCategories["Dedicated"] || [];
          newCategories["Dedicated"].push({ userId, count });
        }
      });
      setCategories(newCategories);

      setLoading(false);
    };

    processJSON();
  }, [jsonData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Helper function to convert seconds to hours
  const secondsToHours = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <>
          <input type="file" accept=".json" onChange={handleFileChange} />

    <div className="User">

      {Object.entries(categories).map(([category, users]) => (
        <div key={category} className="scrollable-table">
          <div>{category} Users</div>
          <CustomTable
            data={users}
            columns={[
              { label: "User ID", field: "userId" },
              { label: "Count", field: "count" },
              {
                label: "Total Duration",
                render: (row) => secondsToHours(userDurations[row.userId]),
              },
              {
                label: "Most Watched Content Title",
                render: (row) => userTitles[row.userId],
              },
              {
                label: "Country Name",
                render: (row) => userCountries[row.userId],
              },
            ]}
          />
        </div>
      ))}
    </div>
    </>

  );
}

export default UsersActivity;
