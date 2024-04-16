import { Typography } from "@mui/material";

import {
  ContentTable,
  DailyDataGrid,
  DailyLineChart,
  FrequencyPerHour,
  MonthlyMinutes,
  MonthlyPlays,
  PrimeTime,
  Report,
  TopContents,
  UsersTable,
} from "../components";

function Home() {
  return (
    <div className="dashboard">
      <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
        Recent Report Contents List
      </Typography>
      <ContentTable />

      <TopContents />
      <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
        Recent Report Users List
      </Typography>
      <div style={{ height: 400, marginTop: 50 }}>
        <UsersTable />
      </div>
      <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
        Reports
      </Typography>
      <Report />


      <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
        Daily Data
      </Typography>
      <DailyLineChart />
      <PrimeTime />


      <MonthlyMinutes />
      <MonthlyPlays />

      <FrequencyPerHour />
      <DailyDataGrid />
    </div>
  );
}

export default Home;
