import { Box, Card, CardContent } from "@mui/material";

function Cards() {
    const averagePlaysPerMonth = 6957;
    const averageMinutesWatchedPerMonth = 43377;
  return (
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
  )
}

export default Cards