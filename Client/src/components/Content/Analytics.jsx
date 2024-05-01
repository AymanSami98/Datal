import { useEffect, useState } from "react";
// import largeData from "../../assets/csvjson.json";
import Card from '@mui/material/Card';

function Analytics() {
    const [averagePlaysPerMonth, setAveragePlaysPerMonth] = useState(0);
    const [averageMinutesWatchedPerMonth, setAverageMinutesWatchedPerMonth] = useState(0);
const largeData = [];
    useEffect(() => {
        // Calculate the sum of SessionID, Duration, and sort by play count
        let totalSessionIDs = 0;
        let totalDuration = 0;
    
        // Track VideoID plays and duration
        const videoIDPlays = {};
        const videoIDDuration = {};
    
        largeData.forEach((data) => {
          totalSessionIDs += 1;
          const duration = data.Duration || 0;
          totalDuration += duration;
    
          const videoID = data.VideoID;
          if (videoID) {
            videoIDPlays[videoID] = (videoIDPlays[videoID] || 0) + 1;
            videoIDDuration[videoID] = (videoIDDuration[videoID] || 0) + duration;
          }
    
        });
        setAveragePlaysPerMonth(totalSessionIDs / 6);
        setAverageMinutesWatchedPerMonth(totalDuration / (60 * 6)); // Convert seconds to minutes
     
      }, []);
      const x = " Average Number of Plays Per Month:" + averagePlaysPerMonth.toFixed(2);
  return (
  <div className="ana">

<Card className="card" variant="outlined">{x}</Card>
<Card className="card" variant="outlined">Average Minutes Watched Per Month: {averageMinutesWatchedPerMonth.toFixed(2)}</Card>
</div>
  )
}

export default Analytics