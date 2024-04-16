import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip,  CartesianGrid } from 'recharts';
import { Typography } from "@mui/material";


export default function TopContents() {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/get-matched-content-and-content-reports"
        );
        const data = response.data;

        const flattenedData = data
          .map((item) => {
            return item.content_reports.map((report) => {
              return {
                ...report,
                title: item.title,
                duration: item.duration,
                publishDate: item.publishDate,
              };
            });
          })
          .flat(); // Flatten the array of arrays

        setContents(flattenedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetch();
  }, []);

  if (contents.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Please generate a report first
      </p>
    );
  }

  if (contents === null) {
    return <div>Loading...</div>;
  }

  // Filter contents based on title containing "pm"
  const pmTitles = contents.filter(item => item.title && item.title.toLowerCase().includes('pm'));

  // Sort and take top 2 contents based on session time
  const top2PmContents = pmTitles.sort((a, b) => b.sessionsTime - a.sessionsTime).slice(0, 10);

  // Convert session time from seconds to minutes
  const pmContentsInMinutes = top2PmContents.map(item => ({
    ...item,
    sessionsTime: (item.sessionsTime / 60).toFixed(2) // Convert to minutes
  }));

  // Filter contents based on title not containing "pm"
  const nonPmTitles = contents.filter(item => item.title && !item.title.toLowerCase().includes('pm'));

  // Sort and take top 2 contents based on session time
  const top2NonPmContents = nonPmTitles.sort((a, b) => b.sessionsTime - a.sessionsTime).slice(0, 10);

  // Convert session time from seconds to minutes
  const nonPmContentsInMinutes = top2NonPmContents.map(item => ({
    ...item,
    sessionsTime: (item.sessionsTime / 60).toFixed(2) // Convert to minutes
  }));

  return (
    <div>
         <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
        Top 10 Livestreams
      </Typography>
       <BarChart width={800} height={400} data={pmContentsInMinutes} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis width={400} type="category" dataKey="title"  textAnchor="end" />
        <Tooltip />
        
        <Bar dataKey="sessionsTime" fill="#8884d8"
        name ="Watch time in minutes"
        />
      </BarChart>
      
      {/* Chart for top 2 titles not containing "pm" */}
      <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
        Top 10 On-Demand Videos
      </Typography>
      <BarChart width={800} height={400} data={nonPmContentsInMinutes} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis width={400} type="category" dataKey="title"  textAnchor="end" />
        <Tooltip />
        <Bar dataKey="sessionsTime" fill="#82ca9d" 
        name ="Watch time in minutes"
        />
      </BarChart>


     
      
    </div>
  );
}


