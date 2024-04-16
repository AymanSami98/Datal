import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';

export default function Report() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/get-all-reports');
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchReports();
  }, []);

  if (reports.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>Please generate a report first</p>;
  }

  if (reports === null) {
    return <div>Loading...</div>;
  }

  const reportsdates = reports.map((report) => report.date);
  const repoertsuniqueViewsData = reports.map((report) => report.uniqueViews);
  const reportssessionsCountData = reports.map((report) => report.sessionsCount);

  return (
    <Box sx={{ width: "100%", height: 300, margin: "auto" }}>

    <ResponsiveContainer width="100%" height="100%">

    <BarChart
    
      data={reportsdates.map((date, index) => ({
        date,
        uniqueViews: repoertsuniqueViewsData[index],
        sessionsCount: reportssessionsCountData[index],
      }))}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      barSize={20}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="uniqueViews" fill="#8884d8" name={"Unique Views"} />
      <Bar dataKey="sessionsCount" fill="#82ca9d" name={"Sessions Count"} />
    </BarChart>
    </ResponsiveContainer>
    </Box>
  );
}
